import logging

from django.forms import (
    BooleanField, CharField, CheckboxInput, ChoiceField, HiddenInput, ModelForm, RadioSelect, TextInput)
from django.utils.translation import ugettext as _

from registration.models import Member

from .models import Membership, Payment

logger = logging.getLogger('bikeshop')


class MembershipForm(ModelForm):
    member = CharField(required=True, widget=HiddenInput())
    # Translators: This is a text field for ethnic and cultural self identification.
    self_ident_other = CharField(required=False, label=_('Other'),
                                 widget=TextInput(attrs={'class': 'mdl-textfield__input'}))
    # Translators: This is a text field for entering genders other than male and female
    gender_other = CharField(required=False, label=_('Other'), widget=TextInput(attrs={'class': 'mdl-textfield__input'}))
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

        # Translators: Choices for ethnic and cultural self-identification
        self_ident_choices = (
            ('First Nations; Métis; or Inuit', _('First Nations; Métis; or Inuit')),
            ('visible minority', _('Visible Minority')),
            ('caucasian', _('Caucasian')),
            ('other', _('Other'))
        )

        # Translators: Choices for gender self-identification
        gender_choices = (
            ('male', _('Male')),
            ('female', _('Female')),
            ('other', _('Other'))
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
