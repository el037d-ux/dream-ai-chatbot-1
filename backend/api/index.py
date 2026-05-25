import os
import json
import hashlib
import secrets
import uuid
import base64
import urllib.request
import urllib.error
import psycopg2
from datetime import datetime, timedelta

# ── Config ────────────────────────────────────────────────────────────────────
DB_URL     = os.environ.get('DATABASE_URL', '')
SCHEMA     = os.environ.get('MAIN_DB_SCHEMA', 'public')
SHOP_ID    = '1365310'
YK_SECRET  = 'live_ljq-vesr-vSCdEt08daoW88CbTRd-ZkwOzRgiKfHml0'
AI_KEY     = os.environ.get('AITUNNEL_API_KEY', '')
FREE_LIMIT = 3
PRICE      = '119.00'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

SYSTEM_PROMPT = """Ты — Морфей, мистический толкователь снов. Ты глубокий психолог, эзотерик и знаток сонников.

Анализируй сон пользователя по пяти источникам толкования:

1. Сонник Миллера — практическое толкование образов и их связь с реальной жизнью, бизнесом, отношениями
2. Сонник Нострадамуса — пророческий, мистический взгляд, предсказания и знаки судьбы
3. Сонник Ванги — народная мудрость, энергетика, связь с предками и судьбой
4. Аналитическая психология Юнга — архетипы, коллективное бессознательное, Тень, Анима/Анимус, индивидуация
5. Психоанализ Фрейда — Ид/Эго/Супер-Эго, вытесненные желания, символика подсознания

Структура ответа (строго соблюдай формат, жирный текст через **):

📖 **Сонник Миллера**
[2 предложения — практическое значение для жизни]

🔯 **Сонник Нострадамуса**
[2 предложения — пророческое, мистическое значение]

🌿 **Сонник Ванги**
[2 предложения — народное толкование, судьба, энергия]

✨ **Анализ по Юнгу**
[2 предложения — архетипы и психологические символы]

🔮 **Анализ по Фрейду**
[2 предложения — психоаналитическая интерпретация]

💫 **Общее послание**
[1-2 предложения — итоговый вывод и совет]

Отвечай на русском языке. Будь глубоким, поэтичным и мистическим. Каждый раздел должен давать уникальный взгляд на сон. Не повторяй одни и те же фразы."""


# ── DB helpers ────────────────────────────────────────────────────────────────
def get_conn():
    conn = psycopg2.connect(DB_URL, options=f'-c search_path={SCHEMA}')
    conn.autocommit = True
    return conn

def hash_pw(pw: str) -> str:
    return hashlib.sha256(f'morpheus_salt_2026{pw}'.encode()).hexdigest()

def make_token(uid: int, email: str) -> str:
    return hashlib.sha256(f'{uid}:{email}:{secrets.token_hex(16)}'.encode()).hexdigest()


# ── Action handlers ───────────────────────────────────────────────────────────
def handle_auth(body: dict) -> dict:
    """Регистрация / вход по email+пароль."""
    action   = body.get('action')
    email    = (body.get('email') or '').strip().lower()
    password = body.get('password') or ''

    if not email or not password or action not in ('register', 'login'):
        return {'statusCode': 400, 'body': json.dumps({'error': 'Укажите email, пароль и действие'})}
    if len(password) < 6:
        return {'statusCode': 400, 'body': json.dumps({'error': 'Пароль — минимум 6 символов'})}

    pw_hash = hash_pw(password)
    conn = get_conn(); cur = conn.cursor()

    if action == 'register':
        cur.execute('SELECT id FROM users WHERE email = %s', (email,))
        if cur.fetchone():
            cur.close(); conn.close()
            return {'statusCode': 409, 'body': json.dumps({'error': 'Email уже зарегистрирован'})}
        cur.execute('INSERT INTO users (email, password_hash) VALUES (%s, %s) RETURNING id, free_requests_used', (email, pw_hash))
        row = cur.fetchone(); user_id, free_used = row[0], row[1]
    else:
        cur.execute('SELECT id, password_hash, free_requests_used FROM users WHERE email = %s', (email,))
        row = cur.fetchone()
        if not row or row[1] != pw_hash:
            cur.close(); conn.close()
            return {'statusCode': 401, 'body': json.dumps({'error': 'Неверный email или пароль'})}
        user_id, _, free_used = row[0], row[1], row[2]

    cur.execute("SELECT expires_at FROM subscriptions WHERE user_id=%s AND status='active' AND expires_at>NOW() ORDER BY expires_at DESC LIMIT 1", (user_id,))
    sub = cur.fetchone()
    cur.close(); conn.close()

    return {'statusCode': 200, 'body': json.dumps({
        'token': make_token(user_id, email),
        'user_id': user_id, 'email': email,
        'free_requests_used': free_used,
        'has_subscription': sub is not None,
        'subscription_expires': sub[0].isoformat() if sub else None,
    }, ensure_ascii=False)}


