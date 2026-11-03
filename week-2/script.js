const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    return;
  }

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const eventType = formData.get("eventType");
  const date = formData.get("date") || "Not decided yet";
  const message = formData.get("message").trim();

  const subject = encodeURIComponent(`Event enquiry from ${name} — ${eventType}`);
  const body = encodeURIComponent(
    `Hello Aster & Ivy,\n\nName: ${name}\nEmail: ${email}\nEvent type: ${eventType}\nIdeal date: ${date}\n\nDetails:\n${message}\n\nSent from the Aster & Ivy portfolio website.`
  );

  formStatus.textContent = "Your email app should open with the enquiry prepared. This demo does not send or store information itself.";
  window.location.href = `mailto:hello@asterandivy.example?subject=${subject}&body=${body}`;
});
