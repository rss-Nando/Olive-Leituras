// ===== CONFIGURAÇÃO DO PAINEL ADMINISTRATIVO =====
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    if (!verificarLoginAdmin()) {
        console.log('⚠️ Usuário não logado, redirecionando para login...');
        window.location.href = 'login.html';
        return;
    }

    // Inicializar todos os módulos
    inicializarNavegacao();
    inicializarFormularioLivros();
    inicializarMetricas();
    inicializarCentralSuporte();
    inicializarLogout();
    
    // Mostrar a primeira seção por padrão
    mostrarSecao('inclusao-livros');
    
    // Marcar que o admin acessou o painel
    marcarAcessoAdmin();
    
    console.log('✅ Painel Administrativo Olive Leituras inicializado');
});

// ===== SISTEMA DE SESSÃO SIMPLIFICADO =====
function verificarLoginAdmin() {
    // Verificar se veio da página de login (parâmetro na URL)
    const urlParams = new URLSearchParams(window.location.search);
    const fromLogin = urlParams.get('fromLogin');
    
    if (fromLogin === 'true') {
        // Se veio do login, marcar como logado
        sessionStorage.setItem('adminSession', 'true');
        sessionStorage.setItem('adminEmail', 'admin@olivemail.com');
        sessionStorage.setItem('adminLoginTime', new Date().toISOString());
        
        // Remover o parâmetro da URL sem recarregar
        const novaUrl = window.location.pathname;
        window.history.replaceState({}, '', novaUrl);
        
        return true;
    }
    
    // Verificar sessão ativa
    const sessionAdmin = sessionStorage.getItem('adminSession');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    
    if (!sessionAdmin || !loginTime) {
        return false;
    }
    
    // Verificar se a sessão expirou (8 horas)
    const loginDate = new Date(loginTime);
    const agora = new Date();
    const diferencaHoras = (agora - loginDate) / (1000 * 60 * 60);
    
    if (diferencaHoras > 8) {
        // Sessão expirada
        sessionStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminEmail');
        sessionStorage.removeItem('adminLoginTime');
        return false;
    }
    
    return true;
}

function marcarAcessoAdmin() {
    // Atualizar último acesso
    sessionStorage.setItem('adminLastAccess', new Date().toISOString());
    
    // Atualizar display do último acesso
    atualizarDisplayUltimoAcesso();
}

function atualizarDisplayUltimoAcesso() {
    const elementosAcesso = document.querySelectorAll('.last-access');
    const agora = new Date();
    const horas = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    
    elementosAcesso.forEach(elemento => {
        elemento.textContent = `Último acesso: Hoje às ${horas}:${minutos}`;
    });
}

// ===== MODIFICAÇÃO NO ARQUIVO login.js =====
// Adicione esta função ao final do login.js para redirecionar corretamente:

/*
function fazerLogin(email, senha) {
    // ... código existente ...
    
    if (email === ADMIN_EMAIL && senha === ADMIN_SENHA) {
        exibirMensagem('Login administrativo realizado com sucesso!', 'sucesso');
        
        setTimeout(() => {
            // Redirecionar com parâmetro para indicar login bem-sucedido
            window.location.href = ADMIN_PAGE + '?fromLogin=true';
        }, 1500);
        
        return true;
    }
    // ... resto do código ...
}
*/

// ===== SISTEMA DE NAVEGAÇÃO =====
function inicializarNavegacao() {
    const navLinks = document.querySelectorAll('.nav-link');
    const adminSections = document.querySelectorAll('.admin-section');
    
    // Se não houver links de navegação, criar navegação padrão
    if (navLinks.length === 0) {
        criarNavegacaoFallback();
        return;
    }
    
    // Adicionar event listeners para os links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            mostrarSecao(targetId);
            
            // Atualizar estado ativo
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Atualizar URL sem recarregar a página
            history.pushState(null, null, `#${targetId}`);
        });
    });
    
    // Lidar com navegação pelo browser (back/forward)
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            mostrarSecao(hash);
            atualizarNavegacaoAtiva(hash);
        }
    });
    
    // Verificar hash na URL ao carregar
    const hashInicial = window.location.hash.substring(1);
    if (hashInicial && document.getElementById(hashInicial)) {
        mostrarSecao(hashInicial);
        atualizarNavegacaoAtiva(hashInicial);
    } else {
        // Mostrar primeira seção por padrão
        const primeiraSecao = document.querySelector('.admin-section');
        if (primeiraSecao) {
            const primeiraSecaoId = primeiraSecao.id;
            mostrarSecao(primeiraSecaoId);
            atualizarNavegacaoAtiva(primeiraSecaoId);
        }
    }
}

