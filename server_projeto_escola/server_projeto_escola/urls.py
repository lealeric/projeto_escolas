
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from Escolas.views import EscolaViewSet
from django.urls import include

router = DefaultRouter()
router.register(r'escolas', EscolaViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]
