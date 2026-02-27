(() => {
  const WA_NUMBER = "557196421411";
  const IG_URL = "https://www.instagram.com/queiroz.engcivil/";
  const EMAIL = "queiroz.carloslm@icloud.com";

  const waUrl = (text) => {
    const msg = encodeURIComponent(text || "Olá! Gostaria de solicitar um orçamento.");
    return `https://wa.me/${WA_NUMBER}?text=${msg}`;
  };

  // --- Header shrink on scroll
  const header = document.querySelector("header[data-header]");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("shadow-md", window.scrollY > 8);
    header.classList.toggle("h-16", window.scrollY > 24);
    header.classList.toggle("h-20", window.scrollY <= 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- Mobile menu
  const menuBtn = document.querySelector("[data-menu-btn]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const backdrop = document.querySelector("[data-mobile-backdrop]");
  const closeMenu = () => {
    mobileNav?.classList.add("translate-x-full");
    backdrop?.classList.add("hidden");
    menuBtn?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow-hidden");
  };
  const openMenu = () => {
    mobileNav?.classList.remove("translate-x-full");
    backdrop?.classList.remove("hidden");
    menuBtn?.setAttribute("aria-expanded", "true");
    document.body.classList.add("overflow-hidden");
  };
  menuBtn?.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    expanded ? closeMenu() : openMenu();
  });
  backdrop?.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
  document.querySelectorAll("[data-mobile-nav] a").forEach(a => a.addEventListener("click", closeMenu));

  // --- Active section link highlight
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll('a[data-nav-link]'));
  const setActive = (id) => {
    navLinks.forEach(a => {
      const isActive = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("text-primary", isActive);
      a.classList.toggle("font-bold", isActive);
      a.classList.toggle("text-text-main", !isActive);
    });
  };
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    }, { rootMargin: "-35% 0px -55% 0px", threshold: [0.05, 0.15, 0.3] });
    sections.forEach(s => io.observe(s));
  }

  // --- WhatsApp buttons
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const service = el.getAttribute("data-service");
    const baseText = service
      ? `Olá! Gostaria de solicitar orçamento para: ${service}.`
      : "Olá! Gostaria de solicitar um orçamento.";
    const href = waUrl(baseText);
    if (el.tagName.toLowerCase() === "a") {
      el.setAttribute("href", href);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    } else {
      el.addEventListener("click", () => window.open(href, "_blank", "noopener"));
    }
  });

  // --- Quick copy interactions
  const toast = document.querySelector("[data-toast]");
  const toastText = document.querySelector("[data-toast-text]");
  let toastTimer = null;
  const showToast = (msg) => {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.remove("opacity-0", "pointer-events-none", "translate-y-2");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add("opacity-0", "pointer-events-none", "translate-y-2");
    }, 2200);
  };

  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(value);
        showToast("Copiado ✔");
      } catch {
        showToast("Não foi possível copiar");
      }
    });
  });

  // --- FAQ: keep only one open
  const faqs = Array.from(document.querySelectorAll("#faq details"));
  faqs.forEach(d => d.addEventListener("toggle", () => {
    if (!d.open) return;
    faqs.forEach(other => { if (other !== d) other.open = false; });
  }));

  // --- Update dynamic links (footer)
  const igLinks = document.querySelectorAll("[data-ig-link]");
  igLinks.forEach(a => { a.href = IG_URL; a.target="_blank"; a.rel="noopener"; });

  const emailLinks = document.querySelectorAll("[data-email-link]");
  emailLinks.forEach(a => { a.href = `mailto:${EMAIL}`; });

})();
