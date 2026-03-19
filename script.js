const parallaxElements = Array.from(document.querySelectorAll("[data-parallax]"));
const showcaseCards = Array.from(document.querySelectorAll(".showcase-card"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateParallax() {
  if (prefersReducedMotion) {
    return;
  }

  const viewportHeight = window.innerHeight;

  for (const element of parallaxElements) {
    const rect = element.getBoundingClientRect();
    const speed = Number(element.dataset.speed || 0.12);
    const center = rect.top + rect.height / 2;
    const distanceFromCenter = center - viewportHeight / 2;
    const offset = distanceFromCenter * -speed;
    element.style.setProperty("--parallax-offset", `${offset.toFixed(1)}px`);
  }
}

let ticking = false;

function requestParallaxUpdate() {
  if (ticking) {
    return;
  }

  ticking = true;

  window.requestAnimationFrame(() => {
    updateParallax();
    ticking = false;
  });
}

window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
window.addEventListener("resize", requestParallaxUpdate);
window.addEventListener("load", requestParallaxUpdate);
requestParallaxUpdate();

if (prefersReducedMotion) {
  showcaseCards.forEach((card) => card.classList.add("is-visible"));
} else {
  const showcaseObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        entry.target.classList.add("is-visible");
        showcaseObserver.unobserve(entry.target);
      }
    },
    {
      threshold: 0.3,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  showcaseCards.forEach((card) => showcaseObserver.observe(card));
}
