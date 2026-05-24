import os
import json
import uuid
import urllib.request
import urllib.error
import base64
import psycopg2

DB_URL = os.environ.get('DATABASE_URL', '')
SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')
SHOP_ID = os.environ.get('YOOKASSA_SHOP_ID', '')
SECRET_KEY = os.environ.get('API', '')

PRICE = '119.00'
RETURN_URL = 'https://poehali.dev'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def handler(event: dict, context) -> dict:
    """Создаёт платёж в ЮКассе на 119 руб. и возвращает ссылку для оплаты."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    user_id = body.get('user_id')
    email = body.get('email', '')

    if not user_id:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Требуется user_id'})}

    idempotence_key = str(uuid.uuid4())

    payment_data = {
        'amount': {'value': PRICE, 'currency': 'RUB'},
        'confirmation': {
            'type': 'redirect',
            'return_url': RETURN_URL,
        },
        'capture': True,
        'description': f'Подписка Морфей 30 дней — {email}',
        'metadata': {'user_id': str(user_id)},
    }

    if email:
        payment_data['receipt'] = {
            'customer': {'email': email},
            'items': [{
                'description': 'Подписка Морфей 30 дней',
                'quantity': '1.00',
                'amount': {'value': PRICE, 'currency': 'RUB'},
                'vat_code': 1,
                'payment_mode': 'full_payment',
                'payment_subject': 'service',
            }]
        }

    payload = json.dumps(payment_data).encode('utf-8')
    credentials = base64.b64encode(f'{SHOP_ID}:{SECRET_KEY}'.encode()).decode()

    req = urllib.request.Request(
        'https://api.yookassa.ru/v3/payments',
        data=payload,
        headers={
            'Authorization': f'Basic {credentials}',
            'Content-Type': 'application/json',
            'Idempotence-Key': idempotence_key,
        },
        method='POST'
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        err = e.read().decode('utf-8') if e.fp else ''
        print(f'YooKassa error {e.code}: {err}')
        return {'statusCode': 502, 'headers': CORS, 'body': json.dumps({'error': f'Ошибка платежа: {e.code}', 'detail': err})}

    payment_id = result['id']
    confirmation_url = result['confirmation']['confirmation_url']

    # Сохраняем платёж в БД
    conn = psycopg2.connect(DB_URL, options=f'-c search_path={SCHEMA}')
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO payments (user_id, yookassa_payment_id, amount, status) VALUES (%s, %s, %s, %s)',
        (user_id, payment_id, 119, 'pending')
    )
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'payment_id': payment_id,
            'confirmation_url': confirmation_url,
        }, ensure_ascii=False)
    }
