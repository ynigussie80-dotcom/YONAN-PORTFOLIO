// Replace this address with the email address you want visitors to contact.
const contactEmail = "yonan3053@gmail.com";

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
const navigationLinks = [...document.querySelectorAll(".nav-link")];
const pageSections = [...document.querySelectorAll("main > section[id]")];
const homeSection = document.querySelector("#home");
const backTopLink = document.querySelector(".back-top");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const emailLinks = document.querySelectorAll("[data-contact-email], [data-email-cta]");
const animatedRole = document.querySelector(".typed-role");
const roleMessages = ["I'M YOHANNES NIGUSSIE", "I'M SOFTWARE ENGINEERING STUDENT"];
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let roleMessageIndex = 0;
let roleCharacterIndex = 0;
let isDeletingRole = false;
let roleTimer;

function animateRole() {
  if (!animatedRole || reducedMotionPreference.matches) return;

  const message = roleMessages[roleMessageIndex];
  roleCharacterIndex += isDeletingRole ? -1 : 1;
  animatedRole.textContent = message.slice(0, roleCharacterIndex);

  if (!isDeletingRole && roleCharacterIndex === message.length) {
    isDeletingRole = true;
    roleTimer = window.setTimeout(animateRole, 1300);
    return;
  }

  if (isDeletingRole && roleCharacterIndex === 0) {
    isDeletingRole = false;
    roleMessageIndex = (roleMessageIndex + 1) % roleMessages.length;
    roleTimer = window.setTimeout(animateRole, 280);
    return;
  }

  roleTimer = window.setTimeout(animateRole, isDeletingRole ? 35 : 75);
}

function updateRoleMotion() {
  if (!animatedRole) return;
  window.clearTimeout(roleTimer);
  roleMessageIndex = 0;
  isDeletingRole = false;

  if (reducedMotionPreference.matches) {
    roleCharacterIndex = roleMessages[0].length;
    animatedRole.textContent = roleMessages[0];
    return;
  }

  roleCharacterIndex = 0;
  animatedRole.textContent = "";
  animateRole();
}

if (animatedRole) {
  updateRoleMotion();
  reducedMotionPreference.addEventListener("change", updateRoleMotion);
}

emailLinks.forEach((link) => {
  link.href = `mailto:${contactEmail}`;
  if (link.hasAttribute("data-contact-email")) link.textContent = contactEmail;
});

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isExpanded));
  menuButton.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    const visibleSections = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (!visibleSections.length) return;
    const currentId = visibleSections[0].target.id;
    navigationLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("active", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-28% 0px -55% 0px", threshold: [0, 0.15, 0.4] });

  pageSections.forEach((section) => navObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

if (homeSection && backTopLink) {
  const setBackTopVisibility = (isVisible) => {
    backTopLink.classList.toggle("is-visible", isVisible);
    backTopLink.setAttribute("aria-hidden", String(!isVisible));
    backTopLink.tabIndex = isVisible ? 0 : -1;
  };

  if ("IntersectionObserver" in window) {
    const backTopObserver = new IntersectionObserver(([entry]) => {
      setBackTopVisibility(!entry.isIntersecting);
    }, { rootMargin: "-78px 0px 0px 0px", threshold: 0 });
    backTopObserver.observe(homeSection);
  } else {
    const updateBackTop = () => setBackTopVisibility(window.scrollY > homeSection.offsetHeight - 100);
    window.addEventListener("scroll", updateBackTop, { passive: true });
    updateBackTop();
  }
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const submitButton = contactForm.querySelector('[type="submit"]');
  const formPayload = Object.fromEntries(new FormData(contactForm).entries());
  submitButton.disabled = true;
  contactForm.setAttribute("aria-busy", "true");
  formStatus.textContent = "Sending your message…";

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formPayload),
    });
    const result = await response.json();
    if (!response.ok || result.success === false || result.success === "false") {
      throw new Error("Form submission failed");
    }

    contactForm.reset();
    formStatus.textContent = "Thanks! Your message has been sent. I’ll get back to you soon.";
  } catch {
    formStatus.textContent = `Your message could not be sent. Please email me at ${contactEmail}.`;
  } finally {
    submitButton.disabled = false;
    contactForm.removeAttribute("aria-busy");
  }
});
