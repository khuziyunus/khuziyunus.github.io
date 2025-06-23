// Smooth scroll and greeting effect
window.addEventListener("DOMContentLoaded", () => {
  console.log("Welcome to Khuzaima's Portfolio!");

  document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
    });
  });
});
