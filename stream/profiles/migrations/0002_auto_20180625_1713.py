# Generated by Django 2.0.6 on 2018-06-25 17:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='enroll_id',
            field=models.PositiveIntegerField(null=True),
        ),
    ]
