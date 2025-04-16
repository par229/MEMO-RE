from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    nickname = models.CharField(max_length=30)
    birthdate = models.DateField()

class Board(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    summary = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Memo(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='memos')
    number = models.AutoField(primary_key=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField()

    
