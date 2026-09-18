(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const showcaseTabs = Array.from(document.querySelectorAll(".showcase-tab"));
  const showcaseImage = document.getElementById("showcase-image");
  const showcaseCaption = document.getElementById("showcase-caption");
  const frameTitle = document.getElementById("frame-title");
  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  const spotlightItems = Array.from(document.querySelectorAll(".spotlight"));
  const productFrame = document.querySelector(".product-frame");
  const cursorAura = document.querySelector(".cursor-aura");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  function setHeaderState() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开导航");
    document.body.classList.remove("nav-open");
  }

  function toggleMobileNav() {
    const shouldOpen = navToggle.getAttribute("aria-expanded") !== "true";
    mobileNav.classList.toggle("is-open", shouldOpen);
    navToggle.setAttribute("aria-expanded", String(shouldOpen));
    navToggle.setAttribute("aria-label", shouldOpen ? "关闭导航" : "打开导航");
    document.body.classList.toggle("nav-open", shouldOpen);
  }

  function activateShowcase(tab) {
    const image = tab.dataset.image;
    const title = tab.dataset.title;
    const caption = tab.dataset.caption;
    const alt = tab.dataset.alt;

    if (!image || !showcaseImage) {
      return;
    }

    showcaseTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    showcaseImage.classList.add("is-switching");
    showcaseImage.alt = alt || title || "菲八工具箱界面";
    showcaseCaption.textContent = caption || "";
    frameTitle.textContent = title || "菲八工具箱";

    const nextImage = new Image();
    nextImage.onload = function () {
      showcaseImage.src = image;
      requestAnimationFrame(function () {
        showcaseImage.classList.remove("is-switching");
      });
    };
    nextImage.onerror = function () {
      showcaseImage.src = image;
      showcaseImage.classList.remove("is-switching");
    };
    nextImage.src = image;
  }

  function moveShowcaseFocus(currentIndex, direction) {
    const nextIndex = (currentIndex + direction + showcaseTabs.length) % showcaseTabs.length;
    const nextTab = showcaseTabs[nextIndex];
    nextTab.focus();
    activateShowcase(nextTab);
  }

  showcaseTabs.forEach((tab, index) => {
    tab.addEventListener("click", function () {
      activateShowcase(tab);
    });

    tab.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveShowcaseFocus(index, 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveShowcaseFocus(index, -1);
      } else if (event.key === "Home") {
        event.preventDefault();
        showcaseTabs[0].focus();
        activateShowcase(showcaseTabs[0]);
      } else if (event.key === "End") {
        event.preventDefault();
        const lastTab = showcaseTabs[showcaseTabs.length - 1];
        lastTab.focus();
        activateShowcase(lastTab);
      }
    });

    tab.addEventListener("pointerenter", function () {
      const preload = new Image();
      preload.src = tab.dataset.image;
    });
  });

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", toggleMobileNav);
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
      closeMobileNav();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMobileNav();
    }
  });

  if (finePointer.matches && !reducedMotion.matches) {
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let pointerFrame = 0;

    document.body.classList.add("has-pointer");

    document.addEventListener(
      "pointermove",
      function (event) {
        pointerX = event.clientX;
        pointerY = event.clientY;

        if (!pointerFrame) {
          pointerFrame = requestAnimationFrame(function () {
            if (cursorAura) {
              cursorAura.style.transform = "translate3d(" + pointerX + "px," + pointerY + "px,0)";
            }
            pointerFrame = 0;
          });
        }
      },
      { passive: true }
    );
  }

  spotlightItems.forEach((item) => {
    item.addEventListener(
      "pointermove",
      function (event) {
        if (reducedMotion.matches) {
          return;
        }
        const rect = item.getBoundingClientRect();
        item.style.setProperty("--mx", event.clientX - rect.left + "px");
        item.style.setProperty("--my", event.clientY - rect.top + "px");
      },
      { passive: true }
    );
  });

  if (productFrame && finePointer.matches && !reducedMotion.matches) {
    productFrame.addEventListener(
      "pointermove",
      function (event) {
        const rect = productFrame.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        productFrame.style.setProperty("--rx", (-y * 2.4).toFixed(2) + "deg");
        productFrame.style.setProperty("--ry", (x * 2.8).toFixed(2) + "deg");
        productFrame.style.setProperty("--ty", "-3px");
      },
      { passive: true }
    );

    productFrame.addEventListener("pointerleave", function () {
      productFrame.style.setProperty("--rx", "0deg");
      productFrame.style.setProperty("--ry", "0deg");
      productFrame.style.setProperty("--ty", "0px");
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach((item) => observer.observe(item));
    window.setTimeout(function () {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }, 1200);
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  setHeaderState();
})();
