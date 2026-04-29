/* Incident Room — JS mínimo (editable si querés sumar/retirar efectos) */

const prefersReducedMotion = (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

function setupMobileNav() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector("#navMenu");
  if (!toggle || !menu) return;

  function setOpen(isOpen) {
    toggle.setAttribute("aria-expanded", String(isOpen));
    menu.classList.toggle("is-open", isOpen);
  }

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!expanded);
  });

  // Cerrar al navegar
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    setOpen(false);
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    setOpen(false);
  });

  // Cerrar si clickeas fuera
  document.addEventListener("click", (e) => {
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });
}

function setupRevealOnScroll() {
  const elements = Array.from(document.querySelectorAll(".reveal"));
  if (elements.length === 0) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    },
    { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
  );

  elements.forEach((el) => io.observe(el));
}

function setupSmoothAnchors() {
  // CSS scroll-behavior no es confiable cross-browser con reduced-motion;
  // aplicamos smooth solo si no hay preferencia de reducir movimiento.
  if (prefersReducedMotion) return;

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", href);
    });
  });
}

setupMobileNav();
setupRevealOnScroll();
setupSmoothAnchors();

// Scroll Progress Bar
function updateProgressBar() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById("scrollProgress").style.width = scrolled + "%";
}

window.addEventListener('scroll', updateProgressBar, { passive: true });
updateProgressBar();





// =========================================
// PREMIUM FEATURES (Spotlight effect)
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  const glassCards = document.querySelectorAll('.card--glass');
  
  glassCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    
    // Reset when mouse leaves so it doesn't stay stuck on the edge
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', `-500px`);
      card.style.setProperty('--mouse-y', `-500px`);
    });
  });
});


// =========================================
// TERMINAL TYPING EFFECT
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll('.bash-console__body > div');
  if (lines.length === 0) return;
  
  // Hide all lines initially
  lines.forEach(line => {
    line.style.display = 'none';
  });

  async function typeTerminal() {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      line.style.display = 'block';
      
      if (line.classList.contains('bash-line')) {
        const textElement = line.querySelector('.typing-text');
        if (textElement) {
          const fullText = textElement.textContent;
          textElement.textContent = '';
          textElement.style.borderRight = '8px solid var(--accent)';
          
          for (let j = 0; j < fullText.length; j++) {
            textElement.textContent += fullText[j];
            await new Promise(r => setTimeout(r, 40 + Math.random() * 60)); // Random typing speed
          }
          await new Promise(r => setTimeout(r, 300));
          textElement.style.borderRight = 'none';
        }
      } else {
        // Output line, wait a bit before showing to simulate command execution
        await new Promise(r => setTimeout(r, 300));
      }
    }
  }

  // Start typing immediately after a short delay
  // (Removed IntersectionObserver to ensure it always runs on mobile)
  setTimeout(typeTerminal, 600);
});
