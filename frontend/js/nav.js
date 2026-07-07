// ============================================================
// nav.js — Navbar sticky, menu mobile, evidenziazione sezione
// ============================================================

function initNav() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".nav-mobile");

  // Navbar compatta allo scroll
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu mobile
  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !mobileNav.classList.contains("open");
    mobileNav.classList.toggle("open", isOpen);
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  hamburger.addEventListener("click", () => toggleMenu());
  mobileNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => toggleMenu(false)),
  );

  // Evidenzia il link della sezione visibile
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`),
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  sections.forEach((s) => spy.observe(s));
}
