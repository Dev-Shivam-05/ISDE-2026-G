from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_homepage_ok():
    r = client.get("/")
    assert r.status_code == 200

def test_list_products():
    r = client.get("/products")
    assert r.status_code == 200
    data = r.json()
    assert "products" in data
    assert len(data["products"]) == 10

def test_add_product():
    new_product = {
        "name": "Test Product",
        "description": "This is a test product",
        "price": 9.99,
        "stock": 100,
        "category": "electronics",
        "image_url": "https://example.com/image.jpg"
    }
    r = client.post("/products", json=new_product)
    assert r.status_code == 200
    data = r.json()
    assert data["product"]["name"] == "Test Product"
    assert data["product"]["id"] == 11

def test_add_to_cart():
    r = client.post("/cart/add", data={"product_id": 1, "quantity": 2, "cart_id": "default"})
    assert r.status_code == 200

    r = client.get("/cart?cart_id=default")
    assert r.status_code == 200
    data = r.json()
    assert data["cart_id"] == "default"
    assert len(data["items"]) == 1
    assert data["items"][0]["product_id"] == 1
    assert data["items"][0]["quantity"] == 2

def test_remove_from_cart():
    r = client.delete("/cart/1?cart_id=default")
    assert r.status_code == 200
    
    r = client.get("/cart?cart_id=default")
    assert r.status_code == 200
    data = r.json()
    assert len(data["items"]) == 0