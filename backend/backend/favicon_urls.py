import os

from django.urls import path
from django.views.static import serve

from backend.settings import FRONTEND_ROOT_DIR

favicon_dir = os.path.join(FRONTEND_ROOT_DIR, "favicon")

urlpatterns = [
    path(
        "favicon.ico",
        serve,
        {
            "document_root": favicon_dir,
            "path": "favicon.ico",
        },
    ),
    path(
        "site.webmanifest",
        serve,
        {
            "document_root": favicon_dir,
            "path": "site.webmanifest",
        },
    ),
    path(
        "favicon-16x16.png",
        serve,
        {
            "document_root": favicon_dir,
            "path": "favicon-16x16.png",
        },
    ),
    path(
        "favicon-32x32.png",
        serve,
        {
            "document_root": favicon_dir,
            "path": "favicon-32x32.png",
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
        "android-chrome-192x192.png",
        serve,
        {
            "document_root": favicon_dir,
            "path": "android-chrome-192x192.png",
        },
    ),
    path(
        "android-chrome-512x512.png",
        serve,
        {
            "document_root": favicon_dir,
            "path": "android-chrome-512x512.png",
        },
    ),
]
