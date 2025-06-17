// Main JavaScript for Masjid X Website

// Smooth scrolling for anchor links
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    setTimeout(() => {
      if (alert && alert.parentNode) {
        alert.style.opacity = "0";
        alert.style.transform = "translateY(-20px)";
        setTimeout(() => {
          alert.remove();
        }, 300);
      }
    }, 5000);
  });

  // Add loading animation to cards
  const cards = document.querySelectorAll(".card");
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.6s ease-out";
    cardObserver.observe(card);
  });

  // Enhanced form validation
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      const inputs = form.querySelectorAll(
        "input[required], select[required], textarea[required]"
      );
      let isValid = true;

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add("is-invalid");

          // Remove invalid class after user starts typing
          input.addEventListener(
            "input",
            function () {
              this.classList.remove("is-invalid");
            },
            { once: true }
          );
        } else {
          input.classList.remove("is-invalid");
          input.classList.add("is-valid");
        }
      });

      if (!isValid) {
        e.preventDefault();
        showNotification(
          "Mohon lengkapi semua field yang wajib diisi.",
          "error"
        );
      }
    });
  });

  // Date validation for kajian forms
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach((input) => {
    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0];
    input.setAttribute("min", today);

    input.addEventListener("change", function () {
      const selectedDate = new Date(this.value);
      const currentDate = new Date();

      if (selectedDate < currentDate) {
        this.setCustomValidity("Tanggal tidak boleh kurang dari hari ini");
        this.reportValidity();
      } else {
        this.setCustomValidity("");
      }
    });
  });

  // Time validation
  const timeInputs = document.querySelectorAll('input[type="time"]');
  timeInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const timeValue = this.value;
      if (timeValue) {
        const [hours, minutes] = timeValue.split(":");
        const selectedTime = parseInt(hours) * 60 + parseInt(minutes);

        // Check if time is within reasonable mosque hours (4:00 - 22:00)
        if (selectedTime < 240 || selectedTime > 1320) {
          showNotification(
            "Waktu kajian sebaiknya antara 04:00 - 22:00",
            "warning"
          );
        }
      }
    });
  });

  // Search functionality enhancement
  const searchInputs = document.querySelectorAll('input[name="search"]');
  searchInputs.forEach((input) => {
    let timeout;
    input.addEventListener("input", function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (this.value.length >= 3 || this.value.length === 0) {
          // Auto-submit search after user stops typing for 500ms
          // this.form.submit();
        }
      }, 500);
    });
  });

  // Dropdown menu enhancements
  const dropdownButtons = document.querySelectorAll(
    '[data-bs-toggle="dropdown"]'
  );
  dropdownButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });

  // Auto-refresh for admin dashboard (every 5 minutes)
  if (window.location.pathname.includes("/admin")) {
    setInterval(() => {
      // Only refresh if user is still active (has moved mouse recently)
      if (
        document.lastActivity &&
        Date.now() - document.lastActivity < 300000
      ) {
        location.reload();
      }
    }, 300000); // 5 minutes
  }

  // Track user activity
  document.addEventListener("mousemove", () => {
    document.lastActivity = Date.now();
  });

  // Mobile menu enhancements
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler && navbarCollapse) {
    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !navbarToggler.contains(e.target) &&
        !navbarCollapse.contains(e.target)
      ) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse && navbarCollapse.classList.contains("show")) {
          bsCollapse.hide();
        }
      }
    });

    // Close mobile menu when clicking on nav links
    const navLinks = navbarCollapse.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse && navbarCollapse.classList.contains("show")) {
          bsCollapse.hide();
        }
      });
    });
  }

  // Initialize tooltips if Bootstrap is loaded
  if (typeof bootstrap !== "undefined") {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Add smooth transitions for mobile menu
  const navbarCollapseElement = document.querySelector(".navbar-collapse");
  if (navbarCollapseElement) {
    navbarCollapseElement.addEventListener("show.bs.collapse", function () {
      this.style.transition = "height 0.3s ease";
    });

    navbarCollapseElement.addEventListener("hide.bs.collapse", function () {
      this.style.transition = "height 0.3s ease";
    });
  }

  // Initialize delete functionality when DOM is loaded
  initializeDeleteFunctionality();
});

