// Данные товаров
const products = [
    // Майнкрафт услуги
    { id: 1, category: 'minecraft', catName: '⚙️ МАЙНКРАФТ', name: 'Загрузка сборки', price: 99, desc: 'Готовая сборка под ключ', popular: false },
    { id: 2, category: 'minecraft', catName: '⚙️ МАЙНКРАФТ', name: 'Настройка плагинов', price: '299 - 999', desc: 'Любые плагины на ваш сервер', popular: true },
    { id: 3, category: 'minecraft', catName: '⚙️ МАЙНКРАФТ', name: 'Полная настройка сервера', price: '1999 - 9999', desc: 'Сервер под ключ', popular: true },
    
    // Промокоды Standoff 2
    { id: 4, category: 'promo', catName: '🔪 ПРОМОКОДЫ', name: 'Tanto', price: 119, desc: 'Промокод на нож Tanto' },
    { id: 5, category: 'promo', catName: '🔪 ПРОМОКОДЫ', name: 'Kerambit', price: 279, desc: 'Промокод на Kerambit' },
    { id: 6, category: 'promo', catName: '🔪 ПРОМОКОДЫ', name: 'Butterfly', price: 199, desc: 'Промокод на Butterfly' },
    { id: 7, category: 'promo', catName: '🔪 ПРОМОКОДЫ', name: 'Stiletto', price: 189, desc: 'Промокод на Stiletto' },
    { id: 8, category: 'promo', catName: '🔪 ПРОМОКОДЫ', name: 'Fang', price: 249, desc: 'Промокод на Fang' },
    
    // Буст аккаунтов
    { id: 9, category: 'boost', catName: '🚀 БУСТ АККОВ', name: 'Silver 1/4', price: 99, desc: 'Буст до Silver' },
    { id: 10, category: 'boost', catName: '🚀 БУСТ АККОВ', name: 'Gold 1/4', price: 199, desc: 'Буст до Gold' },
    { id: 11, category: 'boost', catName: '🚀 БУСТ АККОВ', name: 'Pheonix', price: 379, desc: 'Буст до Pheonix' },
    { id: 12, category: 'boost', catName: '🚀 БУСТ АККОВ', name: 'Renger', price: 689, desc: 'Буст до Renger' },
    { id: 13, category: 'boost', catName: '🚀 БУСТ АККОВ', name: 'Master', price: 999, desc: 'Буст до Master' },
    { id: 14, category: 'boost', catName: '🚀 БУСТ АККОВ', name: 'Другие ранги', price: 1999, desc: 'Любой ранг', popular: true }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Текущая категория
let currentCategory = 'all';

// Показать уведомление
function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 1000;
        animation: slideIn 0.3s;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// Добавить анимацию
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Показать меню
function showMenu() {
    const container = document.getElementById('products');
    
    // Считаем количество товаров в категориях
    const minecraftCount = products.filter(p => p.category === 'minecraft').length;
    const promoCount = products.filter(p => p.category === 'promo').length;
    const boostCount = products.filter(p => p.category === 'boost').length;
    
    let html = `
        <div class="menu-bar">
            <button class="menu-btn ${currentCategory === 'all' ? 'active' : ''}" onclick="filterCategory('all')">
                🏠 ВСЕ <span class="count">${products.length}</span>
            </button>
            <button class="menu-btn ${currentCategory === 'minecraft' ? 'active' : ''}" onclick="filterCategory('minecraft')">
                ⚙️ МАЙНКРАФТ <span class="count">${minecraftCount}</span>
            </button>
            <button class="menu-btn ${currentCategory === 'promo' ? 'active' : ''}" onclick="filterCategory('promo')">
                🔪 ПРОМОКОДЫ <span class="count">${promoCount}</span>
            </button>
            <button class="menu-btn ${currentCategory === 'boost' ? 'active' : ''}" onclick="filterCategory('boost')">
                🚀 БУСТ <span class="count">${boostCount}</span>
            </button>
        </div>
        
        <div class="cart-info">
            <button class="cart-btn" onclick="showCart()">
                🛒 КОРЗИНА <span class="cart-count">${cart.length}</span>
            </button>
            <button class="home-btn" onclick="resetFilters()">🏠 ГЛАВНАЯ</button>
        </div>
        
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="🔍 Поиск товаров..." onkeyup="searchProducts()">
        </div>
        
        <div id="products-grid" class="products-grid"></div>
    `;
    
    container.innerHTML = html;
    showProducts();
}

// Сбросить фильтры
function resetFilters() {
    currentCategory = 'all';
    document.getElementById('searchInput').value = '';
    showMenu();
}

// Поиск товаров
function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    showProducts(query);
}

