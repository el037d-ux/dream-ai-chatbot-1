import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

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
    """Анализ сна через OpenAI GPT-4o с интерпретацией по Юнгу и Фрейду"""

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

    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=chat_messages,
        max_tokens=600,
        temperature=0.85,
    )

    answer = response.choices[0].message.content

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'answer': answer}, ensure_ascii=False)
    }
