document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("[data-logout-btn]");
  if(btn){
    btn.addEventListener("click", () => {
      logout();
      setAuthLinks();
      window.location.href = "index.html";
    });
  }
});