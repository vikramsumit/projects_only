// Initialize Lucide icons
lucide.createIcons();

// Sample products data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 99.99,
        originalPrice: 129.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        rating: 4.5,
        reviews: 128,
        description: "High-quality wireless headphones with noise cancellation and premium sound quality."
    },
    {
        id: 2,
        name: "Smart Watch Series 5",
        price: 299.99,
        originalPrice: 349.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 256,
        description: "Advanced smartwatch with health monitoring, GPS, and long battery life."
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        price: 19.99,
        originalPrice: 24.99,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
        rating: 4.2,
        reviews: 89,
        description: "Comfortable 100% cotton t-shirt available in multiple colors and sizes."
    },
    {
        id: 4,
        name: "Modern Sofa",
        price: 899.99,
        originalPrice: 1199.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop",
        rating: 4.6,
        reviews: 67,
        description: "Elegant modern sofa with premium upholstery and sturdy construction."
    },
    {
        id: 5,
        name: "Yoga Mat",
        price: 39.99,
        originalPrice: 49.99,
        category: "sports",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
        rating: 4.4,
        reviews: 145,
        description: "Non-slip yoga mat with excellent cushioning for all your fitness needs."
    },
    {
        id: 6,
        name: "Coffee Maker",
        price: 79.99,
        originalPrice: 99.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop",
        rating: 4.3,
        reviews: 203,
        description: "Programmable coffee maker with thermal carafe and multiple brew settings."
    },
    {
        id: 7,
        name: "Running Shoes",
        price: 129.99,
        originalPrice: 159.99,
        category: "sports",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 312,
        description: "Lightweight running shoes with advanced cushioning and breathable design."
    },
    {
        id: 8,
        name: "Wireless Mouse",
        price: 29.99,
        originalPrice: 39.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop",
        rating: 4.1,
        reviews: 178,
        description: "Ergonomic wireless mouse with precision tracking and long battery life."
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('shophub_cart')) || [];

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('shophub_cart', JSON.stringify(cart));
    updateCartBadge();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('shophub_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('shophub_cart', JSON.stringify(cart));
        updateCartBadge();
        renderCart();
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-gray-500 py-8">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="flex items-center space-x-4 border-b border-gray-200 pb-4 mb-4">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">${item.name}</h4>
                    <p class="text-gray-600">$${item.price.toFixed(2)} each</p>
                    <div class="flex items-center space-x-2 mt-2">
                        <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})" class="text-gray-500 hover:text-gray-700">-</button>
                        <span class="px-2">${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})" class="text-gray-500 hover:text-gray-700">+</button>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-gray-900">$${itemTotal.toFixed(2)}</p>
                    <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 text-sm mt-1">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    cartTotal.textContent = total.toFixed(2);
}

function showNotification(message) {
    // Simple notification - you could enhance this
    alert(message);
}

// Render products
function renderProducts(productsToShow = products) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden fade-in">
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                ${product.originalPrice > product.price ? `<span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">Sale</span>` : ''}
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${product.name}</h3>
                <div class="flex items-center mb-2">
                    <div class="flex text-yellow-400">
                        ${Array.from({length: 5}, (_, i) =>
                            `<i data-lucide="star" class="h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}"></i>`
                        ).join('')}
                    </div>
                    <span class="text-sm text-gray-600 ml-2">(${product.reviews})</span>
                </div>
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <span class="text-xl font-bold text-gray-900">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice > product.price ? `<span class="text-sm text-gray-500 line-through ml-2">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="viewProduct(${product.id})" class="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        View Details
                    </button>
                    <button onclick="addToCart(${product.id})" class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-initialize icons for new elements
    lucide.createIcons();
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('productModalTitle').textContent = product.name;
    document.getElementById('productModalContent').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg">
            </div>
            <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">${product.name}</h3>
                <div class="flex items-center mb-4">
                    <div class="flex text-yellow-400">
                        ${Array.from({length: 5}, (_, i) =>
                            `<i data-lucide="star" class="h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}"></i>`
                        ).join('')}
                    </div>
                    <span class="text-sm text-gray-600 ml-2">${product.rating} (${product.reviews} reviews)</span>
                </div>
                <div class="mb-4">
                    <span class="text-3xl font-bold text-gray-900">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice > product.price ? `<span class="text-lg text-gray-500 line-through ml-2">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <p class="text-gray-600 mb-6">${product.description}</p>
                <div class="flex space-x-4">
                    <button onclick="addToCart(${product.id}); document.getElementById('productModal').classList.add('hidden');" class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Add to Cart
                    </button>
                    <button onclick="document.getElementById('productModal').classList.add('hidden');" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('productModal').classList.remove('hidden');
    lucide.createIcons();
}

// Event listeners
document.getElementById('cartBtn').addEventListener('click', () => {
    renderCart();
    document.getElementById('cartModal').classList.remove('hidden');
});

document.getElementById('closeCartBtn').addEventListener('click', () => {
    document.getElementById('cartModal').classList.add('hidden');
});

document.getElementById('closeProductBtn').addEventListener('click', () => {
    document.getElementById('productModal').classList.add('hidden');
});

document.getElementById('menuBtn').addEventListener('click', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
});

document.getElementById('shopNowBtn').addEventListener('click', () => {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('exploreBtn').addEventListener('click', () => {
    document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
});

// Category filtering
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
        renderProducts(filteredProducts);
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
});

// Search functionality
function handleSearch(query) {
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filteredProducts);
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    handleSearch(e.target.value);
});

document.getElementById('mobileSearchInput').addEventListener('input', (e) => {
    handleSearch(e.target.value);
});

// View switching
document.getElementById('gridView').addEventListener('click', () => {
    document.getElementById('productsGrid').className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    document.getElementById('gridView').className = 'p-2 bg-blue-600 text-white rounded-lg';
    document.getElementById('listView').className = 'p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300';
});

document.getElementById('listView').addEventListener('click', () => {
    document.getElementById('productsGrid').className = 'space-y-4';
    document.getElementById('listView').className = 'p-2 bg-blue-600 text-white rounded-lg';
    document.getElementById('gridView').className = 'p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300';
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Checkout functionality would be implemented here with payment processing.');
});

// User authentication check (from original dashboard)
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        renderProducts();
        updateCartBadge();
    }
});

// Close modals when clicking outside
document.getElementById('cartModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        e.currentTarget.classList.add('hidden');
    }
});

document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        e.currentTarget.classList.add('hidden');
    }
});
