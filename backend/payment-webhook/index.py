import os
import json
import psycopg2
from datetime import datetime, timedelta

DB_URL = os.environ.get('DATABASE_URL', '')
SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def handler(event: dict, context) -> dict:
    """Вебхук от ЮКассы — активирует подписку после успешной оплаты."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    event_type = body.get('event', '')
    payment_obj = body.get('object', {})

    print(f"Webhook event: {event_type}, payment_id: {payment_obj.get('id')}")

    # Обрабатываем только успешную оплату
    if event_type != 'payment.succeeded':
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    payment_id = payment_obj.get('id')
    metadata = payment_obj.get('metadata', {})
    user_id = metadata.get('user_id')

    if not payment_id or not user_id:
        print(f"Missing data: payment_id={payment_id}, user_id={user_id}")
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    conn = psycopg2.connect(DB_URL, options=f'-c search_path={SCHEMA}')
    conn.autocommit = True
    cur = conn.cursor()

    # Проверяем, не обработан ли уже этот платёж
    cur.execute('SELECT status FROM payments WHERE yookassa_payment_id = %s', (payment_id,))
    row = cur.fetchone()
    if not row or row[0] == 'succeeded':
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    # Обновляем статус платежа
    cur.execute(
        'UPDATE payments SET status = %s, paid_at = NOW() WHERE yookassa_payment_id = %s',
        ('succeeded', payment_id)
    )

    # Активируем подписку на 30 дней
    expires_at = datetime.now() + timedelta(days=30)
    cur.execute(
        '''INSERT INTO subscriptions (user_id, status, expires_at, payment_id, payment_status)
           VALUES (%s, %s, %s, %s, %s)''',
        (int(user_id), 'active', expires_at, payment_id, 'succeeded')
    )

    print(f"Subscription activated: user_id={user_id}, expires={expires_at}")
    cur.close(); conn.close()

    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}
