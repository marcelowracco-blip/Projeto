// ===== BANCO DE DADOS DE PRODUTOS =====
const produtos = [
    { id: 1, nome: "Colcha Fofinha de Casal", categoria: "cama", preco: 40.00, imagem: "imagem/colchafofinhacasal.jpeg", destaque: true },
    { id: 2, nome: "Edredom King Microfibra", categoria: "cama", preco: 300.00, imagem: "imagem/colcha casal infantil.jpeg", destaque: true },
    { id: 3, nome: "Toalha de Banho Felpuda", categoria: "banho", preco: 49.90, imagem: "imagem/toalha.jpeg", destaque: true },
    { id: 4, nome: "Tapete", categoria: "casa", preco: 250.00, imagem: "imagem/tapete.jpeg", destaque: false },
    { id: 5, nome: "Colcha Solteiro", categoria: "cama", preco: 300.00, imagem: "imagem/colcha solteiro.jpeg", destaque: true },
    { id: 6, nome: "Colcha Solteiro Feminina", categoria: "cama", preco: 300.00, imagem: "imagem/colchasolteirofem.jpeg", destaque: false },
    { id: 7, nome: "Colcha Solteiro Masculino", categoria: "cama", preco: 299.90, imagem: "imagem/colchasolteiromasc.jpeg", destaque: true },
    { id: 8, nome: "Tapete Marrom", categoria: "casa", preco: 249.90, imagem: "imagem/tapetemarrom.jpeg", destaque: false },
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
        // Esconder seção de pagamento quando carrinho vazio
        const paymentSection = document.getElementById('paymentSection');
        if(paymentSection) paymentSection.style.display = 'none';
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
    
    // Mostrar seção de pagamento
    const paymentSection = document.getElementById('paymentSection');
    if(paymentSection && carrinho.length > 0) {
        paymentSection.style.display = 'block';
        // Atualizar total no resumo do pagamento
        const paymentTotal = document.getElementById('paymentTotal');
        if(paymentTotal) paymentTotal.innerText = `R$ ${total.toFixed(2)}`;
    }
    
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

// ===== FUNÇÕES DE PAGAMENTO E FINALIZAÇÃO =====

function getTotalCarrinho() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

// Alternar entre formas de pagamento
function togglePaymentMethod(method) {
    const creditCardForm = document.getElementById('creditCardForm');
    const pixSection = document.getElementById('pixSection');
    const methodBtns = document.querySelectorAll('.payment-method-btn');
    
    methodBtns.forEach(btn => btn.classList.remove('active'));
    
    if(method === 'credit') {
        document.getElementById('btnCredit').classList.add('active');
        if(creditCardForm) creditCardForm.style.display = 'block';
        if(pixSection) pixSection.style.display = 'none';
    } else if(method === 'pix') {
        document.getElementById('btnPix').classList.add('active');
        if(creditCardForm) creditCardForm.style.display = 'none';
        if(pixSection) pixSection.style.display = 'block';
        gerarCodigoPix();
    }
}

// Gerar código Pix aleatório
function gerarCodigoPix() {
    const pixCode = document.getElementById('pixCode');
    if(pixCode) {
        const total = getTotalCarrinho();
        const codigo = `pix.${Date.now()}.${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        pixCode.innerHTML = `
            <div class="pix-code-box">
                <p><strong>Código Pix:</strong></p>
                <code style="font-size: 1.1rem; word-break: break-all; background: #f0f0f0; padding: 10px; display: block; border-radius: 8px;">${codigo}</code>
                <p style="margin-top: 10px;"><strong>Valor:</strong> R$ ${total.toFixed(2)}</p>
                <button onclick="copiarPix()" class="btn-copiar-pix">📋 Copiar código</button>
            </div>
        `;
    }
}

function copiarPix() {
    const codeElement = document.querySelector('#pixCode code');
    if(codeElement) {
        navigator.clipboard.writeText(codeElement.innerText);
        alert('Código Pix copiado!');
    }
}

// Validar cartão (simplificado)
function validarCartao(numero, validade, cvv, nome) {
    const numeroLimpo = numero.replace(/\s/g, '');
    if(numeroLimpo.length !== 16 || !/^\d+$/.test(numeroLimpo)) {
        return { valid: false, message: 'Número de cartão inválido (16 dígitos)' };
    }
    if(!/^\d{2}\/\d{2}$/.test(validade)) {
        return { valid: false, message: 'Validade inválida (MM/AA)' };
    }
    if(!/^\d{3}$/.test(cvv)) {
        return { valid: false, message: 'CVV inválido (3 dígitos)' };
    }
    if(nome.trim().length < 3) {
        return { valid: false, message: 'Nome do titular inválido' };
    }
    return { valid: true, message: '' };
}

// Finalizar compra
function finalizarCompra() {
    if(carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    function mostrarFormasPagamento() {
    if(carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    const paymentSection = document.getElementById('paymentSection');
    if(paymentSection) {
        paymentSection.style.display = 'block';
        const btnCheckout = document.querySelector('.btn-checkout');
        if(btnCheckout) {
            btnCheckout.style.display = 'none';
        }
        paymentSection.scrollIntoView({ behavior: 'smooth' });
    }
}
    
    const selectedMethod = document.querySelector('.payment-method-btn.active')?.dataset.method;
    
    if(!selectedMethod) {
        alert('Selecione uma forma de pagamento');
        return;
    }
    
    let pagamentoValido = false;
    let mensagemSucesso = '';
    
    if(selectedMethod === 'credit') {
        const numero = document.getElementById('cardNumber')?.value || '';
        const validade = document.getElementById('cardValidity')?.value || '';
        const cvv = document.getElementById('cardCvv')?.value || '';
        const nome = document.getElementById('cardName')?.value || '';
        
        const validacao = validarCartao(numero, validade, cvv, nome);
        if(!validacao.valid) {
            alert(validacao.message);
            return;
        }
        pagamentoValido = true;
        mensagemSucesso = 'Pagamento com cartão de crédito processado com sucesso!';
        
    } else if(selectedMethod === 'pix') {
        pagamentoValido = true;
        mensagemSucesso = 'Pagamento via Pix confirmado!';
    }
    
    if(pagamentoValido) {
        const total = getTotalCarrinho();
        // Limpar carrinho
        carrinho = [];
        salvarCarrinho();
        
        // Fechar sidebar
        fecharCartSidebar();
        
        // Mostrar mensagem de sucesso
        alert(`${mensagemSucesso}\nTotal: R$ ${total.toFixed(2)}\n\nPedido finalizado com sucesso! Obrigado pela compra!`);
        
        // Resetar formulários de pagamento
        if(document.getElementById('creditCardForm')) {
            document.getElementById('creditCardForm').reset();
        }
        
        // Opcional: redirecionar para página de confirmação
        // window.location.href = 'confirmacao.html';
    }
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
    
    // Eventos de pagamento
    const btnCredit = document.getElementById('btnCredit');
    const btnPix = document.getElementById('btnPix');
    if(btnCredit) btnCredit.addEventListener('click', () => togglePaymentMethod('credit'));
    if(btnPix) btnPix.addEventListener('click', () => togglePaymentMethod('pix'));
    
    const btnFinalizar = document.getElementById('btnFinalizar');
    if(btnFinalizar) btnFinalizar.addEventListener('click', finalizarCompra);
    
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
        // Adicionar evento ao botão Finalizar Compra original
    const btnCheckout = document.querySelector('.btn-checkout');
    if(btnCheckout) {
        btnCheckout.addEventListener('click', mostrarFormasPagamento);
    }
});

// Export para uso em contextos globais
window.produtosDestaque = produtosDestaque;
window.exibirProdutosGrid = exibirProdutosGrid;
window.carregarTodosProdutos = carregarTodosProdutos;
window.initFiltros = initFiltros;
window.initContactForm = initContactForm;
window.togglePaymentMethod = togglePaymentMethod;
window.finalizarCompra = finalizarCompra;
window.copiarPix = copiarPix;
