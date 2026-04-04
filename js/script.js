document.addEventListener("DOMContentLoaded", function () {

  function loadHTML(id, file, callback) {
    fetch(file)
      .then(response => response.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;
        if (callback) callback();
      })
      .catch(err => console.log(err));
  }

  loadHTML("navbar", "navbar.html", function () {

    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll("#mobileNav a").forEach(link => {
      const linkPage = link.getAttribute("href");

      if (linkPage === currentPage) {
        link.classList.add("active");
      }
    });

    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("mobileNav");

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        nav.classList.toggle("active");
      });
    }

    document.querySelectorAll("#mobileNav a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
      });
    });

    const pageName = document.getElementById("pageName");
    if (pageName) {
      pageName.innerText = document.title;
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

      anchor.addEventListener("click", function (e) {

        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);

        if (!target) return;

        e.preventDefault();

        const nav = document.querySelector("nav");
        const navbarHeight = nav ? nav.offsetHeight : 0;

        window.scrollTo({
          top: target.offsetTop - navbarHeight,
          behavior: "smooth"
        });

        history.pushState(null, null, targetId);

        if (navLinks) navLinks.classList.remove("active");

      });

    });

  });

  loadHTML("footer", "footer.html");

  const cursor = document.querySelector(".cursor-hand");

  document.addEventListener("mousemove", e => {
    if (cursor) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }
  });

  const clickables = document.querySelectorAll(
    "a, button, input, textarea, select, label, [role='button'], .clickable"
  );

  clickables.forEach(el => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("hide-custom-cursor");
    });
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("hide-custom-cursor");
    });
  });

  document.addEventListener("mouseover", e => {
    if (!e.target.closest("a, button, input, textarea, select")) {
      document.body.classList.add("cursor-hover");
    }
  });

  document.addEventListener("mouseout", () => {
    document.body.classList.remove("cursor-hover");
  });

  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    document.querySelectorAll(".floating").forEach((el) => {
      const speed = el.getAttribute("data-speed");
      el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });

  const words = document.querySelectorAll(".word");
  let index = 0;

  setInterval(() => {
    if (words.length > 0) {
      words[index].classList.remove("active");
      index = (index + 1) % words.length;
      words[index].classList.add("active");
    }
  }, 2000);

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

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    observer.observe(counter);
  });

  const stat_counters = document.querySelectorAll(".counter");

  stat_counters.forEach(stat_counters => {
    const target = +stat_counters.getAttribute("data-target");
    const speed = 200;

    const updateCount = () => {
      const count = +stat_counters.innerText;
      const increment = target / speed;

      if (count < target) {
        stat_counters.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 15);
      } else {
        stat_counters.innerText = target + "+";
      }
    };

    updateCount();
  });

  const statElements = document.querySelectorAll(".card h3");

  statElements.forEach(statValue => {
    const updateStat = () => {
      const target = +statValue.innerText.replace(/\D/g, '');
      let current = 0;
      const speed = 50;

      const increment = target / speed;

      const animate = () => {
        current += increment;

        if (current < target) {
          statValue.innerText = Math.ceil(current) + "+";
          requestAnimationFrame(animate);
        } else {
          statValue.innerText = target + "+";
        }
      };

      animate();
    };

    updateStat();
  });

  const track = document.querySelector(".scroll-track");
  const section = document.querySelector(".case-study-scroll");

  if (track && section) {
    window.addEventListener("scroll", () => {
      const rect = section.getBoundingClientRect();

      const scrollProgress =
        -rect.top / (section.offsetHeight - window.innerHeight);

      const maxMove = track.scrollWidth - window.innerWidth;

      const moveX = maxMove * scrollProgress;

      track.style.transform = `translateX(-${moveX}px)`;
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

  const filterButtons = document.querySelectorAll(".work-filter button");
  const workCards = document.querySelectorAll(".work-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {

      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      workCards.forEach(card => {
        const category = card.getAttribute("data-category");

        if (filter === "all" || filter === category) {
          card.classList.remove("hide");
        } else {
          card.classList.add("hide");
        }
      });

    });
  });

});

function updateViewer() {
  const caseData = cases[currentCaseIndex];

  document.getElementById("caseImage").src =
    caseData.images[currentImageIndex];

  document.getElementById("caseTitle").innerText =
    caseData.title;

  document.getElementById("imageCount").innerText =
    (currentImageIndex + 1) + " / " + caseData.images.length;
}

const cases = [
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