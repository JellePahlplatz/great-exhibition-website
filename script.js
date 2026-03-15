const parallaxElements = Array.from(document.querySelectorAll("[data-parallax]"));
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
