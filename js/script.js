document.addEventListener("DOMContentLoaded", function () {

  function loadHTML(id, file, callback) {
    fetch(file)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${file}: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        const element = document.getElementById(id);

        if (element) {
          element.innerHTML = data;

          if (callback) {
            callback();
          }
        }
      })
      .catch(error => {
        console.error(`Error loading ${file}:`, error);
      });
  }

  loadHTML("navbar", "/fragments/navbar.html", function () {

    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("mobileNav");
    const overlay = document.getElementById("navOverlay");
    const navLinks = document.querySelectorAll("#mobileNav a");

    function closeMenu() {
      if (nav) nav.classList.remove("active");
      if (toggle) toggle.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
    }

    let currentPath = window.location.pathname;

    // Normalize away any trailing "index.html" (covers local/static-server
    // setups that serve "/index.html" instead of a clean "/")
    currentPath = currentPath.replace(/index\.html$/i, "");

    if (currentPath !== "/") {
      currentPath = currentPath.replace(/\/$/, "");
    }

    if (currentPath === "") {
      currentPath = "/";
    }

    navLinks.forEach(link => {

      let linkPath = new URL(
        link.getAttribute("href"),
        window.location.origin
      ).pathname;

      linkPath = linkPath.replace(/index\.html$/i, "");

      if (linkPath !== "/") {
        linkPath = linkPath.replace(/\/$/, "");
      }

      if (linkPath === "") {
        linkPath = "/";
      }

      if (currentPath === linkPath) {
        link.classList.add("active");
      }

    });

    if (toggle && nav) {

      toggle.addEventListener("click", function () {
        nav.classList.toggle("active");
        toggle.classList.toggle("active");
        if (overlay) overlay.classList.toggle("active");
      });

    }

    if (overlay) {
      overlay.addEventListener("click", closeMenu);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    navLinks.forEach(link => {

      link.addEventListener("click", function () {

        if (nav) {
          nav.classList.remove("active");
        }

        if (toggle) {
          toggle.classList.remove("active");
        }

        if (overlay) {
          overlay.classList.remove("active");
        }

      });

    });

    const pageName = document.getElementById("pageName");

    if (pageName) {
      pageName.innerText = document.title;
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

      anchor.addEventListener("click", function (e) {

        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
          return;
        }

        e.preventDefault();

        const navbar = document.querySelector(".navbar");

        const navbarHeight = navbar
          ? navbar.offsetHeight
          : 0;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
        history.pushState(null, "", targetId);
        if (nav) {
          nav.classList.remove("active");
        }
        if (toggle) {
          toggle.classList.remove("active");
        }
      });
    });
  });

  loadHTML("footer", "/fragments/footer.html");

  const cursor = document.querySelector(".cursor-hand");

  document.addEventListener("mousemove", function (e) {

    if (cursor) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }

  });

  function updateClickableElements() {

    const clickables = document.querySelectorAll(
      "a, button, input, textarea, select, label, [role='button'], .clickable"
    );

    clickables.forEach(el => {

      el.addEventListener("mouseenter", function () {
        document.body.classList.add("hide-custom-cursor");
      });

      el.addEventListener("mouseleave", function () {
        document.body.classList.remove("hide-custom-cursor");
      });

    });

  }

  updateClickableElements();

  document.addEventListener("mouseover", function (e) {

    if (!e.target.closest("a, button, input, textarea, select")) {
      document.body.classList.add("cursor-hover");
    }

  });

  document.addEventListener("mouseout", function () {
    document.body.classList.remove("cursor-hover");
  });

  const reveals = document.querySelectorAll(".reveal");

  if (reveals.length > 0) {
    window.addEventListener("scroll", () => {
      reveals.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
          el.classList.add("active");
        }
      });
    });
  }

  const btn = document.getElementById("backToTop");

  if (btn) {
    window.addEventListener("scroll", () => {
      if (document.documentElement.scrollTop > 200) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    });

    btn.onclick = function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };
  }

  /* ---------- Home page: floating icon parallax ---------- */

  document.addEventListener("mousemove", function (e) {

    const x =
      (e.clientX / window.innerWidth - 0.5) * 20;

    const y =
      (e.clientY / window.innerHeight - 0.5) * 20;

    document.querySelectorAll(".floating").forEach(el => {

      const speed =
        parseFloat(el.getAttribute("data-speed")) || 1;

      el.style.transform =
        `translate(${x * speed}px, ${y * speed}px)`;

    });

  });

  /* ---------- Home page: hero word rotator ---------- */

  const words = document.querySelectorAll(".word");
  let wordIndex = 0;

  if (words.length > 0) {
    setInterval(() => {
      words[wordIndex].classList.remove("active");
      wordIndex = (wordIndex + 1) % words.length;
      words[wordIndex].classList.add("active");
    }, 2000);
  }

  /* ---------- Home page: case-study horizontal scroll ---------- */

  const track = document.querySelector(".scroll-track");
  const scrollSection = document.querySelector(".case-study-scroll");

  if (track && scrollSection) {
    window.addEventListener("scroll", () => {
      const rect = scrollSection.getBoundingClientRect();

      const scrollProgress =
        -rect.top / (scrollSection.offsetHeight - window.innerHeight);

      const maxMove = track.scrollWidth - window.innerWidth;

      const moveX = maxMove * scrollProgress;

      track.style.transform = `translateX(-${moveX}px)`;
    });
  }

  /* ---------- Home page: stat counters ---------- */

  const counters = document.querySelectorAll(".counter");

  const startCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    let count = 0;
    const speed = 100;

    const update = () => {
      const increment = target / speed;

      if (count < target) {
        count += increment;
        counter.innerText = Math.ceil(count);
        requestAnimationFrame(update);
      } else {
        counter.innerText = target + "+";
      }
    };

    update();
  };

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

});

