/* ====== Utility: Local Storage Helpers ====== */
const storage = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  remove(key) { localStorage.removeItem(key); }
};

const CART_KEY = 'food_cart';
const BOOKINGS_KEY = 'food_bookings';

/* ====== Menu Data ====== */
const MENU = [
  { id: 1, name: 'Margherita Pizza', price: 299, category: 'Pizza', img: 'https://images.unsplash.com/photo-1548365328-9f547fb0953b?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, name: 'Paneer Tikka', price: 249, category: 'Starters', img: 'https://images.unsplash.com/photo-1604909052743-87c3eacaa61c?q=80&w=1200&auto=format&fit=crop' },
  { id: 3, name: 'Veg Burger', price: 179, category: 'Burgers', img: 'https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1200&auto=format&fit=crop' },
  { id: 4, name: 'Pasta Alfredo', price: 259, category: 'Pasta', img: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2b1a9?q=80&w=1200&auto=format&fit=crop' },
  { id: 5, name: 'Garlic Bread', price: 129, category: 'Starters', img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1200&auto=format&fit=crop' },
  { id: 6, name: 'Chicken Biryani', price: 349, category: 'Rice', img: 'https://images.unsplash.com/photo-1604908177225-6d67d01a0fef?q=80&w=1200&auto=format&fit=crop' },
  { id: 7, name: 'Gulab Jamun', price: 99, category: 'Dessert', img: 'https://images.unsplash.com/photo-1625944528533-3d6e7cc85e65?q=80&w=1200&auto=format&fit=crop' },
  { id: 8, name: 'Cold Coffee', price: 149, category: 'Beverages', img: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1200&auto=format&fit=crop' },
  { id: 9, name: 'Tandoori Roti', price: 39, category: 'Breads', img: 'https://images.unsplash.com/photo-1650087581616-43cbf0ccac14?q=80&w=1200&auto=format&fit=crop' },
  { id: 10, name: 'Chicken Tikka', price: 299, category: 'Starters', img: 'https://images.unsplash.com/photo-1625944528986-268f6df75f66?q=80&w=1200&auto=format&fit=crop' },
];

/* ====== Cart Logic ====== */
function getCart() { return storage.get(CART_KEY, []); }
function setCart(cart) { storage.set(CART_KEY, cart); updateCartUI(); }

function addToCart(itemId) {
  const cart = getCart();
  const found = cart.find(c => c.id === itemId);
  if (found) found.qty += 1;
  else {
    const item = MENU.find(m => m.id === itemId);
    if (!item) return;
    cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  }
  setCart(cart);
}

function removeFromCart(itemId) {
  let cart = getCart().filter(c => c.id !== itemId);
  setCart(cart);
}

function changeQty(itemId, delta) {
  const cart = getCart().map(c => c.id === itemId ? { ...c, qty: Math.max(1, c.qty + delta) } : c);
  setCart(cart);
}

function clearCart() { storage.remove(CART_KEY); updateCartUI(); }

function cartTotal() { return getCart().reduce((sum, i) => sum + i.price * i.qty, 0); }

function updateCartUI() {
  const count = getCart().reduce((n, i) => n + i.qty, 0);
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = count;
  const inline = document.getElementById('cartCountInline');
  if (inline) inline.textContent = count;

  const cartEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (cartEl && totalEl) {
    const cart = getCart();
    if (cart.length === 0) {
      cartEl.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
      totalEl.textContent = '₹0';
    } else {
      cartEl.innerHTML = cart.map(i => `
        <div class="d-flex align-items-center justify-content-between border-bottom py-2">
          <div>
            <div class="fw-semibold">${i.name}</div>
            <div class="small text-muted">₹${i.price} × ${i.qty}</div>
          </div>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary" onclick="changeQty(${i.id}, -1)">-</button>
            <button class="btn btn-outline-secondary" onclick="changeQty(${i.id}, 1)">+</button>
            <button class="btn btn-outline-danger" onclick="removeFromCart(${i.id})">Remove</button>
          </div>
        </div>
      `).join('');
      totalEl.textContent = `₹${cartTotal()}`;
    }
  }

  // Booking page cart summary
  const bItems = document.getElementById('bookingCartItems');
  const bTotal = document.getElementById('bookingCartTotal');
  if (bItems && bTotal) {
    const cart = getCart();
    bItems.innerHTML = cart.length ? cart.map(i => `<div class="d-flex justify-content-between"><span>${i.name} × ${i.qty}</span><span>₹${i.price * i.qty}</span></div>`).join('') : '<p class="text-muted mb-0">No items selected.</p>';
    bTotal.textContent = `₹${cartTotal()}`;
  }
}

/* ====== Menu Rendering ====== */
function renderMenu() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  let query = document.getElementById('searchInput').value.toLowerCase();
  let cat = document.getElementById('categoryFilter').value;

  const items = MENU.filter(m =>
    (!cat || m.category === cat) &&
    (m.name.toLowerCase().includes(query))
  );

  grid.innerHTML = items.map(m => `
    <div class="col-sm-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <img src="${m.img}" class="card-img-top" alt="${m.name}">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-1">
            <h5 class="card-title mb-0">${m.name}</h5>
            <span class="badge badge-category">${m.category}</span>
          </div>
          <p class="fw-semibold">₹${m.price}</p>
          <button class="btn btn-warning mt-auto" onclick="addToCart(${m.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

function initFilters() {
  const catSelect = document.getElementById('categoryFilter');
  if (!catSelect) return;
  const cats = Array.from(new Set(MENU.map(m => m.category))).sort();
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    catSelect.appendChild(opt);
  });
}

/* ====== Booking Form ====== */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  // Restrict date to today or future
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    const booking = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      guests: Number(document.getElementById('guests').value),
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      notes: document.getElementById('notes').value.trim(),
      cart: getCart(),
      total: cartTotal(),
      createdAt: new Date().toISOString()
    };
    const list = storage.get(BOOKINGS_KEY, []);
    list.push(booking);
    storage.set(BOOKINGS_KEY, list);

    // Confirmation
    const msg = document.getElementById('confirmMessage');
    if (msg) {
      msg.textContent = `Thank you, ${booking.name}! Your table for ${booking.guests} on ${booking.date} at ${booking.time} is confirmed.`;
    }
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
    clearCart();
    form.reset();
    form.classList.remove('was-validated');
    updateCartUI();
  }, false);
}

/* ====== Contact Form ====== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    alert('Thanks! Your message has been received. We will get back soon.');
    form.reset();
    form.classList.remove('was-validated');
  }, false);
}

/* ====== Cart Offcanvas ====== */
function initCartCanvas() {
  const btn = document.getElementById('viewCartBtn');
  if (!btn) return;
  const canvasEl = document.getElementById('cartCanvas');
  const off = new bootstrap.Offcanvas(canvasEl);
  btn.addEventListener('click', () => off.show());
  document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
}

/* ====== Init on Load ====== */
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  renderMenu();
  updateCartUI();
  initCartCanvas();
  initBookingForm();
  initContactForm();

  // Search & filter listeners (menu page)
  document.getElementById('searchInput')?.addEventListener('input', renderMenu);
  document.getElementById('categoryFilter')?.addEventListener('change', renderMenu);
});
