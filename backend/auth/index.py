import os
import json
import hashlib
import secrets
import psycopg2

DB_URL = os.environ.get('DATABASE_URL', '')
SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def get_conn():
    conn = psycopg2.connect(DB_URL, options=f'-c search_path={SCHEMA}')
    conn.autocommit = True
    return conn


def hash_password(password: str) -> str:
    salt = 'morpheus_salt_2026'
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()


def make_token(user_id: int, email: str) -> str:
    raw = f"{user_id}:{email}:{secrets.token_hex(16)}"
    return hashlib.sha256(raw.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    """Регистрация и вход пользователя по email/паролю."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action')
    email = (body.get('email') or '').strip().lower()
    password = body.get('password') or ''

    if not email or not password or action not in ('register', 'login'):
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Укажите email, пароль и действие'})}

    if len(password) < 6:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Пароль — минимум 6 символов'})}

    pw_hash = hash_password(password)
    conn = get_conn()
    cur = conn.cursor()

    if action == 'register':
        cur.execute('SELECT id FROM users WHERE email = %s', (email,))
        if cur.fetchone():
            cur.close(); conn.close()
            return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Этот email уже зарегистрирован'})}
        cur.execute(
            'INSERT INTO users (email, password_hash) VALUES (%s, %s) RETURNING id, free_requests_used',
            (email, pw_hash)
        )
        row = cur.fetchone()
        user_id, free_used = row[0], row[1]

    else:
        cur.execute('SELECT id, password_hash, free_requests_used FROM users WHERE email = %s', (email,))
        row = cur.fetchone()
        if not row or row[1] != pw_hash:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный email или пароль'})}
        user_id, _, free_used = row[0], row[1], row[2]

    cur.execute(
        "SELECT expires_at FROM subscriptions WHERE user_id = %s AND status = 'active' AND expires_at > NOW() ORDER BY expires_at DESC LIMIT 1",
        (user_id,)
    )
    sub = cur.fetchone()
    has_subscription = sub is not None
    subscription_expires = sub[0].isoformat() if sub else None

    token = make_token(user_id, email)
    cur.close(); conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'token': token,
            'user_id': user_id,
            'email': email,
            'free_requests_used': free_used,
            'has_subscription': has_subscription,
            'subscription_expires': subscription_expires,
        }, ensure_ascii=False)
    }
