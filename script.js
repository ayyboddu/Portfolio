const sections = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".navbar a");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  {
    threshold: 0.6
  }
);

sections.forEach(section => observer.observe(section));

// ---- Projects carousel (moves by 1 card per click) ----
(() => {
  const wrap = document.querySelector(".projects-wrap");
  if (!wrap) return;

  const viewport = wrap.querySelector(".projects-viewport");
  const track = wrap.querySelector(".projects-track");
  const btnPrev = wrap.querySelector(".projects-arrow.left");
  const btnNext = wrap.querySelector(".projects-arrow.right");

  if (!viewport || !track || !btnPrev || !btnNext) return;

  let index = 0; // how many "steps" from the start (each step = 1 card)
  let stepPx = 0;
  let visibleCount = 1;
  let maxIndex = 0;

  const px = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  function measure() {
    const cards = track.querySelectorAll(".project-card");
    if (!cards.length) return;

    const first = cards[0];

    // Card width
    const cardW = first.getBoundingClientRect().width;

    // Flex gap (modern browsers)
    const cs = getComputedStyle(track);
    const gap = px(cs.columnGap || cs.gap || "0");

    stepPx = cardW + gap;

    // How many cards fit in the visible area
    const vw = viewport.getBoundingClientRect().width;
    visibleCount = Math.max(1, Math.floor((vw + gap) / stepPx));

    // Last index so we don't scroll past the end
    maxIndex = Math.max(0, cards.length - visibleCount);

    // Clamp current index if screen resized
    index = Math.min(Math.max(0, index), maxIndex);
  }

  function update() {
    track.style.transform = `translateX(${-index * stepPx}px)`;

    // Hide/show arrows
    const atStart = index === 0;
    const atEnd = index === maxIndex;

    btnPrev.hidden = atStart;
    btnNext.hidden = atEnd;

    btnPrev.setAttribute("aria-disabled", String(atStart));
    btnNext.setAttribute("aria-disabled", String(atEnd));
  }

  function go(delta) {
    measure();
    index = Math.min(maxIndex, Math.max(0, index + delta));
    update();
  }

  // Click handlers
  btnPrev.addEventListener("click", () => go(-1));
  btnNext.addEventListener("click", () => go(1));

  // Optional: keyboard support when focused anywhere in projects section
  wrap.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  // Recalc on resize
  window.addEventListener("resize", () => {
    measure();
    update();
  });

  // Init
  measure();
  update();
})();
