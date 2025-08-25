// Menu items (replace img with your food images)
const menuItems = [
  { id: 1, name: "Margherita Pizza", category: "Pizza", price: 250, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 2, name: "Veggie Burger", category: "Burger", price: 180, img: "https://images.unsplash.com/photo-1546441471-c81f0586d0a9?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 3, name: "Pasta Alfredo", category: "Pasta", price: 220, img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 4, name: "Grilled Sandwich", category: "Sandwich", price: 150, img: "https://plus.unsplash.com/premium_photo-1671559021919-19d9610c8cad?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 5, name: "Cold Coffee", category: "Beverage", price: 120, img: "https://images.unsplash.com/photo-1625242662341-5e92c5101338?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 6, name: "Chocolate Cake", category: "Dessert", price: 200, img: "https://images.unsplash.com/photo-1611497406092-4bc22c54b322?q=80&w=1034&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
];

// Cart data
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render menu
function renderMenu(items) {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = "";
  items.forEach(m => {
    grid.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <img src="${m.img}" class="card-img-top" alt="${m.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${m.name}</h5>
            <p class="card-text text-muted">${m.category}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="fw-bold">₹${m.price}</span>
              <button class="btn btn-warning" onclick="addToCart(${m.id})">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>`;
  });
}

// Add to cart
function addToCart(id) {
  const item = menuItems.find(m => m.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart();
  updateCartUI();
}

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
}

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart UI
function updateCartUI() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(c => {
    total += c.price * c.qty;
    cartItems.innerHTML += `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div>
          <strong>${c.name}</strong><br>
          <small>₹${c.price} x ${c.qty}</small>
        </div>
        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${c.id})">Remove</button>
      </div>`;
  });

  cartCount.innerText = cart.length;
  cartTotal.innerText = "₹" + total;
}

// Search filter
document.getElementById("searchInput").addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  const filtered = menuItems.filter(m => m.name.toLowerCase().includes(value));
  renderMenu(filtered);
});

// Category filter
const categoryFilter = document.getElementById("categoryFilter");
[...new Set(menuItems.map(m => m.category))].forEach(cat => {
  categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
});

categoryFilter.addEventListener("change", e => {
  const val = e.target.value;
  if (val === "") renderMenu(menuItems);
  else renderMenu(menuItems.filter(m => m.category === val));
});

// Clear cart
document.getElementById("clearCartBtn").addEventListener("click", () => {
  cart = [];
  saveCart();
  updateCartUI();
});

// Init
renderMenu(menuItems);
updateCartUI();
