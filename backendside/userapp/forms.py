from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from api.models import Contact
from django.utils.translation import ugettext_lazy as _


class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ['contact_full_name','contact_content']

class ContactFormForGuess(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ['contact_full_name','contact_email','contact_content','contact_phone']