// FIXED: Enhanced delete modal functionality - moved outside DOMContentLoaded
function showDeleteModal(kajianId, kajianTitle, kajianUstaz) {
  console.log(
    "showDeleteModal called with:",
    kajianId,
    kajianTitle,
    kajianUstaz
  );

  // Wait for modal elements to be available
  setTimeout(() => {
    const modal = document.getElementById("deleteModal");
    const titleElement = document.getElementById("deleteKajianTitle");
    const ustazElement = document.getElementById("deleteKajianUstaz");
    const confirmBtn = document.getElementById("confirmDeleteBtn");

    if (modal && titleElement && ustazElement && confirmBtn) {
      // Clean and set text content
      titleElement.textContent = kajianTitle || "Kajian";
      ustazElement.textContent = "oleh " + (kajianUstaz || "Unknown");
      confirmBtn.href = "/admin/kajian/delete/" + kajianId;

      // Show modal using Bootstrap
      try {
        const deleteModal = new bootstrap.Modal(modal);
        deleteModal.show();
      } catch (error) {
        console.error("Bootstrap modal error:", error);
        // Fallback to simple confirm dialog
        if (
          confirm(
            `Apakah Anda yakin ingin menghapus kajian "${kajianTitle}" oleh ${kajianUstaz}?`
          )
        ) {
          window.location.href = "/admin/kajian/delete/" + kajianId;
        }
      }
    } else {
      console.error("Modal elements not found:", {
        modal: !!modal,
        titleElement: !!titleElement,
        ustazElement: !!ustazElement,
        confirmBtn: !!confirmBtn,
      });

      // Fallback to simple confirm dialog
      if (
        confirm(
          `Apakah Anda yakin ingin menghapus kajian "${kajianTitle}" oleh ${kajianUstaz}?`
        )
      ) {
        window.location.href = "/admin/kajian/delete/" + kajianId;
      }
    }
  }, 100); // Small delay to ensure elements are rendered
}

// FIXED: Initialize delete functionality
function initializeDeleteFunctionality() {
  // Add event listeners to all delete buttons
  const deleteButtons = document.querySelectorAll(
    '[onclick*="showDeleteModal"]'
  );

  deleteButtons.forEach((button) => {
    // Remove existing onclick attribute and add proper event listener
    const onclickAttr = button.getAttribute("onclick");
    if (onclickAttr) {
      // Extract parameters from onclick attribute
      const match = onclickAttr.match(
        /showDeleteModal\((\d+),\s*'([^']*)',\s*'([^']*)'\)/
      );
      if (match) {
        const kajianId = match[1];
        const kajianTitle = match[2].replace(/\\'/g, "'"); // Unescape quotes
        const kajianUstaz = match[3].replace(/\\'/g, "'"); // Unescape quotes

        // Remove onclick attribute
        button.removeAttribute("onclick");

        // Add proper event listener
        button.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          showDeleteModal(kajianId, kajianTitle, kajianUstaz);
        });
      }
    }
  });

  // Also handle dynamically added delete buttons
  document.addEventListener("click", function (e) {
    if (
      e.target.matches('[onclick*="showDeleteModal"]') ||
      e.target.closest('[onclick*="showDeleteModal"]')
    ) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.target.matches('[onclick*="showDeleteModal"]')
        ? e.target
        : e.target.closest('[onclick*="showDeleteModal"]');

      const onclickAttr = button.getAttribute("onclick");
      if (onclickAttr) {
        const match = onclickAttr.match(
          /showDeleteModal\((\d+),\s*'([^']*)',\s*'([^']*)'\)/
        );
        if (match) {
          const kajianId = match[1];
          const kajianTitle = match[2].replace(/\\'/g, "'");
          const kajianUstaz = match[3].replace(/\\'/g, "'");
          showDeleteModal(kajianId, kajianTitle, kajianUstaz);
        }
      }
    }
  });
}

// Utility function to show notifications
function showNotification(message, type = "info") {
  const alertClass =
    type === "error"
      ? "alert-danger"
      : type === "warning"
      ? "alert-warning"
      : type === "success"
      ? "alert-success"
      : "alert-info";

  const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

  // Insert at the top of the page
  const container = document.querySelector(".container");
  if (container) {
    container.insertAdjacentHTML("afterbegin", alertHtml);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      const alert = container.querySelector(".alert");
      if (alert) {
        alert.remove();
      }
    }, 5000);
  }
}

// Keyboard shortcuts for admin
document.addEventListener("keydown", function (e) {
  // Only on admin pages
  if (!window.location.pathname.includes("/admin")) return;

  // Ctrl/Cmd + N to add new kajian
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    const addButton = document.querySelector('a[href*="add"]');
    if (addButton) {
      addButton.click();
    }
  }

  // Escape to go back
  if (e.key === "Escape") {
    const backButton = document.querySelector('a[href*="admin"]');
    if (backButton && !window.location.pathname.endsWith("/admin")) {
      backButton.click();
    }
  }
});

// Print functionality for kajian list
function printKajianList() {
  const printContent = document.querySelector(".container").innerHTML;
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
        <html>
            <head>
                <title>Daftar Kajian - Masjid X</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .card { border: 1px solid #ddd; margin: 10px 0; padding: 15px; }
                    .btn, .dropdown { display: none; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <h1>Daftar Kajian Masjid X</h1>
                ${printContent}
            </body>
        </html>
    `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

// Enhanced card animations
function animateCards() {
  const cards = document.querySelectorAll(".card-hover");
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add("animate__animated", "animate__fadeInUp");
  });
}

// Call animation on page load
document.addEventListener("DOMContentLoaded", animateCards);

// Responsive image loading
function optimizeImages() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("load", function () {
      this.style.opacity = "1";
    });

    img.addEventListener("error", function () {
      this.src =
        "https://via.placeholder.com/400x300/1e40af/ffffff?text=Masjid+X";
    });
  });
}

document.addEventListener("DOMContentLoaded", optimizeImages);

// ADDITIONAL: Make showDeleteModal globally available for inline onclick handlers
window.showDeleteModal = showDeleteModal;