// Фильтр по категории
function filterCategory(cat) {
    currentCategory = cat;
    showMenu();
}

// Показать товары
function showProducts(searchQuery = '') {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    let filteredProducts = [...products];
    
    // Фильтр по категории
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
    }
    
    // Фильтр по поиску
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery) || 
            p.desc.toLowerCase().includes(searchQuery)
        );
    }
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div class="empty">❌ Товары не найдены</div>';
        return;
    }
    
    let html = '';
    filteredProducts.forEach(p => {
        const popularBadge = p.popular ? '<span class="popular-badge">🔥 ХИТ</span>' : '';
        
        html += `
            <div class="product-card" onclick="showDetails(${p.id})">
                ${popularBadge}
                <span class="cat">${p.catName}</span>
                <div class="name">${p.name}</div>
                <div class="desc">${p.desc}</div>
                <div class="price">${p.price}₽</div>
                <button class="buy-btn" onclick="buyProduct(${p.id}); event.stopPropagation()">
                    📩 КУПИТЬ
                </button>
                <button class="cart-add-btn" onclick="addToCart(${p.id}); event.stopPropagation()">
                    🛒 В КОРЗИНУ
                </button>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

// Добавить в корзину
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`✅ ${product.name} добавлен в корзину`);
}

// Удалить из корзины
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    showCart();
    showNotification('❌ Товар удален из корзины', 'error');
}

// Показать корзину
function showCart() {
    const container = document.getElementById('products');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                🛒 Корзина пуста
                <button class="home-btn" onclick="showMenu()">Вернуться в магазин</button>
            </div>
        `;
        return;
    }
    
    // Группируем товары в корзине
    const cartItems = {};
    cart.forEach(item => {
        if (!cartItems[item.id]) {
            cartItems[item.id] = { ...item, quantity: 1 };
        } else {
            cartItems[item.id].quantity++;
        }
    });
    
    let totalPrice = 0;
    let html = `
        <h2 class="cart-title">🛒 КОРЗИНА</h2>
        <div class="cart-grid">
    `;
    
    Object.values(cartItems).forEach(item => {
        const itemTotal = parseInt(item.price) * item.quantity;
        totalPrice += itemTotal;
        
        html += `
            <div class="cart-item">
                <span class="cat">${item.catName}</span>
                <div class="name">${item.name}</div>
                <div class="price">${item.price}₽ x ${item.quantity}</div>
                <div class="item-total">= ${itemTotal}₽</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">❌ Удалить</button>
            </div>
        `;
    });
    
    html += `
        </div>
        <div class="cart-total">
            <span>ИТОГО: ${totalPrice}₽</span>
            <button class="checkout-btn" onclick="checkout()">📩 ОФОРМИТЬ В TG</button>
            <button class="clear-btn" onclick="clearCart()">🗑️ ОЧИСТИТЬ</button>
            <button class="back-btn" onclick="showMenu()">◀ НАЗАД</button>
        </div>
    `;
    
    container.innerHTML = html;
}

// Очистить корзину
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    showCart();
    showNotification('🗑️ Корзина очищена', 'error');
}

// Оформление заказа
function checkout() {
    let message = 'НОВЫЙ ЗАКАЗ:%0A%0A';
    
    // Группируем товары
    const cartItems = {};
    cart.forEach(item => {
        if (!cartItems[item.id]) {
            cartItems[item.id] = { ...item, quantity: 1 };
        } else {
            cartItems[item.id].quantity++;
        }
    });
    
    let total = 0;
    Object.values(cartItems).forEach(item => {
        const itemTotal = parseInt(item.price) * item.quantity;
        message += `• ${item.name} x${item.quantity} = ${itemTotal}₽%0A`;
        total += itemTotal;
    });
    
    message += `%0AИТОГО: ${total}₽`;
    
    window.open(`https://t.me/MrCraftLuxeTT?text=${message}`, '_blank');
}

// Купить товар сразу
function buyProduct(id) {
    const product = products.find(p => p.id === id);
    const message = `Хочу купить: ${product.name} (${product.price}₽)`;
    window.open(`https://t.me/MrCraftLuxeTT=${message}`, '_blank');
}

// Детали товара
function showDetails(id) {
    const product = products.find(p => p.id === id);
    const message = `
        ${product.name}
        📁 Категория: ${product.catName}
        💰 Цена: ${product.price}₽
        📝 Описание: ${product.desc}
        
        Нажмите "Купить" для заказа в Telegram
    `;
    alert(message);
}

// Обновить счетчик корзины
function updateCartCount() {
    const counters = document.querySelectorAll('.cart-count');
    counters.forEach(counter => {
        counter.textContent = cart.length;
    });
}

// Запуск при загрузке
window.onload = function() {
    showMenu();
};