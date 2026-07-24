// DATA STATE
const products = [
    { id: 1, name: "Camisola SL Benfica Principal", club: "Benfica", country: "Portugal", league: "Liga Portugal", season: "2026/27", price: 89.99, state: "Novo", img: "images/benfica.jpg" },
    { id: 2, name: "Camisola FC Porto Principal", club: "FC Porto", country: "Portugal", league: "Liga Portugal", season: "2026/27", price: 89.99, state: "Novo", img: "images/porto.jpg" },
    { id: 3, name: "Camisola Sporting CP Principal", club: "Sporting", country: "Portugal", league: "Liga Portugal", season: "2026/27", price: 89.99, state: "Novo", img: "images/sporting.jpg" },
    { id: 4, name: "Camisola Real Madrid Retro 2002", club: "Real Madrid", country: "Espanha", league: "Champions League", season: "Retro", price: 110.00, state: "Retro", img: "images/real.jpg" },
    { id: 5, name: "Camisola FC Barcelona Alternativa", club: "Barcelona", country: "Espanha", league: "La Liga", season: "2025/26", price: 75.00, state: "Novo", img: "images/barcelona.jpg" },
    { id: 6, name: "Camisola Manchester City Home", club: "Manchester City", country: "Inglaterra", league: "Premier League", season: "2026/27", price: 95.00, state: "Novo", img: "images/manchester.jpg" },
    { id: 7, name: "Camisola PSG", club: "PSG", country: "França", league: "Premier League", season: "2026/27", price: 95.00, state: "Novo", img: "images/psg.jpg" }
];

const blogPosts = [
    { id: 1, title: "História das Camisolas de Futebol", date: "12 Julho, 2026", img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80", text: "Descobre como os equipamentos passaram de algodão pesado para tecnologia de alta performance." },
    { id: 2, title: "Os Equipamentos Mais Bonitos de Sempre", date: "05 Junho, 2026", img: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80", text: "Uma viagem no tempo pelas camisolas que marcaram gerações de adeptos do futebol mundial." }
];

let cart = [];

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    renderFeaturedProducts();
    renderCatalog(products);
    renderBlog();
});

// ROUTING SYSTEM
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// RENDER PRODUCTS   <button class="btn btn-primary" onclick="addToCart(${product.id})"><i class="fa-solid fa-cart-plus"></i></button>


 

function createProductCard(product) {
    return `
        <div class="product-card">
            <span class="product-badge ${product.state === 'Retro' ? 'retro' : ''}">${product.state}</span>
            <img src="${product.img}" class="product-img" alt="${product.name}" onclick="openProductModal(${product.id})">
            <div class="product-info">
                <span class="product-meta">${product.club} • ${product.season}</span>
                <h4 class="product-title">${product.name}</h4>
                <div class="product-price">${product.price.toFixed(2)} €</div>
                <div class="product-actions">
                    <button class="btn btn-outline" onclick="openProductModal(${product.id})">Ver</button>
                </div>
            </div>
        </div>
    `;
}

function renderFeaturedProducts() {
    const grid = document.getElementById('home-featured-grid');
    grid.innerHTML = products.slice(0, 4).map(createProductCard).join('');
}

function renderCatalog(items) {
    const grid = document.getElementById('catalog-products-grid');
    const countLabel = document.getElementById('product-count');
    
    countLabel.textContent = `A mostrar ${items.length} produtos`;
    grid.innerHTML = items.length > 0 
        ? items.map(createProductCard).join('')
        : `<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Nenhum produto encontrado com os filtros selecionados.</p>`;
}

// RENDER BLOG
function renderBlog() {
    const grid = document.getElementById('blog-grid');
    grid.innerHTML = blogPosts.map(post => `
        <div class="blog-card">
            <img src="${post.img}" class="blog-img" alt="${post.title}">
            <div class="blog-content">
                <span class="blog-date">${post.date}</span>
                <h3 class="blog-title">${post.title}</h3>
                <p>${post.text}</p>
            </div>
        </div>
    `).join('');
}

// FILTER SYSTEM
function updatePriceLabel(val) {
    document.getElementById('price-val').textContent = val;
}

function applyFilters() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const club = document.getElementById('filter-clube').value;
    const league = document.getElementById('filter-liga').value;
    const season = document.getElementById('filter-epoca').value;
    const maxPrice = parseFloat(document.getElementById('filter-price').value);
    const sort = document.getElementById('sort-select').value;

    let filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search) || p.club.toLowerCase().includes(search);
        const matchesClub = club === "" || p.club === club;
        const matchesLeague = league === "" || p.league === league;
        const matchesSeason = season === "" || p.season === season;
        const matchesPrice = p.price <= maxPrice;

        return matchesSearch && matchesClub && matchesLeague && matchesSeason && matchesPrice;
    });

    // Sorting
    if (sort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') filtered.sort((a,b) => b.price - a.price);

    renderCatalog(filtered);
}

function resetFilters() {
    document.getElementById('search-input').value = "";
    document.getElementById('filter-clube').value = "";
    document.getElementById('filter-liga').value = "";
    document.getElementById('filter-epoca').value = "";
    document.getElementById('filter-price').value = 120;
    updatePriceLabel(120);
    applyFilters();
}

// CART SYSTEM
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const item = cart.find(i => i.id === productId);

    if (item) {
        item.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    openCart();
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    cartCount.textContent = totalQty;
    cartTotal.textContent = `${totalPrice.toFixed(2)} €`;

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div style="flex-grow: 1;">
                <h4 style="font-size: 0.9rem;">${item.name}</h4>
                <span style="font-size: 0.8rem; color: var(--text-light);">${item.qty}x ${item.price.toFixed(2)}€</span>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color: red; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function openCart() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('overlay').classList.add('active');
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

// MODAL QUICK VIEW & ZOOM
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <div class="modal-img-container">
            <img src="${product.img}" alt="${product.name}">
        </div>
        <div>
            <h2>${product.name}</h2>
            <p style="color: var(--secondary); font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0;">${product.price.toFixed(2)} €</p>
            <p><strong>Clube:</strong> ${product.club}</p>
            <p><strong>Época:</strong> ${product.season}</p>
            <p style="margin: 1rem 0;">Equipamento oficial fabricado com materiais respiráveis de alta tecnologia para máximo conforto.</p>
            <button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal();" style="width: 100%;">Adicionar ao Carrinho</button>
        </div>
    `;

    document.getElementById('product-modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function closeAllModals() {
    closeCart();
    closeModal();
}

function handleContactSubmit(e) {
    e.preventDefault();
    alert("Obrigado pela sua mensagem! Responderemos em breve.");
    e.target.reset();
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    renderFeaturedProducts();
    renderCatalog(products);
    renderBlog();
    
    // Inicializar evento do menu mobile
    initMobileMenu();
});

// LÓGICA DO MENU MOBILE
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Alterna o ícone entre hambúrguer (três traços) e 'X' (fechar)
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// ROUTING SYSTEM (Ajustado para fechar o menu mobile ao navegar)
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fecha o menu mobile após clicar num link
    const navMenu = document.getElementById('nav-menu');
    const menuToggle = document.getElementById('menu-toggle');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    }
}