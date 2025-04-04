import pytest
from fastapi.testclient import TestClient

from src.main import app


@pytest.fixture(scope="session")
def client():
    client = TestClient(app)
    yield client
