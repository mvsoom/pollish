import json

import openai
from decouple import config

MODEL = config("OPENAI_MODEL")

TEMPERATURE = 0.7

SYSTEM_PROMPT = "You are a helpful assistant that outputs in JSON."

USER_PROMPT = """\
# INSTRUCTIONS
- Output a refined version of the input sentence below in `polished_sentence`, or "" if the input is e.g. too malformed.
- Ensure correct capitalization and punctuation.

# SENTENCE
{0}\
"""

RESPONSE_FORMAT = {
    "type": "json_object",
    "schema": {
        "type": "object",
        "properties": {"polished_sentence": {"type": "string"}},
        "required": ["polished_sentence"],
    },
}


def polish(sentence):
    client = openai.OpenAI(
        base_url=config("OPENAI_BASE_URL"),
        api_key=config("OPENAI_API_KEY"),
    )

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": USER_PROMPT.format(sentence),
            },
        ],
        response_format=RESPONSE_FORMAT,
        temperature=TEMPERATURE,
    )

    content = json.loads(response.choices[0].message.content)
    polished_sentence = content["polished_sentence"].strip()
    return polished_sentence if polished_sentence else sentence