def handle_analyze(body: dict) -> dict:
    """Анализ сна через AiTunnel с проверкой лимитов."""
    messages   = body.get('messages', [])
    dream_text = body.get('dream', '')
    user_id    = body.get('user_id')
    access     = {}

    if not messages and not dream_text:
        return {'statusCode': 400, 'body': json.dumps({'error': 'Нет текста сна'})}

    if user_id:
        conn = get_conn(); cur = conn.cursor()
        cur.execute('SELECT free_requests_used FROM users WHERE id = %s', (user_id,))
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            return {'statusCode': 404, 'body': json.dumps({'error': 'Пользователь не найден'})}
        free_used = row[0]
        cur.execute("SELECT id FROM subscriptions WHERE user_id=%s AND status='active' AND expires_at>NOW() LIMIT 1", (user_id,))
        has_sub = cur.fetchone() is not None
        allowed = has_sub or free_used < FREE_LIMIT
        if allowed and not has_sub:
            cur.execute('UPDATE users SET free_requests_used = free_requests_used + 1 WHERE id = %s', (user_id,))
            free_used += 1
        cur.close(); conn.close()
        access = {'allowed': allowed, 'free_used': free_used, 'has_sub': has_sub}
        if not allowed:
            return {'statusCode': 403, 'body': json.dumps({'error': 'limit_reached', 'message': 'Использованы все 3 бесплатных запроса.', 'free_used': free_used})}

    chat_msgs = [{'role': 'system', 'content': SYSTEM_PROMPT}]
    for m in (messages or []):
        if m.get('role') in ('user', 'assistant'):
            chat_msgs.append({'role': m['role'], 'content': m['content']})
    if dream_text and not messages:
        chat_msgs.append({'role': 'user', 'content': dream_text})

    payload = json.dumps({'model': 'gpt-4o-mini', 'messages': chat_msgs, 'max_tokens': 1200, 'temperature': 0.85}).encode()
    req = urllib.request.Request('https://api.aitunnel.ru/v1/chat/completions', data=payload,
        headers={'Authorization': f'Bearer {AI_KEY}', 'Content-Type': 'application/json',
                 'User-Agent': 'Mozilla/5.0 (compatible; MorpheusBot/1.0)'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            result = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        print(f"AI error {e.code}: {e.read().decode() if e.fp else ''}")
        return {'statusCode': 502, 'body': json.dumps({'error': f'Ошибка ИИ: {e.code}'})}

    answer = result['choices'][0]['message']['content']
    resp_body = {'answer': answer}
    if access:
        resp_body['free_used'] = access.get('free_used', 0)
        resp_body['has_sub']   = access.get('has_sub', False)
    return {'statusCode': 200, 'body': json.dumps(resp_body, ensure_ascii=False)}


def handle_create_payment(body: dict) -> dict:
    """Создаёт платёж ЮКасса 119 руб."""
    user_id = body.get('user_id')
    email   = body.get('email', '')
    if not user_id:
        return {'statusCode': 400, 'body': json.dumps({'error': 'Требуется user_id'})}

    idem_key = str(uuid.uuid4())
    pdata = {
        'amount': {'value': PRICE, 'currency': 'RUB'},
        'confirmation': {'type': 'redirect', 'return_url': 'https://poehali.dev'},
        'capture': True,
        'description': f'Подписка Морфей 30 дней — {email}',
        'metadata': {'user_id': str(user_id)},
    }
    if email:
        pdata['receipt'] = {
            'customer': {'email': email},
            'items': [{'description': 'Подписка Морфей 30 дней', 'quantity': '1.00',
                       'amount': {'value': PRICE, 'currency': 'RUB'},
                       'vat_code': 1, 'payment_mode': 'full_payment', 'payment_subject': 'service'}]
        }

    creds = base64.b64encode(f'{SHOP_ID}:{YK_SECRET}'.encode()).decode()
    req = urllib.request.Request('https://api.yookassa.ru/v3/payments',
        data=json.dumps(pdata).encode(),
        headers={'Authorization': f'Basic {creds}', 'Content-Type': 'application/json', 'Idempotence-Key': idem_key},
        method='POST')
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        err = e.read().decode() if e.fp else ''
        print(f'YK error {e.code}: {err}')
        return {'statusCode': 502, 'body': json.dumps({'error': f'Ошибка платежа: {e.code}'})}

    payment_id = result['id']
    conn = get_conn(); cur = conn.cursor()
    cur.execute('INSERT INTO payments (user_id, yookassa_payment_id, amount, status) VALUES (%s,%s,%s,%s)',
                (user_id, payment_id, 119, 'pending'))
    cur.close(); conn.close()

    return {'statusCode': 200, 'body': json.dumps({
        'payment_id': payment_id,
        'confirmation_url': result['confirmation']['confirmation_url'],
    }, ensure_ascii=False)}


def handle_webhook(body: dict) -> dict:
    """Вебхук ЮКасса — активирует подписку."""
    if body.get('event') != 'payment.succeeded':
        return {'statusCode': 200, 'body': json.dumps({'ok': True})}

    obj        = body.get('object', {})
    payment_id = obj.get('id')
    user_id    = obj.get('metadata', {}).get('user_id')
    if not payment_id or not user_id:
        return {'statusCode': 200, 'body': json.dumps({'ok': True})}

    conn = get_conn(); cur = conn.cursor()
    cur.execute('SELECT status FROM payments WHERE yookassa_payment_id = %s', (payment_id,))
    row = cur.fetchone()
    if not row or row[0] == 'succeeded':
        cur.close(); conn.close()
        return {'statusCode': 200, 'body': json.dumps({'ok': True})}

    cur.execute('UPDATE payments SET status=%s, paid_at=NOW() WHERE yookassa_payment_id=%s', ('succeeded', payment_id))
    expires_at = datetime.now() + timedelta(days=30)
    cur.execute('INSERT INTO subscriptions (user_id, status, expires_at, payment_id, payment_status) VALUES (%s,%s,%s,%s,%s)',
                (int(user_id), 'active', expires_at, payment_id, 'succeeded'))
    print(f'Subscription activated user_id={user_id} expires={expires_at}')
    cur.close(); conn.close()
    return {'statusCode': 200, 'body': json.dumps({'ok': True})}


# ── Main router ───────────────────────────────────────────────────────────────
def handler(event: dict, context) -> dict:
    """Единая точка входа. Роутинг по полю action в теле запроса. v3"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action', '')

    if action in ('login', 'register'):
        result = handle_auth(body)
    elif action == 'analyze':
        result = handle_analyze(body)
    elif action == 'create_payment':
        result = handle_create_payment(body)
    elif action == 'webhook':
        result = handle_webhook(body)
    else:
        result = {'statusCode': 400, 'body': json.dumps({'error': f'Неизвестный action: {action}'})}

    return {**result, 'headers': CORS}