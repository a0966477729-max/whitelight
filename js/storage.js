const STORAGE_KEYS = {
  cart: "white_light_cartItems",
  orders: "white_light_orders",
  lastOrder: "white_light_lastOrder",
  user: "white_light_user",
  session: "white_light_session"
};

function readJSON(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return fallback;
    return JSON.parse(raw);
  }catch(e){ return fallback; }
}
function writeJSON(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

// ----- Auth (簡易前端登入) -----
function getUser(){
  return readJSON(STORAGE_KEYS.user, null);
}
function setUser(user){
  writeJSON(STORAGE_KEYS.user, user);
}
function isLoggedIn(){
  const s = readJSON(STORAGE_KEYS.session, null);
  return !!(s && s.loggedIn);
}
function login(email){
  const user = getUser() || { email, name:"", phone:"", address:"" };
  user.email = email;
  setUser(user);
  writeJSON(STORAGE_KEYS.session, { loggedIn:true, email });
}
function logout(){
  writeJSON(STORAGE_KEYS.session, { loggedIn:false });
}
function currentEmail(){
  const s = readJSON(STORAGE_KEYS.session, null);
  return s?.email || "";
}

// ----- Cart -----
function getCart(){ return readJSON(STORAGE_KEYS.cart, []); }
function setCart(items){ writeJSON(STORAGE_KEYS.cart, items); }

function addToCart(item){
  // item: {id, qty, variant, custom:{elegy,title,note}}
  const cart = getCart();
  cart.push(item);
  setCart(cart);
}

function updateCartQty(index, qty){
  const cart = getCart();
  if(index < 0 || index >= cart.length) return;
  cart[index].qty = Math.max(1, Math.min(99, Number(qty)||1));
  setCart(cart);
}

function removeCartItem(index){
  const cart = getCart();
  cart.splice(index, 1);
  setCart(cart);
}

function clearCart(){ setCart([]); }

function cartCount(){
  return getCart().reduce((s, x) => s + (Number(x.qty)||0), 0);
}

function cartSubtotal(){
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return sum + (p ? p.price * (Number(item.qty)||0) : 0);
  }, 0);
}

function genOrderId(){
  const d = new Date();
  const pad = (n) => String(n).padStart(2,"0");
  return `ORD${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function saveOrder(order){
  const orders = readJSON(STORAGE_KEYS.orders, []);
  orders.unshift(order);
  writeJSON(STORAGE_KEYS.orders, orders);
  writeJSON(STORAGE_KEYS.lastOrder, order);
}
function getLastOrder(){ return readJSON(STORAGE_KEYS.lastOrder, null); }

function listMyOrders(){
  const orders = readJSON(STORAGE_KEYS.orders, []);
  const email = currentEmail();
  if(!email) return [];
  return orders.filter(o => (o.userEmail||"") === email);
}

function setCartBadge(){
  const el = document.querySelector("[data-cart-badge]");
  if(!el) return;
  const n = cartCount();
  el.textContent = n;
  el.style.display = n > 0 ? "inline-flex" : "none";
}
function setAuthLinks(){
  const loginLink = document.querySelector("[data-login-link]");
  const acctLink = document.querySelector("[data-account-link]");
  const logoutBtn = document.querySelector("[data-logout-btn]");
  const emailEl = document.querySelector("[data-user-email]");

  const logged = isLoggedIn();
  if(loginLink) loginLink.style.display = logged ? "none" : "inline";
  if(acctLink) acctLink.style.display = logged ? "inline" : "none";
  if(logoutBtn) logoutBtn.style.display = logged ? "inline" : "none";
  if(emailEl) emailEl.textContent = logged ? currentEmail() : "";
}

document.addEventListener("DOMContentLoaded", () => {
  setCartBadge();
  setAuthLinks();
});