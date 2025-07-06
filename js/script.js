// Toggle class active untuk hamburger menu
const navbarNav = document.querySelector('.navbar-nav');
// ketika hamburger menu di klik
document.querySelector('#hamburger-menu').onclick = () => {
  navbarNav.classList.toggle('active');
};

// Toggle class active untuk search form
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');

document.querySelector('#search-button').onclick = (e) => {
  searchForm.classList.toggle('active');
  searchBox.focus();
  e.preventDefault();
};

// Toggle class active untuk shopping cart
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
  shoppingCart.classList.toggle('active');
  e.preventDefault();
};

// Klik di luar elemen
const hm = document.querySelector('#hamburger-menu');
const sb = document.querySelector('#search-button');
const sc = document.querySelector('#shopping-cart-button');

document.addEventListener('click', function (e) {
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove('active');
  }

  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove('active');
  }

  if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove('active');
  }
});

// Modal Box
const itemDetailModal = document.querySelector('#item-detail-modal');
const itemDetailButtons = document.querySelectorAll('.item-detail-button');

itemDetailButtons.forEach((btn) => {
  btn.onclick = (e) => {
    itemDetailModal.style.display = 'flex';
    e.preventDefault();
  };
});

// klik tombol close modal
document.querySelector('.modal .close-icon').onclick = (e) => {
  itemDetailModal.style.display = 'none';
  e.preventDefault();
};

// klik di luar modal
window.onclick = (e) => {
  if (e.target === itemDetailModal) {
    itemDetailModal.style.display = 'none';
  }
};

// Fungsi untuk menampilkan detail produk dari keranjang
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('item-detail-modal');
    const modalImage = modal.querySelector('img');
    const modalTitle = modal.querySelector('h3');
    const modalDescription = modal.querySelector('p');
    const modalPrice = modal.querySelector('.product-price');

    // Add click event to all cart item images
    const cartImages = document.querySelectorAll('.cart-item-image');
    
    cartImages.forEach(img => {
        img.addEventListener('click', function() {
            // Get product data from data attributes
            const productName = this.getAttribute('data-product-name');
            const productPrice = this.getAttribute('data-product-price');
            const productDescription = this.getAttribute('data-product-description');
            const productImage = this.getAttribute('data-product-image');

            // Update modal content
            modalTitle.textContent = productName;
            modalDescription.textContent = productDescription;
            modalPrice.innerHTML = `${productPrice} <span>IDR 55K</span>`;
            modalImage.src = productImage;
            modalImage.alt = productName;

            // Show modal
            modal.style.display = 'flex';
            
            // Re-initialize feather icons for modal
            feather.replace();
        });
    });
});

// ==================== ADD TO CART FUNCTIONALITY ====================

// Array untuk menyimpan data keranjang
let cartItems = [];

// Fungsi untuk menambahkan item ke keranjang
function addToCart(productData) {
    // Cek apakah item sudah ada di keranjang
    const existingItem = cartItems.find(item => item.name === productData.name);
    
    if (existingItem) {
        // Jika sudah ada, tambah quantity
        existingItem.quantity += 1;
    } else {
        // Jika belum ada, tambah item baru
        cartItems.push({
            id: Date.now(), // ID unik berdasarkan timestamp
            name: productData.name,
            price: productData.price,
            priceNumber: productData.priceNumber,
            image: productData.image,
            description: productData.description,
            quantity: 1
        });
    }
    
    // Update tampilan keranjang
    updateCartDisplay();
    
    // Show notification
    showNotification(`${productData.name} berhasil ditambahkan ke keranjang!`);
}

