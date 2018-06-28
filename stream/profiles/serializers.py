from rest_framework import serializers
from . import models

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MyUser
        fields = ('email', 'username', 'enroll_id')



 



