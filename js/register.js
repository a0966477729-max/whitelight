document.addEventListener("DOMContentLoaded", () => {
  // 已登入就直接去我的帳號
  if (isLoggedIn()) {
    window.location.href = "account.html";
    return;
  }

  const form = document.getElementById("registerForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    if (!email) {
      alert("請輸入 Email");
      return;
    }

    // ✅ 建立使用者資料（純前端示範）
    const user = {
      email,
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim()
    };

    // 存基本資料
    setUser(user);

    // 直接登入
    login(email);

    alert("註冊成功，已登入");
    window.location.href = "account.html";
  });
});
