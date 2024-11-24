import csv

from django.contrib import admin
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import path

from ..custom_models.public_recipe_models import PublicRecipe, Ingredient


@admin.register(PublicRecipe)
class PublicRecipeAdmin(admin.ModelAdmin):
    change_list_template = "admin/public_recipe_change_list.html"
    list_display = (
        "name",
        "description",
        "instructions",
        "image_url",
    )
    filter_horizontal = ("ingredients",)  # Add this line to enable dual-list

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "import/",
                self.import_data,
                name="api_publicrecipe_import",
            ),
        ]
        return custom_urls + urls

    def import_data(self, request):
        if request.method == "POST":
            file = request.FILES["file"]
            reader = csv.DictReader(file.read().decode("utf-8").splitlines())
            for row in reader:
                ingredients_names = row.pop("ingredients").split(",")
                public_recipe = PublicRecipe.objects.create(**row)
                for ingredient_name in ingredients_names:
                    ingredient, created = Ingredient.objects.get_or_create(
                        name=ingredient_name.strip()
                    )
                    public_recipe.ingredients.add(ingredient)
            self.message_user(request, "Data imported successfully!")
            return HttpResponseRedirect("../")
        return render(request, "admin/import.html", {})
