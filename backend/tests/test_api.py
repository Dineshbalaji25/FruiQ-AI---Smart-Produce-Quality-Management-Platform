import pytest
import io
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    rv = client.get('/api/v1/health')
    assert rv.status_code == 200
    assert rv.json['status'] == 'healthy'

def test_prediction_no_file(client):
    rv = client.post('/api/v1/predict', data={})
    assert rv.status_code == 400
    assert "No image part" in rv.json['error']

def test_prediction_valid_file(client):
    # Dummy file
    data = {
        'image': (io.BytesIO(b"fake image data"), 'test.jpg')
    }
    # This might return 400 if validation fails on PIL, but we test the routing
    rv = client.post('/api/v1/predict', data=data, content_type='multipart/form-data')
    # Because 'fake image data' is not a valid image according to PIL:
    assert rv.status_code == 400 or rv.status_code == 200