function criarNavegacaoFallback() {
    console.log('⚠️ Navegação não encontrada, criando fallback...');
    
    const sections = document.querySelectorAll('.admin-section');
    if (sections.length === 0) return;
    
    // Mostrar todas as seções se não houver navegação
    sections.forEach(section => {
        section.style.display = 'block';
    });
}

function mostrarSecao(secaoId) {
    const sections = document.querySelectorAll('.admin-section');
    const targetSection = document.getElementById(secaoId);
    
    if (!targetSection) {
        console.log(`❌ Seção ${secaoId} não encontrada`);
        return;
    }
    
    // Esconder todas as seções
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar seção alvo
    targetSection.style.display = 'block';
    
    // Scroll suave para a seção
    setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function atualizarNavegacaoAtiva(secaoId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkTarget = link.getAttribute('href').substring(1);
        if (linkTarget === secaoId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== SISTEMA DE LOGOUT =====
function inicializarLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) {
        console.log('⚠️ Botão de logout não encontrado');
        return;
    }
    
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        fazerLogoutAdmin();
    });
}

function fazerLogoutAdmin() {
    if (confirm('Tem certeza que deseja sair do painel administrativo?')) {
        // Limpar dados de sessão
        sessionStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminEmail');
        sessionStorage.removeItem('adminLoginTime');
        sessionStorage.removeItem('adminLastAccess');
        
        // Redirecionar para login
        window.location.href = 'login.html';
    }
}

// ===== FUNÇÕES RESTANTES (mantidas do código anterior) =====
function inicializarFormularioLivros() {
    const bookForm = document.getElementById('bookForm');
    if (!bookForm) {
        console.log('⚠️ Formulário de livros não encontrado');
        return;
    }
    
    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormularioLivro()) {
            processarCadastroLivro();
        }
    });
    
    // Validação em tempo real
    const inputs = bookForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validarCampo(this);
        });
        
        input.addEventListener('input', function() {
            limparErro(this);
        });
    });
}

function validarFormularioLivro() {
    const camposObrigatorios = [
        'bookTitle', 'bookAuthor', 'bookCategory', 
        'bookDescription', 'bookPrice', 'bookStock'
    ];
    
    let valido = true;
    
    camposObrigatorios.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo && !validarCampo(campo)) {
            valido = false;
        }
    });
    
    return valido;
}

function validarCampo(campo) {
    const valor = campo.value.trim();
    let valido = true;
    let mensagem = '';
    
    // Remover erros anteriores
    limparErro(campo);
    
    switch(campo.type) {
        case 'email':
            if (!valor.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                mensagem = 'Por favor, insira um email válido.';
                valido = false;
            }
            break;
            
        case 'number':
            if (campo.hasAttribute('min') && parseFloat(valor) < parseFloat(campo.getAttribute('min'))) {
                mensagem = `O valor deve ser maior ou igual a ${campo.getAttribute('min')}.`;
                valido = false;
            }
            break;
            
        case 'text':
        case 'textarea':
            if (campo.hasAttribute('required') && !valor) {
                mensagem = 'Este campo é obrigatório.';
                valido = false;
            } else if (campo.id === 'bookTitle' && valor.length < 2) {
                mensagem = 'O título deve ter pelo menos 2 caracteres.';
                valido = false;
            }
            break;
            
        case 'select-one':
            if (campo.hasAttribute('required') && !valor) {
                mensagem = 'Por favor, selecione uma opção.';
                valido = false;
            }
            break;
    }
    
    if (!valido) {
        mostrarErro(campo, mensagem);
    } else {
        mostrarSucesso(campo);
    }
    
    return valido;
}

function mostrarErro(campo, mensagem) {
    campo.style.borderColor = '#dc3545';
    
    let erroElement = campo.parentNode.querySelector('.error-message');
    if (!erroElement) {
        erroElement = document.createElement('div');
        erroElement.className = 'error-message';
        campo.parentNode.appendChild(erroElement);
    }
    
    erroElement.textContent = mensagem;
    erroElement.style.color = '#dc3545';
    erroElement.style.fontSize = '0.9rem';
    erroElement.style.marginTop = '5px';
}

function mostrarSucesso(campo) {
    campo.style.borderColor = '#28a745';
}

