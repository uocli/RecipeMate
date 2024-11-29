import csv

from django.contrib import admin
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import path

from ..custom_models.public_recipe_models import Ingredient


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    change_list_template = "admin/ingredient_change_list.html"
    list_display = ("name",)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "import/",
                self.import_data,
                name="api_ingredient_import",
            ),
        ]
        return custom_urls + urls

    def import_data(self, request):
        if request.method == "POST":
            file = request.FILES["file"]
            reader = csv.DictReader(file.read().decode("utf-8").splitlines())
            for row in reader:
                Ingredient.objects.create(**row)
            self.message_user(request, "Data imported successfully!")
            return HttpResponseRedirect("../")
        return render(request, "admin/import.html", {})
