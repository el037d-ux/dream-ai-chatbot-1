import os
import json
import urllib.request
import urllib.error

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


def handler(event: dict, context) -> dict:
    """Анализ сна через AiTunnel GPT-4o-mini с интерпретацией по Юнгу и Фрейду."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    api_key = os.environ.get('AITUNNEL_API_KEY', '')

    body = json.loads(event.get('body') or '{}')
    messages = body.get('messages', [])
    dream_text = body.get('dream', '')

    if not messages and not dream_text:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Нет текста сна'})
        }

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
        return {
            'statusCode': 502,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка API: {e.code}', 'detail': error_body})
        }

    answer = result['choices'][0]['message']['content']

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'answer': answer}, ensure_ascii=False)
    }
