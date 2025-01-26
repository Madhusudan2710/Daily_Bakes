document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed."); // Debug log

  const locationBox = document.getElementById("locationBox");
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popupText");
  const detectButton = document.getElementById("detectButton");

  if (!locationBox || !popup || !popupText || !detectButton) {
    console.error("One or more elements are missing!");
    return; // Exit script if elements are not found
  }

  console.log("All elements found. Adding event listeners.");

  locationBox.addEventListener("click", () => {
    // Show the popup
    popup.classList.remove("d-none");
  
    // Set popup position directly to top: 50px and left: 50px
    popup.style.top = "50px";
    popup.style.left = "50px";
    popup.style.opacity = "1"; // Ensure visibility
  });

  // Detect location and update textbox
  detectButton.addEventListener("click", () => {
    console.log("Detect location button clicked.");
    popupText.textContent = "Fetching your location...";
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("Geolocation successful.");
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const address = data.display_name || "Unable to determine address.";
            if (!locationBox.value || locationBox.value === "Fetching your location...") {
              locationBox.value = address;
            }
          } catch (error) {
            console.error("Error fetching address:", error);
            if (!locationBox.value || locationBox.value === "Fetching your location...") {
              locationBox.value = "Error fetching address.";
            }
          } finally {
            popup.classList.add("d-none");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          if (error.code === error.PERMISSION_DENIED) {
            alert("You denied location access. Please allow it or type the location manually.");
          } else {
            alert("Error detecting location: " + error.message);
          }
          popup.classList.add("d-none");
        }
      );
    } else {
      console.warn("Geolocation not supported.");
      alert("Geolocation is not supported by your browser.");
    }
  });
  
  // Allow manual editing of location
  locationBox.addEventListener("input", () => {
    console.log("Location manually edited:", locationBox.value);
  });

  // Close popup if clicked outside
  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && e.target !== locationBox) {
      popup.classList.add("d-none");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {

  // Carousel Logic
  document.querySelectorAll(".carousel-box").forEach((carousel) => {
    const carouselTrack = carousel.querySelector(".carousel-track");
    const prevButton = carousel.querySelector(".prev-button");
    const nextButton = carousel.querySelector(".next-button");
    const elements = carousel.querySelectorAll(".carousel-element");

    let itemsPerPage = 3;
    let currentIndex = 0;
    const totalItems = elements.length;

    const updateCarousel = () => {
      const itemWidth = elements[0].offsetWidth;
      carouselTrack.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    };

    const updateItemsPerPage = () => {
      itemsPerPage = window.innerWidth <= 768 ? 1 : 3;
      currentIndex = Math.min(currentIndex, totalItems - itemsPerPage);
      updateCarousel();
    };

    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
    });

    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      updateCarousel();
    });

    window.addEventListener("resize", updateItemsPerPage);
    updateItemsPerPage();
  });

  // Cart Action
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => handleCartAction(button));
  });

// Define the function globally to ensure it is accessible
window.handleCartAction = (button) => {
  const card = button.closest(".card");
  const footer = card.querySelector(".card-footer");

  // Create the controls container
  const controlsDiv = document.createElement("div");
  controlsDiv.className = "cart-controls d-flex justify-content-center my-3";

  // Apply yellow background to the container
  controlsDiv.style.backgroundColor = "orange";
  controlsDiv.style.padding = "0.5rem";

  // Create decrement button
  const decrementButton = document.createElement("button");
  decrementButton.className = "btn btn-sm mx-2";
  decrementButton.textContent = "-";
  decrementButton.style.backgroundColor = "white"; // White background
  decrementButton.style.color = "black"; // Black text
  decrementButton.style.border = "1px solid #ccc";
  decrementButton.style.borderRadius = "50%";
  decrementButton.style.width = "30px";
  decrementButton.style.height = "30px";

  // Create quantity display
  const quantityDisplay = document.createElement("span");
  quantityDisplay.className = "quantity-display mx-2";
  quantityDisplay.textContent = "1";
  quantityDisplay.style.color = "black"; // Black text
  quantityDisplay.style.fontWeight = "bold";
  quantityDisplay.style.fontSize = "1.2rem";

  // Create increment button
  const incrementButton = document.createElement("button");
  incrementButton.className = "btn btn-sm mx-2";
  incrementButton.textContent = "+";
  incrementButton.style.backgroundColor = "white"; // White background
  incrementButton.style.color = "black"; // Black text
  incrementButton.style.border = "1px solid #ccc";
  incrementButton.style.borderRadius = "50%";
  incrementButton.style.width = "30px";
  incrementButton.style.height = "30px";

  // Append buttons to controlsDiv
  controlsDiv.append(decrementButton, quantityDisplay, incrementButton);

  // Replace the button with controlsDiv
  footer.replaceChild(controlsDiv, button);

  let quantity = 1;

  // Add click event for increment button
  incrementButton.addEventListener("click", () => {
    quantity++;
    quantityDisplay.textContent = quantity;
  });

  // Add click event for decrement button
  decrementButton.addEventListener("click", () => {
    while (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
      return; // Exit loop after decrementing
    }

    // If quantity is 1, restore the original button
    footer.replaceChild(button, controlsDiv);
  });
};

