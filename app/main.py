# app/main.py
from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# 1. Create the FastAPI app instance
app = FastAPI(
    title="ISDE MiniShop",
    description="A Flipkart-style e-commerce demo built with FastAPI",
    version="2.0.0"
)

# 2. Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Pydantic models
class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    category: str
    image_url: str
    rating: Optional[float] = 4.0

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[float] = None

# 4. In-memory data structures
_next_id = 11

CATEGORIES = {
    "gaming_gear": {"name": "Gaming Gear", "icon": "🎮"},
    "office_supplies": {"name": "Office Supplies", "icon": "🏢"},
    "electronics": {"name": "Electronics", "icon": "💻"},
    "accessories": {"name": "Accessories", "icon": "🎧"},
}

PRODUCTS = {
    1: {
        "id": 1,
        "name": "Logitech G502 HERO Gaming Mouse",
        "description": "High-performance gaming mouse with advanced HERO 25K sensor, 11 programmable buttons, adjustable weight system, and RGB lighting. Perfect for competitive gaming with up to 25,600 DPI sensitivity.",
        "price": 49.99,
        "stock": 45,
        "category": "gaming_gear",
        "image_url": "https://picsum.photos/seed/gaming-mouse/400/400",
        "rating": 4.7
    },
    2: {
        "id": 2,
        "name": "Mechanical Gaming Keyboard RGB",
        "description": "Full-size mechanical keyboard with Cherry MX Blue switches, per-key RGB backlighting, USB passthrough, magnetic wrist rest, and dedicated media controls. Built with an aluminum frame for durability.",
        "price": 129.99,
        "stock": 30,
        "category": "gaming_gear",
        "image_url": "https://picsum.photos/seed/mech-keyboard/400/400",
        "rating": 4.5
    },
    3: {
        "id": 3,
        "name": "USB-C Hub 7-in-1 Adapter",
        "description": "Compact USB-C hub with HDMI 4K output, 3x USB 3.0, SD/TF card reader, and 100W PD charging. Compatible with MacBook, Dell XPS, and all USB-C laptops.",
        "price": 34.99,
        "stock": 80,
        "category": "electronics",
        "image_url": "https://picsum.photos/seed/usb-hub/400/400",
        "rating": 4.3
    },
    4: {
        "id": 4,
        "name": "Ergonomic Office Chair Pro",
        "description": "Premium ergonomic office chair with lumbar support, adjustable armrests, breathable mesh back, tilt mechanism, and height adjustment. Supports up to 300 lbs.",
        "price": 299.99,
        "stock": 15,
        "category": "office_supplies",
        "image_url": "https://picsum.photos/seed/office-chair/400/400",
        "rating": 4.6
    },
    5: {
        "id": 5,
        "name": "Wireless Noise-Cancelling Headphones",
        "description": "Over-ear wireless headphones with active noise cancellation, 30-hour battery life, Hi-Res Audio, comfortable protein leather ear pads, and built-in microphone for calls.",
        "price": 199.99,
        "stock": 25,
        "category": "accessories",
        "image_url": "https://picsum.photos/seed/headphones/400/400",
        "rating": 4.8
    },
    6: {
        "id": 6,
        "name": "27\" 4K IPS Monitor",
        "description": "Professional 27-inch 4K UHD IPS monitor with 99% sRGB color accuracy, HDR10 support, USB-C connectivity with 65W charging, and adjustable stand. Ideal for creative professionals.",
        "price": 449.99,
        "stock": 12,
        "category": "electronics",
        "image_url": "https://picsum.photos/seed/monitor-4k/400/400",
        "rating": 4.4
    },
    7: {
        "id": 7,
        "name": "Standing Desk Converter",
        "description": "Height-adjustable standing desk converter with gas spring system, spacious 36-inch desktop, keyboard tray, and cable management. Converts any desk to a sit-stand workstation.",
        "price": 179.99,
        "stock": 20,
        "category": "office_supplies",
        "image_url": "https://picsum.photos/seed/standing-desk/400/400",
        "rating": 4.2
    },
    8: {
        "id": 8,
        "name": "Gaming Headset 7.1 Surround",
        "description": "Premium gaming headset with virtual 7.1 surround sound, detachable noise-cancelling microphone, memory foam ear cushions, and RGB lighting. Works with PC, PS5, and Xbox.",
        "price": 79.99,
        "stock": 55,
        "category": "gaming_gear",
        "image_url": "https://picsum.photos/seed/gaming-headset/400/400",
        "rating": 4.3
    },
    9: {
        "id": 9,
        "name": "Wireless Charging Pad 15W",
        "description": "Fast wireless charging pad with 15W output, Qi-certified, anti-slip surface, LED indicator, and foreign object detection. Compatible with iPhone, Samsung, and all Qi devices.",
        "price": 24.99,
        "stock": 100,
        "category": "accessories",
        "image_url": "https://picsum.photos/seed/charger-pad/400/400",
        "rating": 4.1
    },
    10: {
        "id": 10,
        "name": "Desk Organizer with USB Ports",
        "description": "Multi-compartment desk organizer with built-in USB-A and USB-C charging ports, phone stand, pen holder, and storage drawer. Keeps your workspace clean and devices charged.",
        "price": 39.99,
        "stock": 40,
        "category": "office_supplies",
        "image_url": "https://picsum.photos/seed/desk-organizer/400/400",
        "rating": 4.0
    },
}

