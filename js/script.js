const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxClose = lightbox?.querySelector(".lightbox-close");
const placeholderSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520">
  <rect width="900" height="520" fill="#FAF7F0"/>
  <rect x="34" y="34" width="832" height="452" rx="24" fill="#FFFFFF" stroke="#D8CFC0" stroke-width="3"/>
  <circle cx="156" cy="138" r="46" fill="#EFE7D8"/>
  <rect x="228" y="112" width="430" height="24" rx="12" fill="#1F6F5B" opacity=".22"/>
  <rect x="228" y="154" width="300" height="20" rx="10" fill="#C76F45" opacity=".22"/>
  <text x="450" y="284" fill="#1F6F5B" font-family="Arial, sans-serif" font-size="34" font-weight="700" text-anchor="middle">Image Placeholder</text>
  <text x="450" y="332" fill="#5F6F67" font-family="Arial, sans-serif" font-size="22" text-anchor="middle">Replace this asset with your project image</text>
</svg>
`);

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });
}

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    if (!navToggle || !navLinks) {
      return;
    }

    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
    document.body.classList.remove("nav-open");
  });
});

if (sections.length > 0 && navItems.length > 0) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navItems.forEach((link) => {
          const href = link.getAttribute("href");
          link.classList.toggle("active", href === `#${entry.target.id}`);
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => activeObserver.observe(section));
}

if (revealItems.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll(".lightbox-image").forEach((image) => {
  image.addEventListener("error", () => {
    image.src = `data:image/svg+xml;charset=utf-8,${placeholderSvg}`;
  }, { once: true });

  image.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) {
      return;
    }

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxClose?.focus();
  });
});

document.querySelectorAll(".headshot").forEach((image) => {
  image.addEventListener("error", () => {
    image.style.display = "none";
    image.nextElementSibling?.classList.add("show");
  }, { once: true });
});

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
}

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});