// Add event listener for all "Add to cart" buttons
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".cart-button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => handleCartAction(button));
  });
});


  // Form Validation
  const forms = document.querySelectorAll(".needs-validation");
  forms.forEach((form) =>
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    })
  );

  // Heart Icon Toggle
  document.querySelectorAll(".heart-icon").forEach((heartIcon) => {
    heartIcon.addEventListener("click", () => {
      const isRed = heartIcon.src.includes("heart_red.png");
      heartIcon.src = `./Images/${isRed ? "heart.png" : "heart_red.png"}`;
    });
  });

  // Toggle Extra Items
  const showMoreBtn = document.getElementById("show-more-btn");
  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", () => {
      const extraItems = document.querySelector(".extra-items");
      const isVisible = extraItems.style.display === "block";
      extraItems.style.display = isVisible ? "none" : "block";
      showMoreBtn.textContent = isVisible ? "View More" : "View Less";
    });
  }
});

const testimonials = document.querySelectorAll('.testimonial');
let currentTestimonial = 0;

// Function to update arrow based on screen width
function updateArrows() {
  const width = window.innerWidth;
  const upArrows = document.querySelectorAll('.up-arrow');
  const downArrows = document.querySelectorAll('.down-arrow');
  const leftArrows = document.querySelectorAll('.left-arrow');
  const rightArrows = document.querySelectorAll('.right-arrow');

  if (width < 992) {
    upArrows.forEach(button => button.style.display = 'none');
    downArrows.forEach(button => button.style.display = 'none');
    leftArrows.forEach(button => button.style.display = 'inline-block');
    rightArrows.forEach(button => button.style.display = 'inline-block');
  } else {
    upArrows.forEach(button => button.style.display = 'inline-block');
    downArrows.forEach(button => button.style.display = 'inline-block');
    leftArrows.forEach(button => button.style.display = 'none');
    rightArrows.forEach(button => button.style.display = 'none');
  }
}

// Initial check for screen size
updateArrows();

// Update on window resize
window.addEventListener('resize', updateArrows);

// Navigation for testimonials
document.querySelectorAll('.up-arrow').forEach(button => {
  button.addEventListener('click', () => {
    testimonials[currentTestimonial].classList.add('d-none');
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    testimonials[currentTestimonial].classList.remove('d-none');
  });
});

document.querySelectorAll('.down-arrow').forEach(button => {
  button.addEventListener('click', () => {
    testimonials[currentTestimonial].classList.add('d-none');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].classList.remove('d-none');
  });
});

document.querySelectorAll('.left-arrow').forEach(button => {
  button.addEventListener('click', () => {
    testimonials[currentTestimonial].classList.add('d-none');
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    testimonials[currentTestimonial].classList.remove('d-none');
  });
});

document.querySelectorAll('.right-arrow').forEach(button => {
  button.addEventListener('click', () => {
    testimonials[currentTestimonial].classList.add('d-none');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].classList.remove('d-none');
  });
});

const goToTopButton = document.getElementById("goToTop");
let lastScrollPosition = 0;

// Show or hide the button based on scroll direction
window.addEventListener("scroll", () => {
    const currentScrollPosition = window.pageYOffset;

    if (currentScrollPosition > 100 && currentScrollPosition < lastScrollPosition) {
        goToTopButton.classList.remove("d-none");
        goToTopButton.classList.add("show");
    } else {
        goToTopButton.classList.add("d-none");
        goToTopButton.classList.remove("show");
    }

    lastScrollPosition = currentScrollPosition;
});

// Smooth scroll to top when clicked
goToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});
