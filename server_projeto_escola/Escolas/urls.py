from rest_framework.routers import DefaultRouter
from .views import EscolaViewSet

router = DefaultRouter()
router.register(r'escolas', EscolaViewSet)

urlpatterns = router.urls