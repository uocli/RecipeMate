import os

from django.urls import path
from django.views.static import serve

from backend.settings import FRONTEND_ROOT_DIR

favicon_dir = os.path.join(FRONTEND_ROOT_DIR, "favicon")

urlpatterns = [
    path(
        "site.webmanifest",
        serve,
        {
            "document_root": favicon_dir,
            "path": "site.webmanifest",
        },
    ),
    path(
        "favicon.ico",
        serve,
        {
            "document_root": favicon_dir,
            "path": "favicon.ico",
        },
    ),
    path(
        "favicon.svg",
        serve,
        {
            "document_root": favicon_dir,
            "path": "favicon.svg",
        },
    ),
    path(
        "apple-touch-icon.png",
        serve,
        {
            "document_root": favicon_dir,
            "path": "apple-touch-icon.png",
        },
    ),
    path(
        "favicon-96x96.png",
        serve,
        {
            "document_root": favicon_dir,
            "path": "favicon-96x96.png",
        },
    ),
    path(
        "web-app-manifest-192x192.png",
        serve,
        {
            "document_root": favicon_dir,
            "path": "web-app-manifest-192x192.png",
        },
    ),
    path(
        "web-app-manifest-512x512.png",
        serve,
        {
            "document_root": favicon_dir,
            "path": "web-app-manifest-512x512.png",
        },
    ),
]
