from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import generics
from . import models
from . import serializers

# Create your views here.

class UserListView(generics.ListCreateAPIView):
    queryset = models.MyUser.objects.all()
    serializer_class = serializers.UserSerializer
