from django.core.exceptions import ValidationError


def validate_string_list(value):
    """Ensure a JSONField contains a list whose items are all strings."""
    if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
        raise ValidationError("Value must be a list containing only strings.")
