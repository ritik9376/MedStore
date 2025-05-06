// Mobile menu toggle
const menuToggle = document.getElementById("menu-toggle")
const mainNav = document.getElementById("main-nav")

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("active")
})

// Cart functionality
let cartItems = []
let purchaseHistory = []

// DOM elements
const cartModal = document.getElementById("cart-modal")
const historyModal = document.getElementById("history-modal")
const cartIcon = document.getElementById("cart-icon")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotalAmount = document.getElementById("cart-total-amount")
const cartCountDisplay = document.getElementById("cart-count")
const checkoutBtn = document.getElementById("checkout-btn")
const continueShoppingBtn = document.getElementById("continue-shopping")
const purchaseHistoryContainer = document.getElementById("purchase-history")
const clearHistoryBtn = document.getElementById("clear-history-btn")

// Load cart items from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedCart = localStorage.getItem("cartItems")
  if (savedCart) {
    cartItems = JSON.parse(savedCart)
    updateCartCount()
  }

  const savedHistory = localStorage.getItem("purchaseHistory")
  if (savedHistory) {
    purchaseHistory = JSON.parse(savedHistory)
  }

  // Add "View Order History" link
  const loginSignup = document.querySelector(".login-signup")
  const historyLink = document.createElement("a")
  historyLink.href = "#"
  historyLink.innerHTML = ' | <i class="fas fa-history"></i> Orders'
  historyLink.addEventListener("click", (e) => {
    e.preventDefault()
    updatePurchaseHistoryDisplay()
    historyModal.style.display = "block"
  })
  loginSignup.appendChild(historyLink)
})

// Add to cart functionality
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    const product = this.parentElement
    const title = product.querySelector("h3").textContent
    const price = Number.parseFloat(this.getAttribute("data-price"))
    const image = product.querySelector("img").src

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex((item) => item.title === title)

    if (existingItemIndex !== -1) {
      // Item exists, increase quantity
      cartItems[existingItemIndex].quantity++
    } else {
      // Add new item to cart
      cartItems.push({
        title,
        price,
        image,
        quantity: 1,
      })
    }

    // Save cart to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems))

    // Update cart count
    updateCartCount()

    // Show notification
    showNotification(`${title} added to cart!`)
  })
})

// Show notification function
function showNotification(message) {
  const notification = document.createElement("div")
  notification.style.position = "fixed"
  notification.style.bottom = "20px"
  notification.style.right = "20px"
  notification.style.backgroundColor = "#1976d2"
  notification.style.color = "white"
  notification.style.padding = "10px 20px"
  notification.style.borderRadius = "4px"
  notification.style.zIndex = "1000"
  notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)"
  notification.textContent = message
  document.body.appendChild(notification)

  // Remove notification after 3 seconds
  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}

// Update cart count
function updateCartCount() {
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  cartCountDisplay.textContent = totalItems

  // Make the counter more visible when items are added
  if (totalItems > 0) {
    cartCountDisplay.style.display = "flex"
    // Optional: Add a brief animation effect
    cartCountDisplay.classList.add("pulse")
    setTimeout(() => {
      cartCountDisplay.classList.remove("pulse")
    }, 500)
  } else {
    cartCountDisplay.style.display = "flex" // Keep it visible but show 0
  }
}

// Open cart modal
cartIcon.addEventListener("click", (e) => {
  e.preventDefault()
  updateCartDisplay()
  cartModal.style.display = "block"
})

// Close modals when clicking on X
document.querySelectorAll(".close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    cartModal.style.display = "none"
    historyModal.style.display = "none"
  })
})

// Close modals when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none"
  }
  if (event.target === historyModal) {
    historyModal.style.display = "none"
  }
})

// Continue shopping button
continueShoppingBtn.addEventListener("click", () => {
  cartModal.style.display = "none"
})

