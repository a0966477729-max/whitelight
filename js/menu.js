// ====== 1) dropdown（點擊開/關）======
document.addEventListener("click", (e) => {
  const dropdown = e.target.closest(".dropdown");
  document.querySelectorAll(".dropdown").forEach(d => {
    if (d !== dropdown) d.classList.remove("open");
  });
  if (!dropdown) return;
  if (e.target.closest(".dropbtn")) {
    dropdown.classList.toggle("open");
  }
});

// 點外面關閉
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("open"));
  }
});

// ====== 2) 登入/我的帳號/登出 同步（處理多顆）======
function syncMenuAuth(){
  const loginLinks = document.querySelectorAll("[data-login-link]");
  const accountLinks = document.querySelectorAll("[data-account-link]");
  const logoutBtns = document.querySelectorAll("[data-logout-btn]");

  const loggedIn = !!localStorage.getItem("currentUser");

  loginLinks.forEach(el => el.style.display = loggedIn ? "none" : "");
  accountLinks.forEach(el => el.style.display = loggedIn ? "" : "none");
  logoutBtns.forEach(el => el.style.display = loggedIn ? "" : "none");

  logoutBtns.forEach(btn => {
    btn.onclick = () => {
      localStorage.removeItem("currentUser");
      syncMenuAuth();
      location.href = "index.html";
    };
  });
}
document.addEventListener("DOMContentLoaded", syncMenuAuth);

// ====== 3) 分類跨頁連結（index 內切換；非 index 跳回去）======
function goCategory(cat){
  // 存起來，讓首頁載入後自動套用
  localStorage.setItem("selectedCategory", cat);

  const isIndex = location.pathname.endsWith("/") || location.pathname.endsWith("index.html");
  if (isIndex && typeof renderProducts === "function") {
    renderProducts(cat);
    location.hash = "products";
  } else {
    location.href = `index.html#products`;
  }
}

document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-cat]");
  if (!a) return;
  e.preventDefault();
  goCategory(a.dataset.cat);
});

// ====== 4) 首頁載入後套用分類 ======
document.addEventListener("DOMContentLoaded", () => {
  const isIndex = location.pathname.endsWith("/") || location.pathname.endsWith("index.html");
  if (!isIndex) return;

  const cat = localStorage.getItem("selectedCategory");
  if (cat && typeof renderProducts === "function") {
    renderProducts(cat);

    // chips active 也同步一下（如果你有 chip）
    document.querySelectorAll(".chip").forEach(ch => {
      ch.classList.toggle("active", ch.dataset.cat === cat);
    });
  }
});
