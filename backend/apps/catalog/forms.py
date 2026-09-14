from django import forms

from .models import Product


class StringListFormField(forms.CharField):
    """Edit a JSON list of strings as one trimmed value per line."""

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", forms.Textarea(attrs={"rows": 5}))
        kwargs.setdefault("required", False)
        super().__init__(*args, **kwargs)

    def prepare_value(self, value):
        if isinstance(value, list):
            return "\n".join(value)
        return super().prepare_value(value)

    def to_python(self, value):
        value = super().to_python(value)
        if not value:
            return []
        return [line.strip() for line in value.splitlines() if line.strip()]


class ProductAdminForm(forms.ModelForm):
    top_notes = StringListFormField(label="Top notes")
    heart_notes = StringListFormField(label="Heart notes")
    base_notes = StringListFormField(label="Base notes")
    seasons = StringListFormField()
    occasions = StringListFormField()
    style_tags = StringListFormField(label="Style tags")

    class Meta:
        model = Product
        fields = "__all__"