// Fungsi untuk mengupdate tampilan keranjang
function updateCartDisplay() {
    const cartContainer = document.querySelector('.shopping-cart');
    const cartButton = document.getElementById('shopping-cart-button');
    
    // Clear current cart items
    cartContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Keranjang kosong</p>';
        cartButton.innerHTML = '<i data-feather="shopping-cart"></i>';
    } else {
        // Render cart items
        cartItems.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" 
                         class="cart-item-image"
                         data-product-name="${item.name}"
                         data-product-price="${item.price}"
                         data-product-description="${item.description}"
                         data-product-image="${item.image}" />
                    <div class="item-detail">
                        <h3>${item.name}</h3>
                        <div class="item-price">${item.price}</div>
                        <div class="item-quantity">
                            <button class="qty-btn minus" data-id="${item.id}">-</button>
                            <span class="qty">${item.quantity}</span>
                            <button class="qty-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <i data-feather="trash-2" class="remove-item" data-id="${item.id}"></i>
                </div>
            `;
            cartContainer.innerHTML += cartItemHTML;
        });
        
        // Add cart total
        const total = calculateTotal();
        cartContainer.innerHTML += `
            <div class="cart-total">
                <div class="total-items">Total: ${getTotalItems()} item(s)</div>
                <div class="total-price">IDR ${total}K</div>
            </div>
        `;
        
        // Update cart button badge
        const totalItems = getTotalItems();
        cartButton.innerHTML = `<i data-feather="shopping-cart"></i><span class="cart-badge">${totalItems}</span>`;
    }
    
    // Re-initialize feather icons
    feather.replace();
    
    // Re-attach event listeners
    attachCartEventListeners();
}

// Fungsi untuk menghitung total harga
function calculateTotal() {
    return cartItems.reduce((total, item) => {
        return total + (item.priceNumber * item.quantity);
    }, 0);
}

// Fungsi untuk menghitung total item
function getTotalItems() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(itemId) {
    cartItems = cartItems.filter(item => item.id !== parseInt(itemId));
    updateCartDisplay();
    showNotification('Item berhasil dihapus dari keranjang!');
}

// Fungsi untuk mengubah quantity
function updateQuantity(itemId, change) {
    const item = cartItems.find(item => item.id === parseInt(itemId));
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartDisplay();
        }
    }
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i data-feather="check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Initialize feather icons
    feather.replace();
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Fungsi untuk attach event listeners ke keranjang
function attachCartEventListeners() {
    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
                removeFromCart(itemId);
            }
        });
    });
    
    // Quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            const change = this.classList.contains('plus') ? 1 : -1;
            updateQuantity(itemId, change);
        });
    });
    
    // Cart item images (for modal)
    document.querySelectorAll('.cart-item-image').forEach(img => {
        img.addEventListener('click', function() {
            const productName = this.getAttribute('data-product-name');
            const productPrice = this.getAttribute('data-product-price');
            const productDescription = this.getAttribute('data-product-description');
            const productImage = this.getAttribute('data-product-image');
            
            showProductModal(productName, productPrice, productDescription, productImage);
        });
    });
}

// Fungsi untuk menampilkan modal produk
function showProductModal(name, price, description, image) {
    const modal = document.getElementById('item-detail-modal');
    const modalImage = modal.querySelector('img');
    const modalTitle = modal.querySelector('h3');
    const modalDescription = modal.querySelector('p');
    const modalPrice = modal.querySelector('.product-price');
    
    modalTitle.textContent = name;
    modalDescription.textContent = description;
    modalPrice.innerHTML = `${price} <span>IDR 55K</span>`;
    modalImage.src = image;
    modalImage.alt = name;
    
    modal.style.display = 'flex';
    feather.replace();
}

// Event listener untuk tombol Add to Cart di Products Section
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart dari product cards
    document.querySelectorAll('.product-card .product-icons a[href="#"]').forEach(btn => {
        if (btn.innerHTML.includes('shopping-cart')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get product data dari product card
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent.split(' ')[0];
                const productImage = productCard.querySelector('img').src;
                const productDescription = `${productName} - Menu lezat dan berkualitas dari Dapoer Box Cak Kholiq`;
                
                // Extract price number
                const priceNumber = parseInt(productPrice.replace(/[^0-9]/g, ''));
                
                const productData = {
                    name: productName,
                    price: productPrice,
                    priceNumber: priceNumber,
                    image: productImage,
                    description: productDescription
                };
                
                addToCart(productData);
            });
        }
    });
    
    // Add to cart dari menu cards
    document.querySelectorAll('.menu-card').forEach(card => {
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'add-to-cart-btn';
        addToCartBtn.innerHTML = '<i data-feather="shopping-cart"></i> Add to Cart';
        
        card.appendChild(addToCartBtn);
        
        addToCartBtn.addEventListener('click', function() {
            const productName = card.querySelector('h3').textContent.replace(/- /g, '').replace(/ -/g, '');
            const productPrice = card.querySelector('.menu-card-price').textContent;
            const productImage = card.querySelector('img').src;
            const productDescription = `${productName} - Menu spesial dari Dapoer Box Cak Kholiq`;
            
            const priceNumber = parseInt(productPrice.replace(/[^0-9]/g, ''));
            
            const productData = {
                name: productName,
                price: productPrice,
                priceNumber: priceNumber,
                image: productImage,
                description: productDescription
            };
            
            addToCart(productData);
        });
    });
    
    // Add to cart dari modal
    document.querySelector('.modal .product-content a').addEventListener('click', function(e) {
        e.preventDefault();
        
        const modal = document.getElementById('item-detail-modal');
        const productName = modal.querySelector('h3').textContent;
        const productPrice = modal.querySelector('.product-price').textContent.split(' ')[0];
        const productImage = modal.querySelector('img').src;
        const productDescription = modal.querySelector('p').textContent;
        
        const priceNumber = parseInt(productPrice.replace(/[^0-9]/g, ''));
        
        const productData = {
            name: productName,
            price: productPrice,
            priceNumber: priceNumber,
            image: productImage,
            description: productDescription
        };
        
        addToCart(productData);
        
        // Close modal
        modal.style.display = 'none';
    });
});

// ==================== CHECKOUT FUNCTIONALITY ====================

// Fungsi untuk checkout
function checkout() {
    if (cartItems.length === 0) {
        alert('Keranjang belanja kosong!');
        return;
    }
    
    // Buat pesan WhatsApp
    let message = `🛒 *PESANAN BARU - DAPOER BOX CAK KHOLIQ*\n\n`;
    message += `📝 *Detail Pesanan:*\n`;
    
    cartItems.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   • Harga: ${item.price}\n`;
        message += `   • Jumlah: ${item.quantity}\n`;
        message += `   • Subtotal: IDR ${item.priceNumber * item.quantity}K\n\n`;
    });
    
    message += `💰 *Total Pembayaran: IDR ${calculateTotal()}K*\n\n`;
    message += `📞 Mohon konfirmasi ketersediaan dan detail pengiriman.\n`;
    message += `Terima kasih! 🙏`;
    
    // Encode pesan untuk WhatsApp
    const encodedMessage = encodeURIComponent(message);
    
    // Nomor WhatsApp (ganti dengan nomor yang sesuai)
    const whatsappNumber = '6281234567890'; // Ganti dengan nomor WA yang benar
    
    // Buka WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
}

