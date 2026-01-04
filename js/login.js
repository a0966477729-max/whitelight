document.addEventListener("DOMContentLoaded", () => {
  if(isLoggedIn()){
    window.location.href = "account.html";
    return;
  }
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    if(!email){
      alert("請輸入 Email");
      return;
    }
    login(email);
    setAuthLinks();
    window.location.href = "account.html";
  });
});