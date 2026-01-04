function renderSummary(){
  const wrap = document.getElementById("summary");
  const cart = getCart();
  if(cart.length === 0){
    wrap.innerHTML = `<div class="notice">購物車是空的，請先挑選商品。</div>
      <div style="margin-top:10px"><a class="btn primary" href="index.html">回到首頁</a></div>`;
    document.getElementById("sumTotal").textContent = money(0);
    return;
  }

  const rows = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    const unit = p ? p.price : 0;
    const qty = Number(item.qty)||1;
    return `
      <div class="row" style="justify-content:space-between; align-items:flex-start; margin:10px 0">
        <div>
          <div style="font-weight:800">${p ? p.name : item.id}</div>
          <div class="muted" style="font-size:12px; margin-top:3px">${item.variant ? `規格：${item.variant}` : ""}</div>
          ${item.custom?.elegy ? `<div class="muted" style="font-size:12px">敬輓詞/署名：${item.custom.elegy}</div>` : ""}
        </div>
        <div style="text-align:right">
          <div>${money(unit * qty)}</div>
          <div class="muted" style="font-size:12px">× ${qty}</div>
        </div>
      </div>
    `;
  }).join("");

  wrap.innerHTML = rows;
  document.getElementById("sumTotal").textContent = money(cartSubtotal());
}

function prefillFromProfile(){
  const user = getUser();
  if(!user) return;
  if(user.name) document.getElementById("buyerName").value = user.name;
  if(user.phone) document.getElementById("buyerPhone").value = user.phone;
  if(user.email) document.getElementById("buyerEmail").value = user.email;
  if(user.address) document.getElementById("address").value = user.address;
}

function showLoginHint(){
  const hint = document.getElementById("loginHint");
  if(!isLoggedIn()){
    hint.style.display = "block";
  }
}

function bindSubmit(){
  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const cart = getCart();
    if(cart.length === 0){
      alert("購物車是空的，請先挑選商品。");
      return;
    }

    const buyerName = document.getElementById("buyerName").value.trim();
    const buyerPhone = document.getElementById("buyerPhone").value.trim();
    const buyerEmail = document.getElementById("buyerEmail").value.trim();
    const receiverName = document.getElementById("receiverName").value.trim();
    const receiverPhone = document.getElementById("receiverPhone").value.trim();
    const address = document.getElementById("address").value.trim();

    if(!buyerName || !buyerPhone || !buyerEmail || !receiverName || !receiverPhone || !address){
      alert("請填寫所有必填欄位（標示 *）。");
      return;
    }

    const deliverDate = document.getElementById("deliverDate").value || "";
    const payment = document.querySelector("input[name='pay']:checked")?.value || "信用卡";
    const orderNote = document.getElementById("orderNote").value.trim();

    const order = {
      orderId: genOrderId(),
      createdAt: new Date().toISOString(),
      status: "已成立（待聯繫確認）",
      userEmail: isLoggedIn() ? currentEmail() : "",
      buyer: { name: buyerName, phone: buyerPhone, email: buyerEmail },
      receiver: { name: receiverName, phone: receiverPhone, address },
      deliverDate,
      payment,
      note: orderNote,
      items: cart,
      subtotal: cartSubtotal(),
      total: cartSubtotal()
    };

    // 若登入：同步更新基本資料（更像電商）
    if(isLoggedIn()){
      const u = getUser() || { email: currentEmail(), name:"", phone:"", address:"" };
      u.name = buyerName;
      u.phone = buyerPhone;
      u.address = address;
      setUser(u);
    }

    saveOrder(order);
    clearCart();
    setCartBadge();
    window.location.href = `success.html?orderId=${encodeURIComponent(order.orderId)}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSummary();
  showLoginHint();
  prefillFromProfile();
  bindSubmit();
});