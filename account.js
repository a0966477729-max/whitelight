function requireLogin(){
  if(!isLoggedIn()){
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function loadProfile(){
  const u = getUser();
  if(!u) return;
  document.getElementById("name").value = u.name || "";
  document.getElementById("phone").value = u.phone || "";
  document.getElementById("address").value = u.address || "";
}

function bindProfileSave(){
  const form = document.getElementById("profileForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const u = getUser() || { email: currentEmail(), name:"", phone:"", address:"" };
    u.name = document.getElementById("name").value.trim();
    u.phone = document.getElementById("phone").value.trim();
    u.address = document.getElementById("address").value.trim();
    setUser(u);
    alert("已儲存");
  });
}

function renderOrders(){
  const wrap = document.getElementById("ordersBox");
  const orders = listMyOrders();

  if(orders.length === 0){
    wrap.innerHTML = `<div class="notice">目前沒有歷史訂單。完成結帳後，訂單會出現在這裡（需登入下單）。</div>`;
    return;
  }

  wrap.innerHTML = orders.map(o => {
    const created = new Date(o.createdAt).toLocaleString("zh-Hant-TW");
    const itemCount = o.items.reduce((s,x)=>s+(Number(x.qty)||0),0);
    return `
      <div style="border:1px solid var(--line); border-radius:14px; padding:12px; margin:10px 0">
        <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start">
          <div>
            <div style="font-weight:900">${o.orderId}</div>
            <div class="muted" style="font-size:12px; margin-top:3px">${created}</div>
            <div class="muted" style="font-size:12px">狀態：${o.status}</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:900">${money(o.total)}</div>
            <div class="muted" style="font-size:12px">共 ${itemCount} 件</div>
          </div>
        </div>
        <div class="muted" style="font-size:12px; margin-top:10px">
          收件人：${o.receiver.name}｜地址：${o.receiver.address}
        </div>
      </div>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  if(!requireLogin()) return;
  setAuthLinks();
  document.querySelector("[data-user-email]").textContent = currentEmail();
  loadProfile();
  bindProfileSave();
  renderOrders();
});