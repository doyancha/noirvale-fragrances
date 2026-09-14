from django import forms

from .media import MediaProviderError, apply_upload_metadata, upload_image, validate_image_upload
from .models import CollectionImage, Product, ProductImage


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


class MediaUploadMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["upload"] = forms.FileField(
            required=False,
            help_text="JPEG, PNG, WebP, or AVIF only; maximum size 10 MB.",
        )

    def clean(self):
        cleaned_data = super().clean()
        if self.errors:
            return cleaned_data

        uploaded_file = cleaned_data.get("upload")
        if not self.instance.pk and not uploaded_file:
            self.add_error("upload", "An image is required when creating media.")
            return cleaned_data
        if uploaded_file:
            try:
                validate_image_upload(uploaded_file)
                self._upload_response = upload_image(
                    uploaded_file,
                    self.instance.cloudinary_public_id or self.instance.default_cloudinary_public_id,
                )
            except (ValueError, MediaProviderError) as exc:
                self.add_error("upload", str(exc))
        return cleaned_data

    def save(self, commit=True):
        instance = super().save(commit=False)
        if getattr(self, "_upload_response", None):
            apply_upload_metadata(instance, self._upload_response)
        if commit:
            instance.save()
        return instance


class ProductImageAdminForm(MediaUploadMixin, forms.ModelForm):
    class Meta:
        model = ProductImage
        fields = ("product", "role", "alt_text", "sort_order")


class CollectionImageAdminForm(MediaUploadMixin, forms.ModelForm):
    class Meta:
        model = CollectionImage
        fields = ("collection", "alt_text")
