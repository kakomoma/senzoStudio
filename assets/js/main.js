document.addEventListener("DOMContentLoaded", () => {
  // --- LANGUAGE SWITCHER ---
  const langButton = document.querySelector(".buttonLanguage p");
  const languageButtonContainer = document.querySelector(".buttonLanguage");
  let currentLang = localStorage.getItem("lang") || "en";

  // Function to fetch and apply translations
  async function loadLanguage(lang) {
    try {
      const response = await fetch(`/senzoStudio/language/${lang}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const translations = await response.json();

      document.querySelectorAll("[data-key]").forEach((el) => {
        const key = el.getAttribute("data-key");
        if (translations[key]) {
          el.innerHTML = translations[key];
        }
      });

      if (langButton) {
        langButton.textContent = lang.toUpperCase();
      }
      localStorage.setItem("lang", lang);
      currentLang = lang;
    } catch (error) {
      console.error("Error cargando idioma:", error);
    }
  }

  // Language switch event listener
  if (languageButtonContainer) {
    languageButtonContainer.addEventListener("click", () => {
      const newLang = currentLang === "en" ? "es" : "en";
      loadLanguage(newLang);
    });
  }

  // Initialize language on page load
  loadLanguage(currentLang);

  // --- HERO GALLERY ---
  const slides = [
    {
      img: "1883.webp",
      title: "1883",
      key: "firstHeroGalleryImageDescription",
    },
    {
      img: "monster.webp",
      title: "Monster",
      key: "secondHeroGalleryImageDescription",
    },
    {
      img: "motherland.webp",
      title: "Motherland",
      key: "thirdHeroGalleryImageDescription",
    },
    {
      img: "neom.webp",
      title: "Neom",
      key: "fourthHeroGalleryImageDescription",
    },
    {
      img: "ritmo.webp",
      title: "Ritmo",
      key: "fifthHeroGalleryImageDescription",
    },
    {
      img: "sky.webp",
      title: "Sky",
      key: "sixthHeroGalleryImageDescription",
    },
    {
      img: "synergy.webp",
      title: "Synergy",
      key: "seventhHeroGalleryImageDescription",
    },
    {
      img: "theCurse.webp",
      title: "The Curse",
      key: "eighthHeroGalleryImageDescription",
    },
    {
      img: "theUmbrellaAcademy.webp",
      title: "The Umbrella Academy",
      key: "ninthHeroGalleryImageDescription",
    },
    {
      img: "tyskie.webp",
      title: "Tyskie",
      key: "tenthHeroGalleryImageDescription",
    },
  ];

  const hero = document.querySelector(".heroGallery");
  const titleEl = document.querySelector(".large-bold");
  const descEl = document.querySelector(".regular[data-key]");
  const dots = document.querySelectorAll(".sliderDot");
  const prevBtn = document.querySelectorAll(".buttonRegular")[0];
  const nextBtn = document.querySelectorAll(".buttonRegular")[1];
  let currentIndex = 0;
  let interval;

  // Create background layers for fade effect
  const bg1 = document.createElement("div");
  const bg2 = document.createElement("div");
  if (hero) {
    [bg1, bg2].forEach((bg) => {
      bg.classList.add("heroBackground");
      hero.appendChild(bg);
    });
  }

  // Function to display the current slide
  function showSlide(index) {
    if (!hero || !titleEl || !descEl || !dots.length || !bg1 || !bg2) {
      console.error("One or more gallery elements are missing.");
      return;
    }
    const slide = slides[index];
    const nextBg = bg1.style.opacity === "1" ? bg2 : bg1;
    const currentBg = nextBg === bg1 ? bg2 : bg1;

    nextBg.style.backgroundImage = `url('assets/images/heroGallery/${slide.img}')`;
    nextBg.style.opacity = ".7";
    currentBg.style.opacity = "0";

    titleEl.textContent = slide.title;
    descEl.setAttribute("data-key", slide.key);
    loadLanguage(currentLang);

    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    currentIndex = index;
  }

  // Navigation functions
  function nextSlide() {
    let newIndex = (currentIndex + 1) % slides.length;
    showSlide(newIndex);
  }

  function prevSlide() {
    let newIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(newIndex);
  }

  // Autoplay functions
  function startAutoPlay() {
    interval = setInterval(nextSlide, 7500);
  }

  function stopAutoPlay() {
    clearInterval(interval);
  }

  // Gallery event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopAutoPlay();
      showSlide(i);
      startAutoPlay();
    });
  });

  // Initialize gallery
  if (bg1 && bg2) {
    bg1.classList.add("heroBackground");
    bg2.classList.add("heroBackground");
    bg1.style.opacity = "1";
    bg2.style.opacity = "0";
  }

  showSlide(0);
  startAutoPlay();

  // --- INFINITE SCROLLER ---
  const scrollers = document.querySelectorAll(".scroller");

  function addAnimation() {
    scrollers.forEach((scroller) => {
      scroller.setAttribute("data-animated", true);
      const scrollerInner = scroller.querySelector(".scroller__inner");
      const scrollerContent = Array.from(scrollerInner.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        duplicatedItem.setAttribute("aria-hidden", true);
        scrollerInner.appendChild(duplicatedItem);
      });
    });
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
  }

  // --- TABLE OF CONTENTS ---
  const indicator = document.getElementById("toc-indicator");
  const modal = document.getElementById("toc-modal");
  const list = document.getElementById("toc-list");
  let lines = [];
  let items = [];

  function buildTOC() {
    indicator.innerHTML = "";
    list.innerHTML = "";
    lines = [];
    items = [];

    const sections = document.querySelectorAll(".sectionHeader");

    sections.forEach((section) => {
      // Ignorar si está dentro de modalReel o modalProjects
      if (section.closest("#modal-reel") || section.closest("#modal-projects"))
        return;

      const h2 = section.querySelector("h2");
      if (!h2 || !h2.dataset.key) return;

      const targetId = section.parentElement.id;

      // Línea del indicador
      const line = document.createElement("div");
      line.classList.add("toc-line");
      line.dataset.target = targetId;
      indicator.appendChild(line);
      lines.push(line);

      // Ítem en el modal
      const li = document.createElement("li");
      li.dataset.target = targetId;
      li.innerHTML = `<p class="regular" data-key="${h2.dataset.key}"></p>`;
      list.appendChild(li);
      items.push(li);

      li.addEventListener("click", () => {
        const sectionEl = document.getElementById(targetId);
        sectionEl.scrollIntoView({ behavior: "smooth" });

        const h2El = sectionEl.querySelector("h2");
        if (h2El) {
          h2El.classList.add("highlight");
          setTimeout(() => h2El.classList.remove("highlight"), 2000);
        }
      });
    });

    if (typeof currentLang !== "undefined") {
      loadLanguage(currentLang);
    }
  }

  // Abrir/cerrar modal desde el componente principal
  indicator.addEventListener("click", () => {
    modal.classList.toggle("active");
  });

  // Cerrar modal al hacer click fuera
  document.addEventListener("click", (e) => {
    if (!modal.contains(e.target) && !indicator.contains(e.target)) {
      modal.classList.remove("active");
    }
  });

  // Actualizar activos según scroll
  function updateActiveSection() {
    let current = "";
    const sections = document.querySelectorAll(".sectionHeader");

    sections.forEach((section) => {
      const parent = section.parentElement;
      const rect = parent.getBoundingClientRect();
      if (
        rect.top <= window.innerHeight / 2 &&
        rect.bottom >= window.innerHeight / 2
      ) {
        current = parent.id;
      }
    });

    lines.forEach((line) => {
      line.classList.toggle("active", line.dataset.target === current);
    });

    items.forEach((li) => {
      li.classList.toggle("active", li.dataset.target === current);
    });
  }

  window.addEventListener("scroll", updateActiveSection);

  // Integración con traducciones
  const originalLoadLanguage = window.loadLanguage;
  window.loadLanguage = async function (lang) {
    await originalLoadLanguage(lang);
    buildTOC();
    updateActiveSection();
  };

  // Construcción inicial
  loadLanguage(currentLang).then(() => {
    buildTOC();
    updateActiveSection();
  });
});

// --- SMOOTH SCROLL ---
document
  .getElementById("saltoDeSeccion")
  .addEventListener("click", function () {
    const target = document.getElementById("services-section");
    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 500;
    let start = null;

    function linear(t) {
      return t;
    }

    function animateScroll(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = linear(progress);
      window.scrollTo(0, startPosition + distance * ease);
      if (timeElapsed < duration) requestAnimationFrame(animateScroll);
    }

    requestAnimationFrame(animateScroll);
  });

// --- PROGRESS BUTTON ---
const progressBtn = document.getElementById("progressButton");
const progressCircle = document.querySelector(".progress-ring__circle");
const servicesSection = document.getElementById("services-section");
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;

window.addEventListener("scroll", () => {
  const sectionTop = servicesSection.offsetTop;
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = scrollY / docHeight;

  if (scrollY >= sectionTop) {
    progressBtn.classList.add("show");
  } else {
    progressBtn.classList.remove("show");
  }

  const offset = circumference - scrollProgress * circumference;
  progressCircle.style.strokeDashoffset = offset;
});

progressBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// --- OPEN MODALS ---
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // --- REEL MODAL ---
  const openReelBtn = document.getElementById("open-reel");
  const closeReelBtn = document.getElementById("close-modal-reel");
  const reelModal = document.getElementById("modal-reel");

  // Obtenemos una referencia al iframe del reproductor
  const iframe = reelModal.querySelector("iframe");
  // Creamos un nuevo objeto de reproductor de la API de Vimeo
  const player = new Vimeo.Player(iframe);

  openReelBtn?.addEventListener("click", () => {
    reelModal.classList.add("modal-show");
    body.classList.add("modal-open");
  });

  closeReelBtn?.addEventListener("click", () => {
    // Pausamos el video antes de cerrar el modal
    player.pause();
    reelModal.classList.remove("modal-show");
    setTimeout(() => body.classList.remove("modal-open"), 1000);
  });

  // --- PROJECTS MODAL ---
  const openProjectsBtn = document.getElementById("open-projects");
  const closeProjectsBtn = document.getElementById("close-projects-reel");
  const projectsModal = document.getElementById("modal-projects");

  openProjectsBtn?.addEventListener("click", () => {
    projectsModal.classList.add("modal-show");
    body.classList.add("modal-open");
  });

  closeProjectsBtn?.addEventListener("click", () => {
    projectsModal.classList.remove("modal-show");
    setTimeout(() => body.classList.remove("modal-open"), 1000);
  });
});