function limparErro(campo) {
    campo.style.borderColor = '#B8860B';
    
    const erroElement = campo.parentNode.querySelector('.error-message');
    if (erroElement) {
        erroElement.remove();
    }
}

function processarCadastroLivro() {
    const form = document.getElementById('bookForm');
    const submitBtn = form.querySelector('.btn-primary');
    
    // Simular loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        mostrarMensagem('Livro cadastrado com sucesso! (Demonstração)', 'sucesso');
        
        // Resetar formulário
        form.reset();
        
        // Restaurar botão
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Limpar todos os erros
        const errors = form.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
        
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#B8860B';
        });
        
    }, 2000);
}

function inicializarMetricas() {
    // Atualizar métricas em tempo real (simulação)
    atualizarMetricasTempoReal();
    
    // Configurar atualização automática a cada 30 segundos
    setInterval(atualizarMetricasTempoReal, 30000);
    
    // Inicializar gráficos interativos
    inicializarGraficosInterativos();
}

function atualizarMetricasTempoReal() {
    const metricas = document.querySelectorAll('.metric-value');
    
    metricas.forEach(metrica => {
        const valorAtual = parseInt(metrica.textContent.replace(/\D/g, ''));
        const variacao = Math.floor(Math.random() * 10) - 2;
        const novoValor = Math.max(0, valorAtual + variacao);
        
        animarContador(metrica, valorAtual, novoValor);
    });
}

function animarContador(elemento, inicio, fim) {
    const duracao = 1000;
    const intervalo = 50;
    const passos = duracao / intervalo;
    const incremento = (fim - inicio) / passos;
    let valorAtual = inicio;
    let passo = 0;
    
    const timer = setInterval(() => {
        passo++;
        valorAtual += incremento;
        
        if (passo >= passos) {
            valorAtual = fim;
            clearInterval(timer);
        }
        
        elemento.textContent = Math.round(valorAtual).toLocaleString();
    }, intervalo);
}

function inicializarGraficosInterativos() {
    const barras = document.querySelectorAll('.bar');
    
    barras.forEach(barra => {
        barra.addEventListener('mouseenter', function() {
            this.style.transform = 'scaleX(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        barra.addEventListener('mouseleave', function() {
            this.style.transform = 'scaleX(1)';
        });
    });
}

function inicializarCentralSuporte() {
    inicializarFiltrosTickets();
    inicializarSistemaChat();
    inicializarAcoesTickets();
}

function inicializarFiltrosTickets() {
    const filtroSelect = document.getElementById('ticketFilter');
    if (!filtroSelect) return;
    
    filtroSelect.addEventListener('change', function() {
        filtrarTickets(this.value);
    });
}

function filtrarTickets(filtro) {
    const tickets = document.querySelectorAll('.ticket-item');
    
    tickets.forEach(ticket => {
        const status = ticket.getAttribute('data-status');
        
        switch(filtro) {
            case 'all':
                ticket.style.display = 'flex';
                break;
            case 'open':
                ticket.style.display = status === 'open' ? 'flex' : 'none';
                break;
            case 'pending':
                ticket.style.display = status === 'pending' ? 'flex' : 'none';
                break;
            case 'resolved':
                ticket.style.display = status === 'resolved' ? 'flex' : 'none';
                break;
        }
    });
}

function inicializarAcoesTickets() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-small')) {
            const ticket = e.target.closest('.ticket-item');
            const acao = e.target.textContent.trim();
            
            switch(acao) {
                case 'Responder':
                    abrirEditorResposta(ticket);
                    break;
                case 'Marcar como Lido':
                    marcarComoLido(ticket);
                    break;
                case 'Resolver':
                    resolverTicket(ticket);
                    break;
                case 'Ver Resposta':
                    verResposta(ticket);
                    break;
                case 'Reabrir':
                    reabrirTicket(ticket);
                    break;
            }
        }
    });
}

function abrirEditorResposta(ticket) {
    const ticketId = ticket.querySelector('.ticket-id').textContent;
    const assunto = ticket.querySelector('h4').textContent;
    
    const resposta = prompt(`Responder ao ticket ${ticketId} - ${assunto}\n\nDigite sua resposta:`);
    
    if (resposta && resposta.trim()) {
        mostrarMensagem(`Resposta enviada para o ticket ${ticketId}`, 'sucesso');
    }
}

