# Generated migration equivalent to V6__add_oauth2_account.sql

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_extend_todo'),
    ]

    operations = [
        migrations.CreateModel(
            name='OAuthAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.BigIntegerField()),
                ('provider', models.CharField(max_length=100)),
                ('provider_user_id', models.CharField(max_length=255)),
                ('access_token', models.TextField(blank=True, null=True)),
                ('refresh_token', models.TextField(blank=True, null=True)),
                ('token_expires_at', models.DateTimeField(blank=True, null=True)),
                ('scope', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'oauth_accounts',
            },
        ),
        migrations.AddConstraint(
            model_name='oauthaccount',
            constraint=models.UniqueConstraint(fields=('provider', 'provider_user_id'), name='unique_provider_user'),
        ),
        migrations.AddIndex(
            model_name='oauthaccount',
            index=models.Index(fields=['user_id'], name='idx_oauth_accounts_user_id'),
        ),
    ]