from django.forms import ModelForm, TextInput, DateInput, CheckboxSelectMultiple, CharField, BooleanField, CheckboxInput

from core.models import Membership


class MembershipForm(ModelForm):
    self_ident_other = CharField(required=False, label='Self identification', widget=TextInput(attrs={'class': 'mdl-textfield__input'}))
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
            ('Other', 'Other')
        )

        gender_choices = (
            ('male', 'Male'),
            ('female', 'Female'),
            ('other', 'other')
        )

        widgets = {
            'self_identification': CheckboxSelectMultiple(choices=self_ident_choices,
                                                          attrs={'class': 'mdl-checkbox__input'}),
            'gender': CheckboxSelectMultiple(choices=gender_choices, attrs={'class': 'mdl-checkbox__input'}),
            'renewed_at': TextInput(attrs={'class': 'mdl-textfield__input'}),
        }
