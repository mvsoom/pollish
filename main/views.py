import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from main.polish import polish


def home(request):
    print(request)
    return render(request, "home.html", {})


@csrf_exempt
def polish_sentence(request):
    if request.method == "POST":
        data = json.loads(request.body)
        sentence = data.get("sentence")
        polished_sentence = polish(sentence)
        return JsonResponse({"polished_sentence": polished_sentence})
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