/* ============================================================
   Home page: case-study viewer
   (declared in the global scope so the inline onclick="openCase(i)"
   handlers on index.html can call them directly)
   ============================================================ */

function updateViewer() {
  const caseData = cases[currentCaseIndex];

  const viewerImg = document.getElementById("caseImage");
  viewerImg.src = caseData.images[currentImageIndex];
  viewerImg.alt = caseData.title + " case study slide " +
    (currentImageIndex + 1) + " of " + caseData.images.length;

  document.getElementById("caseTitle").innerText =
    caseData.title;

  document.getElementById("imageCount").innerText =
    (currentImageIndex + 1) + " / " + caseData.images.length;
}

const cases = [
  {
    title: "Chetna Joshi",
    images: [
      "images/caseStudy/BTD_page-0029.jpg",
      "images/caseStudy/BTD_page-0030.jpg",
      "images/caseStudy/BTD_page-0031.jpg",
      "images/caseStudy/BTD_page-0032.jpg"
    ]
  },
  {
    title: "Aanchal Shrivastava",
    images: [
      "images/caseStudy/BTD_page-0033.jpg",
      "images/caseStudy/BTD_page-0034.jpg",
      "images/caseStudy/BTD_page-0035.jpg",
      "images/caseStudy/BTD_page-0036.jpg"
    ]
  },
  {
    title: "Raman Kapur",
    images: [
      "images/caseStudy/BTD_page-0037.jpg",
      "images/caseStudy/BTD_page-0038.jpg",
      "images/caseStudy/BTD_page-0039.jpg"
    ]
  },
  {
    title: "Lata Tondon",
    images: [
      "images/caseStudy/BTD_page-0041.jpg",
      "images/caseStudy/BTD_page-0042.jpg",
      "images/caseStudy/BTD_page-0043.jpg",
      "images/caseStudy/BTD_page-0044.jpg"
    ]
  },
  {
    title: "Meal Berg",
    images: [
      "images/caseStudy/BTD_page-0012.jpg",
      "images/caseStudy/BTD_page-0013.jpg",
      "images/caseStudy/BTD_page-0014.jpg",
      "images/caseStudy/BTD_page-0015.jpg",
      "images/caseStudy/BTD_page-0016.jpg"
    ]
  },
  {
    title: "Vedansh Craft",
    images: [
      "images/caseStudy/BTD_page-0017.jpg",
      "images/caseStudy/BTD_page-0018.jpg",
      "images/caseStudy/BTD_page-0019.jpg",
      "images/caseStudy/BTD_page-0020.jpg"
    ]
  },
  {
    title: "Think Tank Interiors",
    images: [
      "images/caseStudy/BTD_page-0021.jpg",
      "images/caseStudy/BTD_page-0022.jpg",
      "images/caseStudy/BTD_page-0023.jpg",
      "images/caseStudy/BTD_page-0024.jpg"
    ]
  },
  {
    title: "Country Sports",
    images: [
      "images/caseStudy/BTD_page-0025.jpg",
      "images/caseStudy/BTD_page-0026.jpg",
      "images/caseStudy/BTD_page-0027.jpg"
    ]
  },
  {
    title: "360 DigiTMG",
    images: [
      "images/caseStudy/BTD_page-0045.jpg",
      "images/caseStudy/BTD_page-0046.jpg",
      "images/caseStudy/BTD_page-0047.jpg"
    ]
  },
  {
    title: "Oya Kekars",
    images: [
      "images/caseStudy/BTD_page-0048.jpg",
      "images/caseStudy/BTD_page-0049.jpg",
      "images/caseStudy/BTD_page-0050.jpg",
      "images/caseStudy/BTD_page-0051.jpg"
    ]
  }
];

let currentCaseIndex = 0;
let currentImageIndex = 0;

function openCase(index) {
  currentCaseIndex = index;
  currentImageIndex = 0;

  document.getElementById("caseViewer").classList.add("active");
  updateViewer();
}

function closeCase() {
  document.getElementById("caseViewer").classList.remove("active");
}

function nextCase() {
  const caseData = cases[currentCaseIndex];

  if (currentImageIndex < caseData.images.length - 1) {
    currentImageIndex++;
  } else {
    currentImageIndex = 0;
  }

  updateViewer();
}

function prevCase() {
  const caseData = cases[currentCaseIndex];

  if (currentImageIndex > 0) {
    currentImageIndex--;
  } else {
    currentImageIndex = caseData.images.length - 1;
  }

  updateViewer();
}
