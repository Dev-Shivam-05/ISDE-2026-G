# app/main.py
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware

# 1. FIRST: Create the FastAPI app instance
app = FastAPI(
    title="ISDE MiniShop",
    description="A simple e-commerce demo",
    version="1.0.0"
)

# 2. SECOND: Add middleware (AFTER app is defined)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. THIRD: In-memory data structures
PRODUCTS = {
    1: {"id": 1, "name": "Wireless Mouse", "price": 24.99, "stock": 50},
    2: {"id": 2, "name": "USB-C Cable", "price": 9.99, "stock": 100},
    3: {"id": 3, "name": "Mechanical Keyboard", "price": 89.99, "stock": 30},
}
CARTS = {}

# 4. FOURTH: Endpoint definitions
@app.get("/")
def homepage():
    return {"message": "Welcome to ISDE MiniShop!"}

@app.get("/products")
def list_products(cart_id: str = "default"):
    return {"products": list(PRODUCTS.values()), "cart_id": cart_id}

@app.post("/cart/add")
def add_to_cart(
    product_id: int = Form(...),
    quantity: int = Form(...),
    cart_id: str = Form(...)
):
    if product_id not in PRODUCTS:
        return {"error": f"Product {product_id} not found"}
    
    product = PRODUCTS[product_id]
    if quantity > product["stock"]:
        return {"error": f"Only {product['stock']} units available"}
    
    if cart_id not in CARTS:
        CARTS[cart_id] = {}
    
    current = CARTS[cart_id].get(product_id, 0)
    CARTS[cart_id][product_id] = current + quantity
    
    return {"message": f"Added {quantity} x Product {product_id} to cart {cart_id}"}

@app.get("/cart")
def view_cart(cart_id: str):
    if cart_id not in CARTS or not CARTS[cart_id]:
        return {"cart_id": cart_id, "items": [], "total": 0.0}
    
    items = []
    total = 0.0
    for pid, qty in CARTS[cart_id].items():
        product = PRODUCTS.get(pid)
        if product:
            subtotal = product["price"] * qty
            items.append({
                "product_id": pid,
                "name": product["name"],
                "quantity": qty,
                "unit_price": product["price"],
                "subtotal": subtotal
            })
            total += subtotal
    
    return {"cart_id": cart_id, "items": items, "total": round(total, 2)}

# 5. FIFTH: Global error handler (at the very end)
@app.exception_handler(Exception)
async def global_error_handler(request, exc):
    import logging
    logging.error(f"Unhandled error: {exc}", exc_info=True)
    return {"error": "Something went wrong. Please try again."}