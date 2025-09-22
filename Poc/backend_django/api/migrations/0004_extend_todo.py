# Generated migration equivalent to V4__extend_todo_table.sql

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_add_todo_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='user_id',
            field=models.BigIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='todo',
            name='due_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='todo',
            name='tags',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='todo',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='todo',
            name='updated_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='todo',
            name='deleted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddIndex(
            model_name='todo',
            index=models.Index(fields=['user_id', 'completed'], name='idx_todos_user_completed'),
        ),
    ]