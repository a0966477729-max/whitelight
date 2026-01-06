let currentQuickProduct = null;

function renderCategories(){
  const wrap = document.getElementById("categoryChips");
  wrap.innerHTML = "";
  CATEGORIES.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (i===0 ? " active":"");
    btn.textContent = c;
    btn.dataset.cat = c;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      renderProducts(c);
    });
    wrap.appendChild(btn);
  });
}

function productCard(p){
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <a class="thumb" href="product.html?id=${encodeURIComponent(p.id)}" aria-label="${p.name}">
      <img alt="${p.name}" src="${p.image ? p.image : productImageDataURI(p.name)}" />
    </a>
    <div class="content">
      <div class="name">${p.name}</div>
      <div class="meta">
        <span>${p.category}</span>
        <span>${money(p.price)}</span>
      </div>
    </div>
    <div class="actions">
      <a class="btn" href="product.html?id=${encodeURIComponent(p.id)}">查看</a>
      <button class="btn primary" type="button">直接加入</button>
    </div>
  `;
  const addBtn = div.querySelector("button");
  addBtn.addEventListener("click", () => openQuickAdd(p));
  return div;
}

function renderProducts(category){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  const list = PRODUCTS.filter(p => category === "全部" ? true : p.category === category);
  list.forEach(p => grid.appendChild(productCard(p)));
}

// ----- Quick add modal (only for direct add) -----
function openQuickAdd(p){
  currentQuickProduct = p;

  // ===== 規格處理 =====
  const variantField = document.getElementById("qaVariantField");
  const variantSelect = document.getElementById("qaVariant");

  if (p.variants && p.variants.length > 0) {
    variantField.style.display = "block";
    variantSelect.innerHTML = "";
    p.variants.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      variantSelect.appendChild(opt);
    });
  } else {
    variantField.style.display = "none";
    variantSelect.innerHTML = "";
  }

  // ===== 其他欄位重置 =====
  document.getElementById("qaElegy").value = "";
  document.getElementById("qaNote").value = "";
  document.getElementById("qaQty").value = 1;

  document.getElementById("qaTitle").textContent = `加入購物車：${p.name}`;
  document.getElementById("quickAddBackdrop").style.display = "flex";
}

function closeQuickAdd(){
  document.getElementById("quickAddBackdrop").style.display = "none";
  currentQuickProduct = null;
}
function bindQuickAdd(){
  const close = document.getElementById("qaClose");
  const cancel = document.getElementById("qaCancel");
  const confirm = document.getElementById("qaConfirm");
  [close, cancel].forEach(b => b.addEventListener("click", closeQuickAdd));
  document.getElementById("quickAddBackdrop").addEventListener("click", (e) => {
    if(e.target.id === "quickAddBackdrop") closeQuickAdd();
  });
  confirm.addEventListener("click", () => {
    if(!currentQuickProduct) return;
    const qty = Math.max(1, Math.min(99, Number(document.getElementById("qaQty").value)||1));
    const variantSelect = document.getElementById("qaVariant");

    const item = {
      id: currentQuickProduct.id,
      qty,
      variant: variantSelect ? variantSelect.value : "",
      custom: {
        elegy: document.getElementById("qaElegy").value.trim(),
        note: document.getElementById("qaNote").value.trim()
      }
    };

    addToCart(item);
    setCartBadge();
    closeQuickAdd();
    alert("已加入購物車");
  });
}

// ----- Hero carousel -----
function initHeroCarousel(){
  const wrap = document.getElementById("heroCarousel");
  if(!wrap) return;

  const slides = [
    {
      src: "images/index2.jpg",
      href: "index.html#products",
      label: "前往商品列表"
    },
    {
      src: "images/index1.jpg",
      href: "index.html#products",
      label: "蓮花塔系列",
      cat: "蓮花塔"
    },
  ];

  wrap.innerHTML = slides.map(s => `
    <a href="${s.href}" class="hero-slide" aria-label="${s.label}" ${s.cat ? `data-cat="${s.cat}"` : ""}>
      <img src="${s.src}" alt="${s.label}">
    </a>
  `).join("");

  wrap.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-cat]");
    if(!a) return;
    localStorage.setItem("selectedCategory", a.dataset.cat);
  });


  let idx = 0;
  const setIdx = (i) => {
    idx = (i + slides.length) % slides.length;
    wrap.style.transform = `translateX(-${idx * 100}%)`;
  };
  setInterval(() => setIdx(idx + 1), 3800);
}


document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts("全部");
  bindQuickAdd();
  initHeroCarousel();

  const cat = localStorage.getItem("selectedCategory");
  if (cat) {
    renderProducts(cat);
    localStorage.removeItem("selectedCategory");
    location.hash = "products"; 
  }

  syncMenuAuth();
  showAdOnce?.();
});




document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts("全部");
  bindQuickAdd();
  initHeroCarousel();
});


function syncMenuAuth(){
  const loginLink = document.querySelector("[data-login-link]");
  const accountLink = document.querySelector("[data-account-link]");
  const logoutBtn = document.querySelector("[data-logout-btn]");


  const loggedIn = !!localStorage.getItem("currentUser");

  if(loginLink)  loginLink.style.display  = loggedIn ? "none" : "";
  if(accountLink) accountLink.style.display = loggedIn ? "" : "none";
  if(logoutBtn)  logoutBtn.style.display  = loggedIn ? "" : "none";

  if(logoutBtn){
    logoutBtn.onclick = () => {
      localStorage.removeItem("currentUser");
      syncMenuAuth();

      location.href = "index.html";
    };
  }
}

document.addEventListener("DOMContentLoaded", syncMenuAuth);
function showAdOnce(){
  const key = "ad_hide_until";
  const now = new Date();
  const today = now.toISOString().slice(0,10); // yyyy-mm-dd
  if(localStorage.getItem(key) === today) return;

  const modal = document.getElementById("adModal");
  if(!modal) return;

  modal.classList.add("show");

  const close = ()=>{
    modal.classList.remove("show");
    if(document.getElementById("adNoMore")?.checked){
      localStorage.setItem(key, today);
    }
  };

  modal.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", close));
  modal.querySelector(".ad-link")?.addEventListener("click", ()=> setTimeout(close, 150));
}

document.addEventListener("DOMContentLoaded", ()=>{
  showAdOnce();
});
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("promoModal");
  const closeBtn = modal.querySelector(".promo-close");
  const backdrop = modal.querySelector(".promo-backdrop");

  closeBtn.onclick = backdrop.onclick = () => {
    modal.style.display = "none";
  };
});
