#builds/admin.py
from django.contrib import admin
from .models import Component, Build, SavedBuild, Purchase

admin.site.register(Component)
admin.site.register(Build)
admin.site.register(SavedBuild)
admin.site.register(Purchase)
