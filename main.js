document.addEventListener("DOMContentLoaded", function () {
  const elements = {
    menuBtn: document.querySelector(".menu-btn"),
    closeBtn: document.querySelector(".close-btn"),
    nav: document.querySelector(".nav"),
    cartBtn: document.querySelector(".cart-btn"),
    cartModal: document.querySelector(".cart-modal"),
    cartCount: document.querySelector(".cart-count"),
    minusBtn: document.querySelector(".minus"),
    plusBtn: document.querySelector(".plus"),
    quantityDisplay: document.querySelector(".quantity"),
    addToCartBtn: document.querySelector(".add-to-cart"),
    cartContent: document.querySelector(".cart-content"),
    emptyCartMsg: document.querySelector(".empty-cart"),
    mainImages: document.querySelectorAll(".main-image"),
    thumbnailBtns: document.querySelectorAll(".thumbnail-btn"),
    prevBtn: document.querySelector(".prev-btn"),
    nextBtn: document.querySelector(".next-btn"),
  };

  let currentIndex = 0;
  let quantity = 0;

  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);

  const lightbox = createLightbox();
  document.body.appendChild(lightbox);

  function createLightbox() {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close">
          <img src="images/icon-close.svg" alt="Close lightbox">
        </button>
        <div class="lightbox-main-image-container">
          <button class="lightbox-prev">
            <img src="images/icon-previous.svg" alt="Previous">
          </button>
          <img src="" alt="" class="lightbox-main-image">
          <button class="lightbox-next">
            <img src="images/icon-next.svg" alt="Next">
          </button>
        </div>
        <div class="lightbox-thumbnails">
          ${Array.from(elements.mainImages)
            .map(
              (_, i) => `
            <button class="lightbox-thumbnail-btn" data-index="${i}">
              <img src="images/image-product-${
                i + 1
              }-thumbnail.jpg" alt="Thumbnail ${i + 1}">
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
    return lb;
  }

  function toggleElement(element, className, displayValue) {
    if (className) element.classList.toggle(className);
    if (displayValue)
      element.style.display =
        element.style.display === displayValue ? "none" : displayValue;
  }

  function updateGallery(index) {
    currentIndex = index;
    elements.mainImages.forEach((img) => img.classList.remove("active"));
    elements.mainImages[currentIndex].classList.add("active");
    elements.thumbnailBtns.forEach((thumb) => thumb.classList.remove("active"));
    elements.thumbnailBtns[currentIndex].classList.add("active");
  }

  function updateLightbox(index) {
    const lightboxImg = lightbox.querySelector(".lightbox-main-image");
    lightboxImg.src = elements.mainImages[index].src;
    lightboxImg.alt = elements.mainImages[index].alt;
    const lightboxThumbs = lightbox.querySelectorAll(".lightbox-thumbnail-btn");
    lightboxThumbs.forEach((thumb) => thumb.classList.remove("active"));
    lightboxThumbs[index].classList.add("active");
  }

  function handleAddToCart() {
    if (quantity === 0) return;

    elements.cartCount.textContent = quantity;
    elements.cartCount.style.display = "inline-block";

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <div class="cart-item__info">
        <div class="cart-item__image">
          <img src="images/image-product-1-thumbnail.jpg" alt="Product thumbnail">
        </div>
        <div class="cart-item__details">
          <p>Fall Limited Edition Sneakers</p>
          <p>$125.00 x ${quantity} <strong>$${(125 * quantity).toFixed(
      2
    )}</strong></p>
        </div>
        <button class="delete-btn">
          <img src="images/icon-delete.svg" alt="Delete">
        </button>
      </div>
    `;

    const checkoutBtn = document.createElement("button");
    checkoutBtn.classList.add("checkout-btn");
    checkoutBtn.textContent = "Checkout";

    elements.cartContent.innerHTML = "";
    elements.cartContent.appendChild(cartItem);
    elements.cartContent.appendChild(checkoutBtn);
    elements.emptyCartMsg.style.display = "none";

    quantity = 0;
    elements.quantityDisplay.textContent = quantity;

    cartItem
      .querySelector(".delete-btn")
      .addEventListener("click", function () {
        elements.cartContent.innerHTML = "";
        elements.cartContent.appendChild(elements.emptyCartMsg);
        elements.emptyCartMsg.style.display = "block";
        elements.cartCount.style.display = "none";
      });
  }

  elements.menuBtn.addEventListener("click", () => {
    elements.nav.classList.add("active");
    overlay.style.display = "block";
  });

  elements.closeBtn.addEventListener("click", () => {
    elements.nav.classList.remove("active");
    overlay.style.display = "none";
  });

  overlay.addEventListener("click", () => {
    elements.nav.classList.remove("active");
    overlay.style.display = "none";
    elements.cartModal.style.display = "none";
    lightbox.style.display = "none";
  });

  elements.cartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleElement(elements.cartModal, null, "block");
  });

  elements.minusBtn.addEventListener("click", () => {
    if (quantity > 0) {
      quantity--;
      elements.quantityDisplay.textContent = quantity;
    }
  });

  elements.plusBtn.addEventListener("click", () => {
    quantity++;
    elements.quantityDisplay.textContent = quantity;
  });

  elements.addToCartBtn.addEventListener("click", handleAddToCart);

  elements.thumbnailBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      updateGallery(parseInt(btn.getAttribute("data-index")));
    });
  });

  elements.prevBtn.addEventListener("click", () => {
    currentIndex =
      (currentIndex - 1 + elements.mainImages.length) %
      elements.mainImages.length;
    updateGallery(currentIndex);
  });

  elements.nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % elements.mainImages.length;
    updateGallery(currentIndex);
  });

  elements.mainImages.forEach((img, index) => {
    img.addEventListener("click", () => {
      if (window.innerWidth >= 768) {
        lightbox.style.display = "flex";
        updateLightbox(currentIndex);
      }
    });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => {
    currentIndex =
      (currentIndex - 1 + elements.mainImages.length) %
      elements.mainImages.length;
    updateLightbox(currentIndex);
    updateGallery(currentIndex);
  });

  lightbox.querySelector(".lightbox-next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % elements.mainImages.length;
    updateLightbox(currentIndex);
    updateGallery(currentIndex);
  });

  lightbox.querySelectorAll(".lightbox-thumbnail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentIndex = parseInt(btn.getAttribute("data-index"));
      updateLightbox(currentIndex);
      updateGallery(currentIndex);
    });
  });
});
