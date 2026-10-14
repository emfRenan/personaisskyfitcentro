(function () {
  var menuBtn = document.querySelector("[data-menu-btn]");
  var menu = document.querySelector("[data-menu]");
  var sheet = document.querySelector("[data-sheet]");
  var lockY = 0;
  var locked = false;

  function lockScroll() {
    if (locked) return;
    lockY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = "fixed";
    document.body.style.top = "-" + lockY + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    locked = true;
  }

  function unlockScroll() {
    if (!locked) return;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    locked = false;
    window.scrollTo(0, lockY);
  }

  function openMenu() {
    if (!menu || !menuBtn) return;
    closeSheet();
    menu.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.querySelector(".sr-only").textContent = "Fechar menu";
    document.body.classList.add("menu-open");
    lockScroll();
    var first = menu.querySelector("a, button");
    if (first) first.focus();
  }

  function closeMenu() {
    if (!menu || !menuBtn || menu.hidden) return;
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.querySelector(".sr-only").textContent = "Abrir menu";
    document.body.classList.remove("menu-open");
    if (!sheet || sheet.hidden) unlockScroll();
  }

  function openSheet() {
    if (!sheet) return;
    closeMenu();
    sheet.hidden = false;
    document.body.classList.add("sheet-open");
    lockScroll();
    var closeBtn = sheet.querySelector("[data-close-sheet]");
    if (closeBtn) closeBtn.focus();
  }

  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
    document.body.classList.remove("sheet-open");
    if (!menu || menu.hidden) unlockScroll();
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      if (menu.hidden) openMenu();
      else closeMenu();
    });
  }

  if (menu) {
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function (event) {
        var href = link.getAttribute("href") || "";
        if (href.charAt(0) === "#") {
          var target = document.querySelector(href);
          if (target) {
            event.preventDefault();
            closeMenu();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          closeMenu();
        }
      });
    });
    menu.querySelectorAll("[data-open-sheet]").forEach(function (btn) {
      btn.addEventListener("click", openSheet);
    });
  }

  document.querySelectorAll("[data-open-sheet]").forEach(function (btn) {
    if (menu && menu.contains(btn)) return;
    btn.addEventListener("click", openSheet);
  });

  document.querySelectorAll("[data-close-sheet]").forEach(function (btn) {
    btn.addEventListener("click", closeSheet);
  });

  if (sheet) {
    sheet.addEventListener("click", function (event) {
      if (event.target === sheet) closeSheet();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeSheet();
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 960) closeMenu();
  });

  if (location.hash === "#menu") openMenu();
})();