CARTS = {}

# 5. Endpoint definitions

@app.get("/")
def homepage():
    return {"message": "Welcome to ISDE MiniShop!"}


@app.get("/categories")
def list_categories():
    return {"categories": CATEGORIES}


@app.get("/products")
def list_products(category: Optional[str] = None, cart_id: str = "default"):
    products = list(PRODUCTS.values())
    if category and category in CATEGORIES:
        products = [p for p in products if p["category"] == category]
    return {"products": products, "cart_id": cart_id, "total_count": len(products)}


@app.get("/products/{product_id}")
def get_product(product_id: int):
    product = PRODUCTS.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
    return product


@app.post("/products")
def add_product(product: ProductCreate):
    global _next_id
    new_product = {
        "id": _next_id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "stock": product.stock,
        "category": product.category,
        "image_url": product.image_url,
        "rating": product.rating or 4.0
    }
    PRODUCTS[_next_id] = new_product
    _next_id += 1
    return {"message": f"Product '{product.name}' added successfully", "product": new_product}


@app.put("/products/{product_id}")
def update_product(product_id: int, updates: ProductUpdate):
    if product_id not in PRODUCTS:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
    for field, value in updates.model_dump(exclude_none=True).items():
        PRODUCTS[product_id][field] = value
    return {"message": f"Product {product_id} updated", "product": PRODUCTS[product_id]}


@app.delete("/products/{product_id}")
def delete_product(product_id: int):
    if product_id not in PRODUCTS:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
    deleted = PRODUCTS.pop(product_id)
    return {"message": f"Product '{deleted['name']}' deleted successfully"}


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

    return {"message": f"Added {quantity} x {product['name']} to cart"}


@app.get("/cart")
def view_cart(cart_id: str = "default"):
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
                "image_url": product["image_url"],
                "quantity": qty,
                "unit_price": product["price"],
                "subtotal": subtotal
            })
            total += subtotal

    return {"cart_id": cart_id, "items": items, "total": round(total, 2)}


@app.delete("/cart/{product_id}")
def remove_from_cart(product_id: int, cart_id: str = "default"):
    if cart_id not in CARTS or product_id not in CARTS[cart_id]:
        return {"error": "Item not found in cart"}
    del CARTS[cart_id][product_id]
    return {"message": f"Removed product {product_id} from cart"}


# 6. Global error handler
@app.exception_handler(Exception)
async def global_error_handler(request, exc):
    import logging
    logging.error(f"Unhandled error: {exc}", exc_info=True)
    return {"error": "Something went wrong. Please try again."}