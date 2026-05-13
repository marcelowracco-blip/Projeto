// ===== BANCO DE DADOS DE PRODUTOS =====
const produtos = [
    { id: 1, nome: "Jogo de Lençóis Casal", categoria: "cama", preco: 129.90, imagem: "https://via.placeholder.com/300x220?text=Lençóis+Cama", destaque: true },
    { id: 2, nome: "Edredom King Microfibra", categoria: "cama", preco: 189.90, imagem: "https://via.placeholder.com/300x220?text=Edredom", destaque: true },
    { id: 3, nome: "Toalha de Banho Felpuda", categoria: "banho", preco: 49.90, imagem: "https://via.placeholder.com/300x220?text=Toalha+Banho", destaque: true },
    { id: 4, nome: "Tapete Antiderrapante", categoria: "banho", preco: 79.90, imagem: "https://via.placeholder.com/300x220?text=Tapete", destaque: false },
    { id: 5, nome: "Jogo Americano Floral", categoria: "mesa", preco: 59.90, imagem: "https://via.placeholder.com/300x220?text=Jogo+Mesa", destaque: true },
    { id: 6, nome: "Toalha de Mesa Rústica", categoria: "mesa", preco: 69.90, imagem: "https://via.placeholder.com/300x220?text=Toalha+Mesa", destaque: false },
    { id: 7, nome: "Roupão Felpudo", categoria: "banho", preco: 139.90, imagem: "https://via.placeholder.com/300x220?text=Roupão", destaque: true },
    { id: 8, nome: "Almofada Decorativa", categoria: "cama", preco: 45.90, imagem: "https://via.placeholder.com/300x220?text=Almofada", destaque: false },
];

// Produtos em destaque para página inicial
const produtosDestaque = produtos.filter(p => p.destaque === true);

// ===== CARRINHO (localStorage) =====
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    renderizarCarrinho();
}

function atualizarContadorCarrinho() {
    const countSpan = document.getElementById('cartCount');
    if (countSpan) {
        const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
        countSpan.innerText = totalItens;
    }
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    const itemExistente = carrinho.find(item => item.id === id);
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    salvarCarrinho();
    alert(`${produto.nome} adicionado ao carrinho!`);
    abrirCartSidebar();
}

function renderizarCarrinho() {
    const cartContainer = document.getElementById('cartItems');
    const totalSpan = document.getElementById('cartTotalPrice');
    if (!cartContainer) return;
    
    if (carrinho.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-msg">Seu carrinho está vazio</p>';
        if(totalSpan) totalSpan.innerText = 'R$ 0,00';
        return;
    }
    
    let html = '';
    let total = 0;
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        html += `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="cart-item-details">
                    <h4>${item.nome}</h4>
                    <p>R$ ${item.preco.toFixed(2)}</p>
                    <div>
                        <button class="cart-qty-btn" data-id="${item.id}" data-op="minus">-</button>
                        <span>${item.quantidade}</span>
                        <button class="cart-qty-btn" data-id="${item.id}" data-op="plus">+</button>
                        <button class="cart-remove" data-id="${item.id}">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    });
    cartContainer.innerHTML = html;
    if(totalSpan) totalSpan.innerText = `R$ ${total.toFixed(2)}`;
    
    // Eventos dos botões do carrinho
    document.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const op = btn.dataset.op;
            const item = carrinho.find(i => i.id === id);
            if(item) {
                if(op === 'plus') item.quantidade++;
                else {
                    item.quantidade--;
                    if(item.quantidade <= 0) carrinho = carrinho.filter(i => i.id !== id);
                }
                salvarCarrinho();
            }
        });
    });
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            carrinho = carrinho.filter(i => i.id !== id);
            salvarCarrinho();
        });
    });
}

// UI Carrinho sidebar
function abrirCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if(sidebar) sidebar.classList.add('open');
    if(overlay) overlay.classList.add('active');
}

function fecharCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if(sidebar) sidebar.classList.remove('open');
    if(overlay) overlay.classList.remove('active');
}

// Função para exibir produtos em grid
function exibirProdutosGrid(produtosArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = produtosArray.map(prod => `
        <div class="product-card" data-categoria="${prod.categoria}">
            <img src="${prod.imagem}" class="product-img" alt="${prod.nome}">
            <div class="product-info">
                <h3 class="product-title">${prod.nome}</h3>
                <p class="product-price">R$ ${prod.preco.toFixed(2)}</p>
                <button class="btn-add-cart" data-id="${prod.id}">Adicionar ao carrinho</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll(`#${containerId} .btn-add-cart`).forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            adicionarAoCarrinho(id);
        });
    });
}

// Carregar todos produtos na página produtos e aplicar filtro
function carregarTodosProdutos() {
    exibirProdutosGrid(produtos, 'allProductsGrid');
}

function initFiltros() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            let filtered = [];
            if (filter === 'all') filtered = produtos;
            else filtered = produtos.filter(p => p.categoria === filter);
            
            exibirProdutosGrid(filtered, 'allProductsGrid');
        });
    });
}

// FORMULÁRIO CONTATO VALIDAÇÃO
function initContactForm() {
    const form = document.getElementById('contactForm');
    if(!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        document.getElementById('nameError').innerText = '';
        document.getElementById('emailError').innerText = '';
        document.getElementById('messageError').innerText = '';
        
        if(name.value.trim() === '') {
            document.getElementById('nameError').innerText = 'Nome é obrigatório';
            isValid = false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email.value)) {
            document.getElementById('emailError').innerText = 'E-mail inválido';
            isValid = false;
        }
        if(message.value.trim() === '') {
            document.getElementById('messageError').innerText = 'Mensagem não pode estar vazia';
            isValid = false;
        }
        
        if(isValid) {
            document.getElementById('formSuccessMsg').innerText = 'Mensagem enviada com sucesso! Em breve retornamos :)';
            form.reset();
            setTimeout(() => document.getElementById('formSuccessMsg').innerText = '', 4000);
        }
    });
}

// MENU HAMBURGUER E SIDEBAR CARRINHO
document.addEventListener('DOMContentLoaded', () => {
    // Menu responsivo
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    if(mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }
    
    // Carrinho toggle
    const cartToggle = document.getElementById('cartToggle');
    if(cartToggle) cartToggle.addEventListener('click', abrirCartSidebar);
    const closeCart = document.getElementById('closeCartBtn');
    if(closeCart) closeCart.addEventListener('click', fecharCartSidebar);
    const overlay = document.getElementById('cartOverlay');
    if(overlay) overlay.addEventListener('click', fecharCartSidebar);
    
    // Atualizar carrinho inicial
    atualizarContadorCarrinho();
    renderizarCarrinho();
    
    // Animação para cards de categoria (redireciona para produtos com filtro)
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.dataset.cat;
            window.location.href = `produtos.html?filter=${cat}`;
        });
    });
    
    // Na página produtos, pegar filtro da URL
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if(filterParam && window.location.pathname.includes('produtos.html')) {
        setTimeout(() => {
            const btnFilter = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
            if(btnFilter) btnFilter.click();
        }, 100);
    }
});

// Export para uso em contextos globais
window.produtosDestaque = produtosDestaque;
window.exibirProdutosGrid = exibirProdutosGrid;
window.carregarTodosProdutos = carregarTodosProdutos;
window.initFiltros = initFiltros;
window.initContactForm = initContactForm;