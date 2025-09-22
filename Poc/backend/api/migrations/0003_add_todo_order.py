# Generated migration equivalent to V3__add_todo_order_column.sql

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_create_todo'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='order',
            field=models.IntegerField(blank=True, db_column='todo_order', null=True),
        ),
    ]