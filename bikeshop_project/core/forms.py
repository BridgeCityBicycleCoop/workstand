import logging
from django.forms import BooleanField, CharField, CheckboxInput, RadioSelect, ModelForm, TextInput, HiddenInput, ChoiceField

from registration.models import Member

from .models import Membership, Payment

logger = logging.getLogger('bikeshop')


class MembershipForm(ModelForm):
    member = CharField(required=True, widget=HiddenInput())
    self_ident_other = CharField(required=False, label='Self identification',
                                 widget=TextInput(attrs={'class': 'mdl-textfield__input'}))
    gender_other = CharField(required=False, label='Other', widget=TextInput(attrs={'class': 'mdl-textfield__input'}))
    safe_space = BooleanField(required=True, widget=CheckboxInput(
        attrs={'class': 'mdl-checkbox__input'}
    ))
    respect_community = BooleanField(required=True, widget=CheckboxInput(
        attrs={'class': 'mdl-checkbox__input'}
    ))
    give_back = BooleanField(required=True, widget=CheckboxInput(
        attrs={'class': 'mdl-checkbox__input'}
    ))
    respect_shop = BooleanField(required=True, widget=CheckboxInput(
        attrs={'class': 'mdl-checkbox__input'}
    ))

    class Meta:
        model = Membership
        fields = ['renewed_at', 'self_identification', 'gender']

        self_ident_choices = (
            ('First Nations; Métis; or Inuit', 'First Nations; Métis; or Inuit'),
            ('visible minority', 'Visible Minority'),
            ('caucasian', 'Caucasian'),
            ('other', 'Other')
        )

        gender_choices = (
            ('male', 'Male'),
            ('female', 'Female'),
            ('other', 'Other')
        )

        widgets = {
            'self_identification': RadioSelect(choices=self_ident_choices, attrs={'class': 'mdl-radio__button'}),
            'gender': RadioSelect(choices=gender_choices, attrs={'class': 'mdl-radio__button'}),
            'renewed_at': TextInput(attrs={'class': 'mdl-textfield__input'}),
        }

    def save(self, commit=True):
        instance = super(MembershipForm, self).save(commit=False)
        member = Member.objects.get(id=self.cleaned_data['member'])
        instance.member = member
        logger.debug(self.cleaned_data['self_identification'])
        logger.debug(self.cleaned_data['gender'])

        if self.cleaned_data['gender_other']:
            instance.gender = self.cleaned_data['gender_other']

        if self.cleaned_data['self_ident_other']:
            instance.self_identification = self.cleaned_data['self_ident_other']

        if commit:
            instance.save()

        return instance


class PaymentForm(ModelForm):
    class Meta:
        model = Payment
        fields = ['type']
        widgets = {
            'type': RadioSelect(attrs={'class': 'mdl-radio__button'})
        }
