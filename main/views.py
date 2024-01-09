import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


def home(request):
    print(request)
    return render(request, "home.html", {})


@csrf_exempt
def polish_sentence(request):
    if request.method == "POST":
        data = json.loads(request.body)
        sentence = data.get("sentence")

        # Here you can apply your sentence polishing logic
        # For now, we just put all caps
        polished_sentence = sentence.upper()

        # Sleep for 5 seconds to simulate a long-running task
        import time
        time.sleep(5)

        return JsonResponse({"polished_sentence": polished_sentence})

    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)