import os

from django.shortcuts import render


def index(request):
    template_path = os.path.join("..", "frontend", "build", "index.html")
    return render(request, template_path)
