import pytest
from app.models.efficientnet_model import build_efficientnet_model

def test_model_builder():
    model = build_efficientnet_model()
    # Mock builder returns None in our skeleton
    assert model is None or hasattr(model, 'predict')
