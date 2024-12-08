from urllib.parse import urljoin, quote

import requests
from django.conf import settings


class UnsplashAPI:
    base_url = settings.UNSPLASH_BASE_URL
    access_key = settings.UNSPLASH_ACCESS_KEY

    @classmethod
    def search_photos(cls, keyword, page=1, per_page=1, size="regular"):
        # size can be "small", "regular", "full", "raw"
        endpoint = urljoin(cls.base_url, "search/photos")

        params = {
            "client_id": cls.access_key,
            "query": quote(keyword),
            "page": page,
            "per_page": per_page,
        }

        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()  # Raise HTTPError for bad responses (4xx and 5xx)
            data = response.json()
            if "results" in data and len(data["results"]) > 0:
                return data["results"][0]["urls"][size]
            return None
        except requests.exceptions.RequestException as e:
            print(f"Error fetching Unsplash data: {e}")
            return None

    @classmethod
    def get_random_image(cls, keyword, size="regular", count=1):
        endpoint = urljoin(cls.base_url, "photos/random")
        params = {
            "client_id": cls.access_key,
            "query": quote(keyword),
            "count": count,
        }

        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()  # Raise HTTPError for bad responses (4xx and 5xx)
            data = response.json()
            if len(data) > 0:
                return data[0]["urls"][size]
            return None
        except requests.exceptions.RequestException as e:
            print(f"Error fetching Unsplash data: {e}")
            return None
