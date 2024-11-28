import os

from django.urls import path
from django.views.static import serve

from backend.settings import FRONTEND_ROOT_DIR

favicon_dir = os.path.join(FRONTEND_ROOT_DIR, "favicon")

urlpatterns = [
    path(
        "service-worker.js",
        serve,
        {
            "document_root": os.path.join(FRONTEND_ROOT_DIR, "service-workers"),
            "path": "service-worker.js",
        },
    ),
]
