from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, BoardViewSet, MemoViewSet, login_view

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('boards', BoardViewSet)
router.register('memos', MemoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view),
]
