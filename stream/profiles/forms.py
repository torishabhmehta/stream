from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import MyUser

class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = MyUser
        fields = ('username', 'email', 'enroll_id')

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = MyUser
        fields = UserChangeForm.Meta.fields