// Update cart display
function updateCartDisplay() {
  cartItemsContainer.innerHTML = ""
  let total = 0

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>"
    cartTotalAmount.textContent = "₹0.00"
    return
  }

  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity
    total += itemTotal

    const cartItemElement = document.createElement("div")
    cartItemElement.className = "cart-item"
    cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <div class="cart-item-price">₹${item.price.toFixed(2)} × ${item.quantity}</div>
                <div class="item-total">₹${itemTotal.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn increase" data-index="${index}">+</button>
            </div>
            <button class="remove-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
        `

    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotalAmount.textContent = `₹${total.toFixed(2)}`

  // Add event listeners to quantity and remove buttons
  document.querySelectorAll(".quantity-btn.decrease").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = Number.parseInt(this.getAttribute("data-index"))
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
        updateCartDisplay()
        updateCartCount()
      }
    })
  })

  document.querySelectorAll(".quantity-btn.increase").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = Number.parseInt(this.getAttribute("data-index"))
      cartItems[index].quantity++
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
      updateCartDisplay()
      updateCartCount()
    })
  })

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = Number.parseInt(this.getAttribute("data-index"))
      cartItems.splice(index, 1)
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
      updateCartDisplay()
      updateCartCount()
    })
  })
}

// Checkout button
checkoutBtn.addEventListener("click", () => {
  if (cartItems.length === 0) {
    alert("Your cart is empty!")
    return
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const date = new Date().toLocaleDateString()

  // Add to purchase history
  purchaseHistory.push({
    items: [...cartItems],
    total,
    date,
    orderId: "ORD-" + Math.floor(Math.random() * 1000000),
  })

  // Save to localStorage
  localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory))

  // Clear cart
  cartItems = []
  localStorage.setItem("cartItems", JSON.stringify(cartItems))
  updateCartCount()

  // Show confirmation
  alert(`Thank you for your order! Your medicines will be delivered soon. Total: ₹${total.toFixed(2)}`)

  // Close cart modal
  cartModal.style.display = "none"

  // Show purchase history
  updatePurchaseHistoryDisplay()
  historyModal.style.display = "block"
})

// Update purchase history display
function updatePurchaseHistoryDisplay() {
  purchaseHistoryContainer.innerHTML = ""

  if (purchaseHistory.length === 0) {
    purchaseHistoryContainer.innerHTML = "<p>You have no order history.</p>"
    return
  }

  purchaseHistory.forEach((purchase, index) => {
    const purchaseElement = document.createElement("div")
    purchaseElement.className = "purchase-record"

    purchaseElement.innerHTML = `
            <h3>Order #${purchase.orderId} - ${purchase.date}</h3>
            <div class="purchase-items">
                ${purchase.items
                  .map(
                    (item) => `
                    <div class="purchase-item">
                        <img src="${item.image}" alt="${item.title}" style="width: 30px; height: 30px; object-fit: cover; margin-right: 5px;">
                        ${item.title} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}
                    </div>
                `,
                  )
                  .join("")}
            </div>
            <div class="purchase-total">
                <p><strong>Total: ₹${purchase.total.toFixed(2)}</strong></p>
            </div>
            <hr>
        `

    purchaseHistoryContainer.appendChild(purchaseElement)
  })
}

// Clear history button
clearHistoryBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear your order history?")) {
    purchaseHistory = []
    localStorage.removeItem("purchaseHistory")
    updatePurchaseHistoryDisplay()
  }
})

// Genre filtering
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const genre = this.getAttribute("data-genre")

    // Update active button
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
    this.classList.add("active")

    // Filter products
    const products = document.querySelectorAll(".product")
    products.forEach((product) => {
      if (genre === "all" || product.getAttribute("data-genre") === genre) {
        product.style.display = "block"
      } else {
        product.style.display = "none"
      }
    })
  })
})

// Search functionality
function searchProducts() {
  const input = document.querySelector(".search-bar")
  const products = document.querySelectorAll(".product")
  const searchQuery = input.value.toLowerCase()

  products.forEach((product) => {
    const productName = product.querySelector("h3").textContent.toLowerCase()
    const productDescription = product.querySelector("p").textContent.toLowerCase()

    if (productName.includes(searchQuery) || productDescription.includes(searchQuery)) {
      product.style.display = "block"
    } else {
      product.style.display = "none"
    }
  })
}

// Attach search functionality to the search bar
document.querySelector(".search-bar").addEventListener("input", searchProducts)

// Health package booking
document.querySelectorAll(".package-card .btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const packageName = this.closest(".package-card").querySelector("h3").textContent
    alert(
      `Thank you for booking the ${packageName}. Our health advisor will contact you shortly to schedule your appointment.`,
    )
  })
})

// Contact form submission
const contactForm = document.getElementById("contact-form")
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()
    alert("Thank you for your message. We will get back to you soon!")
    this.reset()
  })
}
