function getParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function render(){
  const order = getLastOrder();
  const oid = getParam("orderId");

  const info = document.getElementById("orderInfo");
  const itemsWrap = document.getElementById("items");
  const totalEl = document.getElementById("total");

  if(!order || (oid && order.orderId !== oid)){
    info.innerHTML = `<div class="notice">找不到訂單資料（可能已清除瀏覽器資料）。</div>`;
    itemsWrap.innerHTML = "";
    totalEl.textContent = money(0);
    return;
  }

  const created = new Date(order.createdAt);
  info.innerHTML = `
    <div><b>訂單編號：</b>${order.orderId}</div>
    <div><b>狀態：</b>${order.status}</div>
    <div><b>建立時間：</b>${created.toLocaleString("zh-Hant-TW")}</div>
    <div style="margin-top:10px"><b>訂購人：</b>${order.buyer.name}（${order.buyer.phone}）</div>
    <div><b>收件人：</b>${order.receiver.name}（${order.receiver.phone}）</div>
    <div><b>配送地址：</b>${order.receiver.address}</div>
    ${order.deliverDate ? `<div><b>希望送達日期：</b>${order.deliverDate}</div>` : ""}
    <div><b>付款方式：</b>${order.payment}</div>
    ${order.note ? `<div style="margin-top:10px"><b>訂單備註：</b>${order.note}</div>` : ""}
    ${order.userEmail ? `<div style="margin-top:10px"><b>綁定帳號：</b>${order.userEmail}</div>` : `<div style="margin-top:10px" class="notice">此訂單以「未登入」方式下單，不會出現在歷史訂單中（展示設定）。</div>`}
  `;

  const rows = order.items.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    const unit = p ? p.price : 0;
    const qty = Number(item.qty)||1;
    const custom = item.custom || {};
    return `
      <div style="display:flex; gap:10px; margin:10px 0">
        <img alt="${p ? p.name : item.id}" src="${(p && p.image) ? p.image : productImageDataURI(p ? p.name : "商品")}" style="width:84px; height:58px; border-radius:12px; object-fit:cover; border:1px solid var(--line)"/>
        <div style="flex:1">
          <div style="font-weight:800">${p ? p.name : item.id}</div>
          <div class="muted" style="font-size:12px">規格：${item.variant || "—"}｜數量：${qty}</div>
          ${custom.elegy ? `<div class="muted" style="font-size:12px">敬輓詞/署名：${custom.elegy}</div>` : ""}
          ${custom.note ? `<div class="muted" style="font-size:12px">特殊需求：${custom.note}</div>` : ""}
        </div>
        <div style="min-width:120px; text-align:right">${money(unit * qty)}</div>
      </div>
    `;
  }).join("");

  itemsWrap.innerHTML = rows;
  totalEl.textContent = money(order.total);
}

document.addEventListener("DOMContentLoaded", render);