from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save
from django.conf import settings
from .models import User, Profile


@receiver(post_save, sender=User)
def pre_save_board(created=None, instance=None, **kwargs):
    if created:
        Profile.objects.create(user=instance)
