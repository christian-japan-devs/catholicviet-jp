from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from .models import UserProfile


@receiver(post_save, sender=User)
def create_auth_token(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(profile_user=instance)
        Token.objects.create(user=instance)

#@receiver(post_save, sender = User)
#def save_profile(sender, instance, **kwargs):
#    instance.profile.save()