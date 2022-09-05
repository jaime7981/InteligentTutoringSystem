from django import forms

class CreateAssignment(forms.Form):
    name = forms.CharField(label='name', max_length=100)
    description = forms.CharField(label='description', max_length=100)

class CreateAssignmentWithPichture(forms.Form):
    name = forms.CharField(label='name', max_length=100)
    description = forms.CharField(label='description', max_length=100)