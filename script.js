document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("nav a");
  links.forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      document.querySelector(a.getAttribute("href"))
        .scrollIntoView({ behavior: "smooth" });
    });
  });
});
