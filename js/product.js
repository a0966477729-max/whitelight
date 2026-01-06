// ========= helpers =========
function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function clamp(n, a, b) {
  n = Number(n) || a;
  return Math.max(a, Math.min(b, n));
}

// ========= product page =========
function initProduct() {
  // ✅ 防呆：避免外部檔案沒載到（data.js / storage.js）
  if (typeof PRODUCTS === "undefined" || !Array.isArray(PRODUCTS) || PRODUCTS.length === 0) {
    console.error("PRODUCTS 未載入或為空，請檢查 js/data.js 是否正確引入");
    return;
  }
  if (typeof money !== "function") {
    console.error("money() 未載入，請檢查 js/storage.js 或相關工具函式");
    return;
  }

  const mainImg = document.getElementById("mainImg"); // ✅ 修：mainImg 必須宣告
  const id = getParam("id") || PRODUCTS[0].id;
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];

  // ====== 基本資訊 ======
  document.title = `白光選品｜${p.name}`;
  document.getElementById("bcCategory").textContent = p.category;
  document.getElementById("bcName").textContent = p.name;

  document.getElementById("pName").textContent = p.name;
  document.getElementById("pCat").textContent = `分類：${p.category}`;
  document.getElementById("pPrice").textContent = money(p.price);

  // ⚠️ 這裡用 innerHTML 是為了保留 <br/> 格式
  // 如果你的 p.description 來源完全可控（自家 data.js），可以接受；否則建議改成純文字避免 XSS
  document.getElementById("pDesc").innerHTML = `
    <b>商品說明</b><br/>
    ${p.description}<br/><br/>
    <b>注意事項</b><br/>
    商品圖片僅供示意；實際樣式與內容依現場或溝通結果為準。
  `;

  // ====== 圖片：只保留「縮圖列」一套（移除數字按鈕那套） ======
  const imgs = (p.images && p.images.length) ? p.images : [p.image].filter(Boolean);

  const thumbsWrap = document.getElementById("thumbs");
  thumbsWrap.innerHTML = "";

  if (imgs.length === 0) {
    // 沒圖也不要爆
    mainImg.src = "";
    mainImg.alt = p.name || "商品圖片";
  } else {
    mainImg.src = imgs[0];
    mainImg.alt = p.name || "商品圖片";

    imgs.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${p.name || "商品"} 縮圖 ${i + 1}`;
      if (i === 0) img.classList.add("active");

      img.addEventListener("click", () => {
        mainImg.src = src;
        thumbsWrap.querySelectorAll("img").forEach(t => t.classList.remove("active"));
        img.classList.add("active");
      });

      thumbsWrap.appendChild(img);
    });
  }

  // ====== 規格 ======
  const sel = document.getElementById("variant");
  sel.innerHTML = "";

  (p.variants || ["預設"]).forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  });

  const updatePrice = () => {
    const chosenVariant = sel.value;
    const newPrice = p.variantPrices?.[chosenVariant] ?? p.price;
    document.getElementById("pPrice").textContent = money(newPrice);
  };
  sel.addEventListener("change", updatePrice);
  updatePrice();

  // ====== 數量 ======
  const qtyEl = document.getElementById("qty");
  const minus = document.getElementById("minus");
  const plus = document.getElementById("plus");
  const setQty = (v) => qtyEl.value = clamp(v, 1, 99);

  minus.addEventListener("click", () => setQty(Number(qtyEl.value) - 1));
  plus.addEventListener("click", () => setQty(Number(qtyEl.value) + 1));
  qtyEl.addEventListener("change", () => setQty(qtyEl.value));

  // ====== 加入購物車 ======
  const addBtn = document.getElementById("addBtn");
  addBtn.addEventListener("click", () => {
    if (typeof addToCart !== "function" || typeof setCartBadge !== "function") {
      alert("購物車功能未載入，請檢查 js/storage.js 是否正確引入");
      return;
    }

    const elegyEl = document.getElementById("customElegy");
    const noteEl = document.getElementById("customNote");

    const elegy = elegyEl?.value.trim() || "";
    let note = noteEl?.value.trim() || "";

    // ✅ 建議：敬輓詞必填；特殊需求若空，自動補「無」（避免使用者被卡住）
    if (!elegy) {
      alert("請填寫敬輓詞／署名後，再加入購物車");
      elegyEl?.focus();
      return;
    }
    if (!note) {
      note = "無";
      if (noteEl) noteEl.value = "無";
    }

    const chosenVariant = sel.value;

    const item = {
      id: p.id,
      qty: clamp(qtyEl.value, 1, 99),
      variant: chosenVariant,
      unitPrice: p.variantPrices?.[chosenVariant] ?? p.price,
      custom: { elegy, note }
    };

    addToCart(item);
    setCartBadge();

    // ✅ 加個成功回饋（報告時老師按了有感）
    alert("已加入購物車！");
  });

  // ✅ 很關鍵：評論功能初始化（你原本有寫，但沒呼叫）
  initReviews(p.id);
}

document.addEventListener("DOMContentLoaded", initProduct);

// ========= reviews (localStorage) =========
function reviewKey(pid) { return `reviews_${pid}`; }

function loadReviews(pid) {
  return JSON.parse(localStorage.getItem(reviewKey(pid)) || "[]");
}

function saveReviews(pid, arr) {
  localStorage.setItem(reviewKey(pid), JSON.stringify(arr));
}

function renderReviews(pid) {
  const list = document.getElementById("reviewList");
  const summary = document.getElementById("reviewSummary");
  if (!list || !summary) return; // 防呆：不是每頁都有評論區

  const reviews = loadReviews(pid);

  if (reviews.length === 0) {
    summary.textContent = "目前尚無評論";
    list.innerHTML = "";
    return;
  }

  const avg = (reviews.reduce((s, r) => s + r.star, 0) / reviews.length).toFixed(1);
  summary.textContent = `平均評分：${avg} / 5（共 ${reviews.length} 則）`;

  list.innerHTML = reviews.slice().reverse().map(r => `
    <div class="review-item">
      <div class="review-meta">
        <div>${"★".repeat(r.star)}${"☆".repeat(5 - r.star)}</div>
        <div>${r.name || "匿名"}｜${new Date(r.ts).toLocaleDateString()}</div>
      </div>
      <div class="review-text">${(r.text || "").replace(/</g, "&lt;")}</div>
    </div>
  `).join("");
}

function initReviews(pid) {
  const starWrap = document.getElementById("starPick");
  const submitBtn = document.getElementById("submitReview");
  if (!starWrap || !submitBtn) return; // 防呆：不是每頁都有評論表單

  let picked = 5;

  const setStar = (n) => {
    picked = n;
    starWrap.querySelectorAll("button").forEach(b => {
      b.classList.toggle("active", Number(b.dataset.star) <= picked);
    });
  };

  starWrap.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-star]");
    if (!b) return;
    setStar(Number(b.dataset.star));
  });

  setStar(5);

  submitBtn.addEventListener("click", () => {
    const name = document.getElementById("reviewName")?.value.trim() || "";
    const textEl = document.getElementById("reviewText");
    const text = textEl?.value.trim() || "";

    if (!text) {
      alert("請輸入評論內容");
      textEl?.focus();
      return;
    }

    const reviews = loadReviews(pid);
    reviews.push({ star: picked, name, text, ts: Date.now() });
    saveReviews(pid, reviews);

    if (textEl) textEl.value = "";
    renderReviews(pid);
  });

  renderReviews(pid);
}
// ✅ 強制初始化評論（就算商品初始化失敗也能點星星）
document.addEventListener("DOMContentLoaded", () => {
  const starWrap = document.getElementById("starPick");
  if (!starWrap) return;

  // 取不到商品資料也沒關係，先用網址 id，沒有就用 default
  const pid = getParam("id") || "default";

  // 避免重複綁定（保險）
  if (starWrap.dataset.bound === "1") return;
  starWrap.dataset.bound = "1";

  initReviews(pid);
});