// Event listener untuk tombol checkout
document.addEventListener('DOMContentLoaded', function() {
    // Tambahkan tombol checkout ke keranjang
    const checkoutBtn = document.createElement('button');
    checkoutBtn.className = 'checkout-btn';
    checkoutBtn.innerHTML = '<i data-feather="credit-card"></i> Checkout via WhatsApp';
    checkoutBtn.addEventListener('click', checkout);
    
    // Tambahkan ke shopping cart (akan muncul setelah updateCartDisplay)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const cartTotal = document.querySelector('.cart-total');
                if (cartTotal && !document.querySelector('.checkout-btn')) {
                    cartTotal.appendChild(checkoutBtn);
                    feather.replace();
                }
            }
        });
    });
    
    observer.observe(document.querySelector('.shopping-cart'), {
        childList: true,
        subtree: true
    });
});

// Load cart dari localStorage saat page load
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('dappoerBoxCart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartDisplay();
    }
});

// Save cart ke localStorage setiap kali ada perubahan
function saveCart() {
    localStorage.setItem('dappoerBoxCart', JSON.stringify(cartItems));
}

// Update fungsi addToCart, removeFromCart, dan updateQuantity untuk save
const originalAddToCart = addToCart;
addToCart = function(productData) {
    originalAddToCart(productData);
    saveCart();
};

const originalRemoveFromCart = removeFromCart;
removeFromCart = function(itemId) {
    originalRemoveFromCart(itemId);
    saveCart();
};

const originalUpdateQuantity = updateQuantity;
updateQuantity = function(itemId, change) {
    originalUpdateQuantity(itemId, change);
    saveCart();
};