function getParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}
function clamp(n, a, b){
  n = Number(n) || a;
  return Math.max(a, Math.min(b, n));
}
function initProduct(){
  const id = getParam("id") || PRODUCTS[0].id;
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];

  document.title = `白光選品｜${p.name}`;
  document.getElementById("bcCategory").textContent = p.category;
  document.getElementById("bcName").textContent = p.name;

  document.getElementById("pName").textContent = p.name;
  document.getElementById("pCat").textContent = `分類：${p.category}`;
  document.getElementById("pPrice").textContent = money(p.price);
  document.getElementById("pDesc").innerHTML = `
    <b>商品說明</b><br/>
    ${p.description}<br/><br/>
    <b>注意事項</b><br/>
    商品圖片僅供示意；實際樣式與內容依現場或溝通結果為準。
  `;

const imgs = p.images && p.images.length ? p.images : [p.image];

const thumbsWrap = document.getElementById("thumbs");
thumbsWrap.innerHTML = "";

// 預設主圖
mainImg.src = imgs[0];

// 建立縮圖
imgs.forEach((src, i) => {
  const img = document.createElement("img");
  img.src = src;
  if(i === 0) img.classList.add("active");

  img.addEventListener("click", () => {
    mainImg.src = src;
    thumbsWrap.querySelectorAll("img")
      .forEach(t => t.classList.remove("active"));
    img.classList.add("active");
  });

  thumbsWrap.appendChild(img);
});



  const thumbRow = document.getElementById("thumbRow");
  thumbRow.innerHTML = "";
  imgs.forEach((src, idx) => {
    const a = document.createElement("button");
    a.className = "btn";
    a.type = "button";
    a.textContent = String(idx+1);
    a.addEventListener("click", () => mainImg.src = src);
    thumbRow.appendChild(a);
  });

  const sel = document.getElementById("variant");
  sel.innerHTML = "";
  (p.variants || ["預設"]).forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  });

  sel.addEventListener("change", () => {
    const chosenVariant = sel.value;
    const newPrice = p.variantPrices?.[chosenVariant] ?? p.price;
    document.getElementById("pPrice").textContent = money(newPrice);
  });


  const qtyEl = document.getElementById("qty");
  const minus = document.getElementById("minus");
  const plus = document.getElementById("plus");
  const setQty = (v) => qtyEl.value = clamp(v, 1, 99);

  minus.addEventListener("click", () => setQty(Number(qtyEl.value) - 1));
  plus.addEventListener("click", () => setQty(Number(qtyEl.value) + 1));
  qtyEl.addEventListener("change", () => setQty(qtyEl.value));

  const addBtn = document.getElementById("addBtn");
  addBtn.addEventListener("click", () => {
  const elegyEl = document.getElementById("customElegy");
  const noteEl  = document.getElementById("customNote");

  const elegy = elegyEl?.value.trim() || "";
  const note  = noteEl?.value.trim() || "";

  if (!elegy || !note) {
    alert("請填寫敬輓詞／署名與特殊需求後，再加入購物車");
    if (!elegy) elegyEl.focus();
    else noteEl.focus();
    return; 
  }

  const chosenVariant = sel.value;

  const item = {
    id: p.id,
    qty: clamp(qtyEl.value, 1, 99),
    variant: chosenVariant,
    unitPrice: p.variantPrices?.[chosenVariant] ?? p.price,
    custom: {
      elegy,
      note
    }
  };

  addToCart(item);
  setCartBadge();
});



}
document.addEventListener("DOMContentLoaded", initProduct);