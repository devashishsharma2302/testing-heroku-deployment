from django.contrib import admin

from squealy.models import Account, Chart, Parameter,\
    Transformation, Validation


class AccountAdmin(admin.ModelAdmin):
    """
        List display for Accounts in Django Admin
    """
    model = Account
    list_display = ['name']


class ChartAdmin(admin.ModelAdmin):
    """
        List display for Charts in Django Admin
    """
    model = Chart
    list_display = ['name', 'account', 'url', 'format', 'type', 'options']


class ParameterAdmin(admin.ModelAdmin):
    """
        List display for ChartParameters in Django Admin
    """
    model = Parameter
    list_display = ['chart', 'name', 'data_type', 'mandatory', 'default_value', 'test_value', 'type', 'kwargs']


class TransformationAdmin(admin.ModelAdmin):
    """
        List display for Transformations in Django Admin
    """
    model = Transformation
    list_display = ['chart', 'name', 'kwargs']


class ValidationAdmin(admin.ModelAdmin):
    """
        List display for Validations in Django Admin
    """
    model = Validation
    list_display = ['chart', 'name', 'query']


admin.site.register(Account, AccountAdmin)
admin.site.register(Chart, ChartAdmin)
admin.site.register(Parameter, ParameterAdmin)
admin.site.register(Transformation, TransformationAdmin)
admin.site.register(Validation, ValidationAdmin)