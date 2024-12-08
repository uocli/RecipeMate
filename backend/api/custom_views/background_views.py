from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..utils.unsplash import UnsplashAPI


class RandomRecipeImageView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # No permissions required

    def get(self, request):
        try:
            image_url = UnsplashAPI.get_random_image(keyword="recipe")
            if image_url:
                return Response(
                    {
                        "success": True,
                        "imageUrl": image_url,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "success": False,
                        "error": "No image found",
                    },
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
