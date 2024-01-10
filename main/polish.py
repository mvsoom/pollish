import openai
from decouple import config
import json

CLIENT = openai.OpenAI(
    base_url=config("OPENAI_BASE_URL"),
    api_key=config("OPENAI_API_KEY"),
)

MODEL = config("OPENAI_MODEL")


def polish(sentence):
    prompt =\
 f"""
# INSTRUCTIONS
Improve the sentence below, and output only the improved sentence in the `polished_sentence` field.
If the sentence is nonsensical, output the original sentence in the `polished_sentence` field.
Pay attention to capitalization and punctuation.

# SENTENCE
{sentence}
"""
    response = CLIENT.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that outputs in JSON.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        response_format={
            "type": "json_object",
            "schema": {
                "type": "object",
                "properties": {"polished_sentence": {"type": "string"}},
                "required": ["polished_sentence"],
            },
        },
        temperature=0.7,
    )

    # Parse the JSON content of the response
    content = json.loads(response.choices[0].message.content)

    polished_sentence = content["polished_sentence"]
    return polished_sentence