from rest_framework import viewsets, filters
from .models import User, Board, Memo
from .serializers import UserSerializer, BoardSerializer, MemoSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user']  # ✅ 유저별 필터링 지원


class MemoViewSet(viewsets.ModelViewSet):
    queryset = Memo.objects.all()
    serializer_class = MemoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['board']  # ✅ 보드별 필터링 지원


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        return Response({
            'id': user.id,  # ✅ 수정된 응답: 프론트에서 response.data.id 로 접근 가능
            'username': user.username
        }, status=200)
    else:
        return Response({'error': '아이디 또는 비밀번호가 틀렸습니다.'}, status=400)
