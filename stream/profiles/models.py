from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class MyUser(AbstractUser):
    points = models.IntegerField(default=100)
    username = models.CharField(unique=True, max_length=255)
    rank = models.PositiveIntegerField
    email = models.EmailField(max_length=250 )
    date_added = models.DateTimeField(auto_now_add=True)
    enroll_id = models.PositiveIntegerField(null=True)

    FRESHMAN = 1
    SOPHOMORE = 2
    JUNIOR = 3
    SENIOR = 4
    MATKA = 5

    YEAR_CHOICES = (
        (FRESHMAN, 'Freshman'),
        (SOPHOMORE, 'Sophomore'),
        (JUNIOR, 'Junior'),
        (SENIOR, 'Senior'),
        (MATKA, 'Super Senior'),
    )

    year = models.IntegerField(
        choices=YEAR_CHOICES,
        default=FRESHMAN,
    )

    def __str__(self):
        return str(self.enroll_id)




