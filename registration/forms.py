from django.forms import (
    ModelForm,
    EmailInput,
    TextInput,
    DateInput,
    CheckboxInput,
    BooleanField,
    Textarea,
    DateField,
    CheckboxSelectMultiple,
)
from django.utils import timezone
from registration.models import Member
from core.models import Visit


class MemberForm(ModelForm):
    input_formats = [
        "%Y-%m-%d",
        "%y-%m-%d",
        "%d-%m-%y",
        "%d-%m-%Y",
        "%Y/%m/%d",
        "%y/%m/%d",
        "%d/%m/%y",
        "%d/%m/%Y",
    ]

    waiver_substitute = BooleanField(
        required=False,
        label="I have read and agree to the above terms & conditions.",
        widget=CheckboxInput(attrs={"class": "mdl-checkbox__input"}),
    )
    date_of_birth = DateField(
        required=False,
        input_formats=input_formats,
        widget=DateInput(attrs={"class": "mdl-textfield__input"}),
    )

    class Meta:
        model = Member

        exclude = ("waiver",)
        fields = [
            "email",
            "email_consent",
            "first_name",
            "last_name",
            "preferred_name",
            "date_of_birth",
            "guardian_name",
            "phone",
            "street",
            "city",
            "province",
            "country",
            "post_code",
            "waiver",
            "banned",
            "suspended",
            "notes",
            "involvement",
        ]
        widgets = {
            "email": EmailInput(attrs={"class": "mdl-textfield__input"}),
            "email_consent": CheckboxInput(attrs={"class": "mdl-checkbox__input"}),
            "first_name": TextInput(attrs={"class": "mdl-textfield__input"}),
            "last_name": TextInput(attrs={"class": "mdl-textfield__input"}),
            "involvement": CheckboxSelectMultiple(
                choices=Member.involvement_choices,
                attrs={"class": "mdl-checkbox__input"},
            ),
            "preferred_name": TextInput(attrs={"class": "mdl-textfield__input"}),
            "guardian_name": DateInput(
                attrs={"class": "mdl-textfield__input", "readonly": "readonly"}
            ),
            "phone": TextInput(
                attrs={"class": "mdl-textfield__input", "pattern": "[0-9]*"}
            ),
            "street": TextInput(attrs={"class": "mdl-textfield__input"}),
            "city": TextInput(attrs={"class": "mdl-textfield__input"}),
            "province": TextInput(attrs={"class": "mdl-textfield__input"}),
            "country": TextInput(attrs={"class": "mdl-textfield__input"}),
            "post_code": TextInput(
                attrs={
                    "class": "mdl-textfield__input",
                    "pattern": "[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]",
                }
            ),
            "notes": Textarea(attrs={"class": "mdl-textfield__input"}),
            "suspended": CheckboxInput(attrs={"class": "mdl-checkbox__input"}),
            "banned": CheckboxInput(attrs={"class": "mdl-checkbox__input"}),
        }

        labels = {
            "email_consent": "I consent to receiving digital communication from the BCBC."
        }

    def clean(self):
        super(MemberForm, self).clean()

    def save(self, *args, **kwargs):
        commit = kwargs.pop("commit", True)

        instance = super(MemberForm, self).save(*args, commit=False, **kwargs)
        if self.cleaned_data["waiver_substitute"]:
            instance.waiver = timezone.now()
        if commit:
            instance.save()
        return instance


class VisitForm(ModelForm):
    class Meta:
        model = Visit
        fields = ["purpose", "member"]
        exclude = ("member",)
