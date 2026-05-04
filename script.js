/* ========================================
   DOCUMENT INITIALIZATION
   ======================================== */
document.addEventListener("DOMContentLoaded", async function () {
  // Initialize EmailJS
  emailjs.init("6Sb8PUAeMkMRJC_Gf");

  // Load reusable components
  await loadComponents();

  // Initialize navigation
  initializeNavigation();

  // Initialize accordions
  initializeAccordions();

  // Initialize contact form
  initializeContactForm();

  // Set active nav link
  setActiveNavLink();
});

/* ========================================
   LOAD REUSABLE COMPONENTS
   ======================================== */
async function loadComponents() {
  try {
    // Load navbar
    const navbarResponse = await fetch("components/navbar.html");
    const navbarHTML = await navbarResponse.text();
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      navbarContainer.innerHTML = navbarHTML;
    }

    // Load footer
    const footerResponse = await fetch("components/footer.html");
    const footerHTML = await footerResponse.text();
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
      footerContainer.innerHTML = footerHTML;
    }
  } catch (error) {
    console.error("Error loading components:", error);
  }
}

/* ========================================
   NAVIGATION - HAMBURGER MENU & DROPDOWN
   ======================================== */
function initializeNavigation() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link:not(.dropdown-toggle)");
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  // Hamburger menu toggle
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

  // Close menu when a non-dropdown link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");
    });
  });

  // Dropdown toggle for mobile
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdown = this.closest(".dropdown");
        dropdown.classList.toggle("active");
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnHamburger = hamburger && hamburger.contains(event.target);

    if (
      !isClickInsideNav &&
      !isClickOnHamburger &&
      navMenu.classList.contains("active")
    ) {
      navMenu.classList.remove("active");
    }
  });

  // Close dropdown menu items when clicked
  const dropdownMenuItems = document.querySelectorAll(".dropdown-menu a");
  dropdownMenuItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        const dropdown = this.closest(".dropdown");
        dropdown.classList.remove("active");
      }
    });
  });
}

/* ========================================
   SET ACTIVE NAVIGATION LINK
   ======================================== */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("nav a.nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* ========================================
   ACCORDION FUNCTIONALITY
   ======================================== */
function initializeAccordions() {
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");

    if (header) {
      header.addEventListener("click", function () {
        // Close all other accordion items (optional - for single open behavior)
        // accordionItems.forEach(otherItem => {
        //     if (otherItem !== item) {
        //         otherItem.classList.remove('active');
        //     }
        // });

        // Toggle current item
        item.classList.toggle("active");
      });
    }
  });

  // Open accordion item if URL has hash
  const hash = window.location.hash.substring(1);
  if (hash) {
    const targetItem = document.getElementById(hash);
    if (targetItem && targetItem.classList.contains("accordion-item")) {
      targetItem.classList.add("active");
    }
  }
}

/* ========================================
   CONTACT FORM HANDLING
   ======================================== */
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value.trim();

      // Validate form
      if (!validateContactForm(name, email, subject, message)) {
        showFormMessage(
          "Please fill in all required fields correctly.",
          "error",
        );
        return;
      }

      // Submit form
      submitContactForm(name, email, subject, message, contactForm);
    });
  }
}

/**
 * Validate contact form inputs
 */
function validateContactForm(name, email, subject, message) {
  // Validate name
  if (name.length < 2) {
    return false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  // Validate subject
  if (!subject) {
    return false;
  }

  // Validate message
  if (message.length < 10) {
    return false;
  }

  return true;
}

/**
 * Submit contact form with EmailJS
 */
function submitContactForm(name, email, subject, message, form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  // Disable button and show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  // Prepare email parameters
  const templateParams = {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message,
    to_email: "visionbridge.research@gmail.com",
  };

  // Send email through EmailJS
  emailjs.send("service_j6jrsu4", "template_k1ndy1b", templateParams).then(
    function (response) {
      // Log form data
      console.log("Contact Form Submitted:", {
        name: name,
        email: email,
        subject: subject,
        message: message,
        timestamp: new Date().toISOString(),
        emailjs_response: response,
      });

      // Show success message
      showFormMessage(
        "✅ Thank you! Your message has been sent successfully. We will get back to you within 24 hours.",
        "success",
      );

      // Reset form
      form.reset();

      // Restore button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Auto-hide message after 5 seconds
      setTimeout(function () {
        const messageDiv = document.getElementById("formMessage");
        if (messageDiv) {
          messageDiv.style.display = "none";
        }
      }, 5000);
    },
    function (error) {
      console.error("EmailJS Error:", error);

      // Show error message
      showFormMessage(
        "❌ Failed to send message. Please try again or email us directly at visionbridge.research@gmail.com",
        "error",
      );

      // Restore button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    },
  );
}
/**
 * Display form message
 */
function showFormMessage(message, type) {
  const messageDiv = document.getElementById("formMessage");

  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.style.display = "block";

    // Set styling based on type
    if (type === "success") {
      messageDiv.style.backgroundColor = "#d4edda";
      messageDiv.style.color = "#155724";
      messageDiv.style.border = "1px solid #c3e6cb";
    } else if (type === "error") {
      messageDiv.style.backgroundColor = "#f8d7da";
      messageDiv.style.color = "#721c24";
      messageDiv.style.border = "1px solid #f5c6cb";
    }

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

/* ========================================
   SMOOTH SCROLL BEHAVIOR
   ======================================== */
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Don't prevent default for dropdown toggles
      if (this.classList.contains("dropdown-toggle")) {
        return;
      }

      // Check if target exists
      if (href !== "#" && document.querySelector(href)) {
        e.preventDefault();

        const target = document.querySelector(href);
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

/* ========================================
   BUTTON INTERACTIONS
   ======================================== */
document.addEventListener("DOMContentLoaded", function () {
  // Add click handlers for action buttons
  const downloadButtons = document.querySelectorAll(
    'a[href="#"][class*="btn"]',
  );

  downloadButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Get context-specific message
      const card = this.closest(".card");
      if (card) {
        const title = card.querySelector("h3")?.textContent || "File";
        console.log("Download clicked:", title);

        // In production, this would trigger actual download
        // alert(`Downloading: ${title}\n\nThis is a demo. In production, this would download the file.`);
      }
    });
  });
});

/* ========================================
   RESPONSIVE BEHAVIOR
   ======================================== */
window.addEventListener("resize", function () {
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 768) {
    const navMenu = document.getElementById("navMenu");
    if (navMenu) {
      navMenu.classList.remove("active");
    }
  }
});

/* ========================================
   CONSOLE BRANDING
   ======================================== */
console.log(
  "%cResearch Hub - Professional Academic Portfolio",
  "font-size: 18px; color: #0052CC; font-weight: bold;",
);
console.log(
  "%cBuilt with semantic HTML5, CSS Grid/Flexbox, and vanilla JavaScript",
  "color: #0078FF; font-size: 12px;",
);
console.log(
  "%cNo external dependencies. Optimized for speed and accessibility.",
  "color: #0078FF; font-size: 12px;",
);
