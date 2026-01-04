function renderCart(){
  const body = document.getElementById("cartBody");
  const emptyBox = document.getElementById("emptyBox");
  const toCheckout = document.getElementById("toCheckout");

  const cart = getCart();
  body.innerHTML = "";

  if(cart.length === 0){
    emptyBox.style.display = "block";
    toCheckout.addEventListener("click", (e) => e.preventDefault());
  }else{
    emptyBox.style.display = "none";
  }

  cart.forEach((item, idx) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    const custom = item.custom || {};
    const customLines = [
      item.variant ? `規格：${item.variant}` : "",
      custom.elegy ? `敬輓詞/署名：${custom.elegy}` : "",
      custom.note ? `特殊需求：${custom.note}` : ""
    ].filter(Boolean);

    // ✅ 單價：優先用 item.unitPrice（規格價），沒有才用 p.price
    const unit = Number(item.unitPrice) || (p ? p.price : 0);
    const qty = Number(item.qty) || 1;
    const sub = unit * qty;

    // ✅ 圖片來源：優先 p.image，沒有就用示意圖
    const imgSrc = (p && p.image) ? p.image : productImageDataURI(p ? p.name : "商品");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="display:flex; gap:10px; align-items:center">
          <img
            src="${imgSrc}"
            alt="${p ? p.name : "商品"}"
            style="width:64px; height:44px; border-radius:10px; object-fit:cover; border:1px solid var(--line)"
          />
          <div>
            <div style="font-weight:800">${p ? p.name : item.id}</div>
            <div class="small muted">${p ? p.category : ""}</div>
          </div>
        </div>
      </td>
      <td>${customLines.length ? customLines.map(x => `<div class="small">${x}</div>`).join("") : '<span class="small muted">—</span>'}</td>
      <td class="right-align">${money(unit)}</td>
      <td class="right-align">
        <input type="number" min="1" max="99" value="${qty}" style="width:80px; text-align:center" data-qty="${idx}">
      </td>
      <td class="right-align">${money(sub)}</td>
      <td class="right-align">
        <button class="btn danger" type="button" data-del="${idx}">刪除</button>
      </td>
    `;
    body.appendChild(tr);
  });

  body.querySelectorAll("input[data-qty]").forEach(input => {
    input.addEventListener("change", () => {
      const idx = Number(input.dataset.qty);
      updateCartQty(idx, input.value);
      setCartBadge();
      renderCart();
      updateTotals();
    });
  });

  body.querySelectorAll("button[data-del]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.del);
      removeCartItem(idx);
      setCartBadge();
      renderCart();
      updateTotals();
    });
  });

  updateTotals();
}
function updateTotals(){
  const sub = cartSubtotal();
  const shipping = sub > 0 ? 0 : 0;
  const total = sub + shipping;

  document.getElementById("subtotal").textContent = money(sub);
  document.getElementById("shipping").textContent = money(shipping);
  document.getElementById("total").textContent = money(total);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  setCartBadge();
});
