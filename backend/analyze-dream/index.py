import os
import json
import urllib.request
import urllib.error
import psycopg2

DB_URL = os.environ.get('DATABASE_URL', '')
SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')
FREE_LIMIT = 3

SYSTEM_PROMPT = """Ты — Морфей, мистический толкователь снов. Ты глубокий психолог и эзотерик.

Анализируй сон пользователя по двум школам:
1. Аналитическая психология Карла Юнга (архетипы, коллективное бессознательное, Тень, Анима/Анимус, Самость, индивидуация)
2. Психоанализ Зигмунда Фрейда (Ид/Эго/Супер-Эго, вытесненные желания, либидо, символика)

Структура ответа (используй именно такой формат с эмодзи и жирным текстом через **):

✨ **Анализ по Юнгу**
[2-3 предложения об архетипах и символах сна]

🔮 **Анализ по Фрейду**
[2-3 предложения о психоаналитической интерпретации]

💫 **Мистическое послание**
[1-2 предложения — предсказание или совет для пользователя]

Отвечай на русском языке. Будь глубоким, поэтичным и мистическим. Не повторяй одни и те же фразы."""

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
}


def check_access(user_id: int) -> dict:
    """Проверяет доступ: возвращает {allowed, free_used, has_sub}"""
    conn = psycopg2.connect(DB_URL, options=f'-c search_path={SCHEMA}')
    conn.autocommit = True
    cur = conn.cursor()

    cur.execute('SELECT free_requests_used FROM users WHERE id = %s', (user_id,))
    row = cur.fetchone()
    if not row:
        cur.close(); conn.close()
        return {'allowed': False, 'reason': 'user_not_found'}

    free_used = row[0]

    cur.execute(
        "SELECT id FROM subscriptions WHERE user_id = %s AND status = 'active' AND expires_at > NOW() LIMIT 1",
        (user_id,)
    )
    has_sub = cur.fetchone() is not None

    allowed = has_sub or free_used < FREE_LIMIT

    if allowed and not has_sub:
        cur.execute('UPDATE users SET free_requests_used = free_requests_used + 1 WHERE id = %s', (user_id,))
        free_used += 1

    cur.close(); conn.close()
    return {'allowed': allowed, 'free_used': free_used, 'has_sub': has_sub}


def handler(event: dict, context) -> dict:
    """Анализ сна через AiTunnel с проверкой лимитов (3 бесплатно, далее подписка)."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    headers = event.get('headers') or {}
    user_id_str = headers.get('X-User-Id') or headers.get('x-user-id') or ''

    body = json.loads(event.get('body') or '{}')
    messages = body.get('messages', [])
    dream_text = body.get('dream', '')
    user_id = body.get('user_id') or (int(user_id_str) if user_id_str.isdigit() else None)

    if not messages and not dream_text:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Нет текста сна'})}

    # Проверка доступа
    if user_id:
        access = check_access(int(user_id))
        if not access['allowed']:
            return {
                'statusCode': 403,
                'headers': CORS,
                'body': json.dumps({
                    'error': 'limit_reached',
                    'message': 'Использованы все 3 бесплатных запроса. Оформите подписку.',
                    'free_used': access.get('free_used', FREE_LIMIT),
                })
            }
    else:
        # Гость — не считаем, просто отвечаем (фронтенд сам считает локально)
        pass

    api_key = os.environ.get('AITUNNEL_API_KEY', '')

    chat_messages = [{'role': 'system', 'content': SYSTEM_PROMPT}]
    if messages:
        for msg in messages:
            if msg.get('role') in ('user', 'assistant'):
                chat_messages.append({'role': msg['role'], 'content': msg['content']})
    elif dream_text:
        chat_messages.append({'role': 'user', 'content': dream_text})

    payload = json.dumps({
        'model': 'gpt-4o-mini',
        'messages': chat_messages,
        'max_tokens': 600,
        'temperature': 0.85,
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.aitunnel.ru/v1/chat/completions',
        data=payload,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; MorpheusBot/1.0)',
            'Accept': 'application/json',
        },
        method='POST'
    )

    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8') if e.fp else ''
        print(f"HTTPError {e.code}: {error_body}")
        return {'statusCode': 502, 'headers': CORS, 'body': json.dumps({'error': f'Ошибка API: {e.code}'})}

    answer = result['choices'][0]['message']['content']
    response_body = {'answer': answer}
    if user_id:
        response_body['free_used'] = access.get('free_used', 0)
        response_body['has_sub'] = access.get('has_sub', False)

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps(response_body, ensure_ascii=False)
    }