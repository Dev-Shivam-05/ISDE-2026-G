from fastapi.testclient import TestClient
from .main import app


client = TestClient(app)


def test_homepage_ok():
    r = client.get("/")
    assert r.status_code == 200


def test_list_products_and_add_to_cart():
    r = client.get("/products?cart_id=default")
    assert r.status_code == 200

    r = client.post("/cart/add", data={"product_id": 2, "quantity": 2, "cart_id": "default"})
    assert r.status_code in (200, 303)

    r = client.get("/cart?cart_id=default")
    assert r.status_code == 200
    assert "USB-C Cable" in r.text