function marcarComoLido(ticket) {
    const ticketId = ticket.querySelector('.ticket-id').textContent;
    ticket.style.opacity = '0.7';
    
    mostrarMensagem(`Ticket ${ticketId} marcado como lido`, 'info');
    
    setTimeout(() => {
        ticket.querySelector('.ticket-status').textContent = 'Em Andamento';
        ticket.querySelector('.ticket-status').className = 'ticket-status pending';
        ticket.setAttribute('data-status', 'pending');
    }, 1000);
}

function resolverTicket(ticket) {
    const ticketId = ticket.querySelector('.ticket-id').textContent;
    
    mostrarMensagem(`Ticket ${ticketId} resolvido com sucesso`, 'sucesso');
    
    setTimeout(() => {
        ticket.querySelector('.ticket-status').textContent = 'Resolvido';
        ticket.querySelector('.ticket-status').className = 'ticket-status resolved';
        ticket.setAttribute('data-status', 'resolved');
    }, 1000);
}

function verResposta(ticket) {
    const ticketId = ticket.querySelector('.ticket-id').textContent;
    alert(`Resposta do ticket ${ticketId}:\n\n"Obrigado por entrar em contato. Seu problema foi resolvido pela nossa equipe. Caso precise de mais ajuda, não hesite em nos contactar novamente."`);
}

function reabrirTicket(ticket) {
    const ticketId = ticket.querySelector('.ticket-id').textContent;
    
    mostrarMensagem(`Ticket ${ticketId} reaberto`, 'info');
    
    setTimeout(() => {
        ticket.querySelector('.ticket-status').textContent = 'Aberto';
        ticket.querySelector('.ticket-status').className = 'ticket-status open';
        ticket.setAttribute('data-status', 'open');
        ticket.style.opacity = '1';
    }, 1000);
}

function inicializarSistemaChat() {
    const chatInput = document.getElementById('chatMessage');
    const sendButton = document.getElementById('sendMessage');
    
    if (!chatInput || !sendButton) return;
    
    function enviarMensagem() {
        const mensagem = chatInput.value.trim();
        
        if (mensagem) {
            adicionarMensagemChat(mensagem, 'admin');
            
            setTimeout(() => {
                const respostas = [
                    "Entendi, vou verificar isso para você.",
                    "Obrigado pela informação. Em que mais posso ajudar?",
                    "Pode me dar mais detalhes sobre o problema?",
                    "Já encaminhei para nossa equipe técnica.",
                    "Vou precisar de algumas informações adicionais."
                ];
                const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
                adicionarMensagemChat(respostaAleatoria, 'user');
            }, 2000);
            
            chatInput.value = '';
        }
    }
    
    sendButton.addEventListener('click', enviarMensagem);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enviarMensagem();
        }
    });
}

function adicionarMensagemChat(texto, remetente) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${remetente}-message`;
    
    const agora = new Date();
    const hora = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${texto}</p>
            <span class="message-time">${hora}:${minutos}</span>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
function mostrarMensagem(mensagem, tipo = 'info') {
    const mensagensExistentes = document.querySelectorAll('.global-message');
    mensagensExistentes.forEach(msg => msg.remove());
    
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `global-message ${tipo}`;
    mensagemDiv.textContent = mensagem;
    
    Object.assign(mensagemDiv.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    const cores = {
        sucesso: '#28a745',
        erro: '#dc3545',
        info: '#17a2b8',
        aviso: '#ffc107'
    };
    
    mensagemDiv.style.background = cores[tipo] || cores.info;
    
    document.body.appendChild(mensagemDiv);
    
    setTimeout(() => {
        mensagemDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        mensagemDiv.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (mensagemDiv.parentNode) {
                mensagemDiv.remove();
            }
        }, 300);
    }, 5000);
    
    mensagemDiv.addEventListener('click', function() {
        this.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (this.parentNode) {
                this.remove();
            }
        }, 300);
    });
}

// ===== INICIALIZAÇÃO COMPLETA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Painel Administrativo inicializado com sucesso!');
    
    // Iniciar atualizações em tempo real
    iniciarAtualizacoesTempoReal();
    
    // Notificação de boas-vindas
    setTimeout(() => {
        mostrarMensagem('Bem-vindo ao Painel Administrativo Olive Leituras!', 'sucesso');
    }, 1000);
});

function iniciarAtualizacoesTempoReal() {
    // Atualizar último acesso a cada minuto
    setInterval(() => {
        atualizarDisplayUltimoAcesso();
    }, 60000);
}