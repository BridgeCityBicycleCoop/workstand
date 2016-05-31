from django.forms import ModelForm, EmailInput, TextInput, DateInput, CheckboxSelectMultiple, CharField, CheckboxInput, BooleanField
from django.utils import timezone
from registration.models import Member


class MemberForm(ModelForm):
    waiver_substitute = BooleanField(required=False, label='I have read and agree to the above terms & conditions.', widget=CheckboxInput(attrs={'class': 'mdl-checkbox__input'}))

    class Meta:
        model = Member

        exclude = ('waiver',)
        fields = ['email', 'email_consent', 'first_name', 'last_name', 'preferred_name', 'date_of_birth',
                  'guardian_name', 'phone', 'street', 'city', 'province', 'country', 'post_code', 'waiver']
        widgets = {
            'email': EmailInput(attrs={'class': 'mdl-textfield__input'}),
            'email_consent': CheckboxInput(attrs={'class': 'mdl-checkbox__input'}),
            'first_name': TextInput(attrs={'class': 'mdl-textfield__input'}),
            'last_name': TextInput(attrs={'class': 'mdl-textfield__input'}),
            'preferred_name': TextInput(attrs={'class': 'mdl-textfield__input'}),
            'date_of_birth': DateInput(attrs={'class': 'mdl-textfield__input'}),
            'guardian_name': DateInput(attrs={'class': 'mdl-textfield__input', 'disabled': 'disabled'}),
            'phone': TextInput(attrs={'class': 'mdl-textfield__input', 'pattern': '[0-9]*'}),
            'street': TextInput(attrs={'class': 'mdl-textfield__input'}),
            'city': TextInput(attrs={'class': 'mdl-textfield__input'}),
            'province': TextInput(attrs={'class': 'mdl-textfield__input'}),
            'country': TextInput(attrs={'class': 'mdl-textfield__input'}),
            'post_code': TextInput(attrs={'class': 'mdl-textfield__input',
                                          'pattern': '[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]'}),
        }

        labels = {
            'email_consent': 'I consent to receiving digital communication from the BCBC.'
        }

    def clean(self):
        super(MemberForm, self).clean()

    def save(self, *args, **kwargs):
        commit = kwargs.pop('commit', True)

        instance = super(MemberForm, self).save(*args, commit=False, **kwargs)
        if self.cleaned_data['waiver_substitute']:
            instance.waiver = timezone.now()
        if commit:
            instance.save()
        return instance
