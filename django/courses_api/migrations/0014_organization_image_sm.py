# Generated by Django 4.0.5 on 2022-06-27 20:28

from django.db import migrations
import imagekit.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('courses_api', '0013_alter_coursereview_author_stepcommentreaction'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='image_sm',
            field=imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to='images/organizations/logos/sm/', verbose_name='image(sm)'),
        ),
    ]
