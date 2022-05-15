# Generated by Django 3.1.7 on 2022-04-24 10:12

from django.conf import settings
import django.contrib.auth.models
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email')),
                ('username', models.CharField(max_length=100, unique=True)),
                ('first_name', models.CharField(blank=True, max_length=25)),
                ('last_name', models.CharField(blank=True, max_length=25)),
                ('is_representative', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Institution',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('city', models.CharField(max_length=100)),
                ('state', models.CharField(max_length=100, null=True)),
                ('country', models.CharField(max_length=100)),
            ],
            options={
                'unique_together': {('name', 'city', 'country')},
            },
        ),
        migrations.CreateModel(
            name='ResearchField',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field', models.CharField(max_length=100)),
                ('subfield', models.CharField(max_length=100)),
            ],
            options={
                'unique_together': {('field', 'subfield')},
            },
        ),
        migrations.CreateModel(
            name='WorkingGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('n_employees', models.IntegerField(blank=True, null=True)),
                ('field', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='emissions.researchfield')),
                ('institution', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='emissions.institution')),
                ('representative', models.OneToOneField(null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('name', 'institution')},
            },
        ),
        migrations.CreateModel(
            name='CommutingGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateField()),
                ('n_employees', models.IntegerField()),
                ('transportation_mode', models.CharField(max_length=30)),
                ('distance', models.FloatField(null=True)),
                ('co2e', models.FloatField()),
                ('co2e_cap', models.FloatField()),
                ('working_group', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='emissions.workinggroup')),
            ],
        ),
        migrations.CreateModel(
            name='BusinessTrip',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateField()),
                ('distance', models.FloatField()),
                ('co2e', models.FloatField()),
                ('transportation_mode', models.CharField(choices=[('CAR', 'Car'), ('BUS', 'Bus'), ('TRAIN', 'Train'), ('PLANE', 'Plane')], max_length=10)),
                ('range_category', models.CharField(max_length=50)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('working_group', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='emissions.workinggroup')),
            ],
        ),
        migrations.AddField(
            model_name='customuser',
            name='working_group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='emissions.workinggroup'),
        ),
        migrations.CreateModel(
            name='Heating',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('consumption', models.FloatField(validators=[django.core.validators.MinValueValidator(0.0)])),
                ('timestamp', models.DateField()),
                ('building', models.CharField(max_length=30)),
                ('group_share', models.FloatField(validators=[django.core.validators.MinValueValidator(0.0), django.core.validators.MaxValueValidator(1.0)])),
                ('fuel_type', models.CharField(choices=[('HEAT_PUMP_AIR', 'Heat pump air'), ('HEAT_PUMP_GROUND', 'Heat pump ground'), ('HEAT_PUMP_WATER', 'Heat pump water'), ('LIQUID_GAS', 'Liquid gas'), ('OIL', 'Oil'), ('PELLETS', 'Pellets'), ('SOLAR', 'Solar'), ('WOODCHIPS', 'Woodchips'), ('ELECTRICITY', 'Electricity'), ('GAS', 'Gas'), ('COAL', 'Coal'), ('DISTRICT_HEATING', 'District heating')], max_length=20)),
                ('unit', models.CharField(choices=[('KWH', 'kwh'), ('KG', 'kg'), ('L', 'l'), ('M3', 'm^3')], max_length=20)),
                ('co2e', models.FloatField()),
                ('co2e_cap', models.FloatField()),
                ('working_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='emissions.workinggroup')),
            ],
            options={
                'unique_together': {('working_group', 'timestamp', 'fuel_type', 'building')},
            },
        ),
        migrations.CreateModel(
            name='Electricity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('consumption', models.FloatField()),
                ('timestamp', models.DateField()),
                ('building', models.CharField(max_length=30)),
                ('group_share', models.FloatField(validators=[django.core.validators.MinValueValidator(0.0), django.core.validators.MaxValueValidator(1.0)])),
                ('fuel_type', models.CharField(choices=[('GERMAN_ENERGY_MIX', 'German energy mix'), ('SOLAR', 'Solar')], max_length=40)),
                ('co2e', models.FloatField()),
                ('co2e_cap', models.FloatField()),
                ('working_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='emissions.workinggroup')),
            ],
            options={
                'unique_together': {('working_group', 'timestamp', 'fuel_type', 'building')},
            },
        ),
        migrations.CreateModel(
            name='Commuting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateField()),
                ('co2e', models.FloatField()),
                ('distance', models.FloatField()),
                ('transportation_mode', models.CharField(choices=[('CAR', 'Car'), ('BUS', 'Bus'), ('TRAIN', 'Train'), ('BICYCLE', 'Bicycle'), ('EBIKE', 'E-bike'), ('MOTORBIKE', 'Motorbike'), ('TRAM', 'Tram')], max_length=15)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('working_group', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='emissions.workinggroup')),
            ],
            options={
                'unique_together': {('user', 'timestamp', 'transportation_mode')},
            },
        ),
        migrations.CreateModel(
            name='BusinessTripGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateField()),
                ('n_employees', models.IntegerField()),
                ('transportation_mode', models.CharField(choices=[('CAR', 'Car'), ('BUS', 'Bus'), ('TRAIN', 'Train'), ('PLANE', 'Plane')], max_length=10)),
                ('distance', models.FloatField()),
                ('co2e', models.FloatField()),
                ('co2e_cap', models.FloatField()),
                ('working_group', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='emissions.workinggroup')),
            ],
            options={
                'unique_together': {('working_group', 'timestamp', 'transportation_mode')},
            },
        ),
    ]
