document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    
    // Credenciais do administrador (fixas, porque eu ia precisar de banco de dados para fazer o cadastramento)
    const ADMIN_EMAIL = 'admin@olivemail.com';
    const ADMIN_SENHA = 'adminadmin';
    const ADMIN_PAGE = 'admin.html'; // Página do painel administrativo
    
    // Função para exibir mensagens
    function exibirMensagem(mensagem, tipo) {
        // Remove mensagens existentes
        const mensagemExistente = document.querySelector('.mensagem');
        if (mensagemExistente) {
            mensagemExistente.remove();
        }
        
        // Cria nova mensagem
        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = `mensagem ${tipo}`;
        mensagemDiv.textContent = mensagem;
        
        // Insere antes do formulário
        loginForm.parentNode.insertBefore(mensagemDiv, loginForm);
        
        // Remove após 5 segundos
        setTimeout(() => {
            if (mensagemDiv.parentNode) {
                mensagemDiv.remove();
            }
        }, 5000);
    }
    
    // Função para validar email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Função para simular loading
    function toggleLoading(estado) {
        const botao = loginForm.querySelector('.botao-login');
        if (estado) {
            botao.classList.add('carregando');
            botao.disabled = true;
            botao.textContent = 'Entrando...';
        } else {
            botao.classList.remove('carregando');
            botao.disabled = false;
            botao.textContent = 'Entrar';
        }
    }
    
    // Função principal de login - APENAS LOGIN FIXO
    function fazerLogin(email, senha) {
        // Validações básicas
        if (!email || !senha) {
            exibirMensagem('Por favor, preencha todos os campos.', 'erro');
            return false;
        }
        
        if (!validarEmail(email)) {
            exibirMensagem('Por favor, insira um email válido.', 'erro');
            return false;
        }
        
        // Verifica se é o admin (LOGIN FIXO)
        if (email === ADMIN_EMAIL && senha === ADMIN_SENHA) {
            exibirMensagem('Login administrativo realizado com sucesso! Redirecionando...', 'sucesso');
            
            // Simula delay para visualizar a mensagem
            setTimeout(() => {
                // Redireciona para a página administrativa
                window.location.href = ADMIN_PAGE;
            }, 1500);
            
            return true;
        } else {
            // APENAS UMA OPÇÃO DE LOGIN VÁLIDA
            exibirMensagem('Email ou senha incorretos. Use: admin@olivemail.com / adminadmin', 'erro');
            return false;
        }
    }
    
    // Event listener para o formulário
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        
        // Ativa estado de loading
        toggleLoading(true);
        
        // Simula delay de rede
        setTimeout(() => {
            fazerLogin(email, senha);
            toggleLoading(false);
        }, 1000);
    });
    
    // Validação em tempo real
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !validarEmail(email)) {
            this.style.borderColor = '#dc3545';
        } else {
            this.style.borderColor = '#B8860B';
        }
    });
    
    senhaInput.addEventListener('blur', function() {
        const senha = this.value.trim();
        if (senha && senha.length < 6) {
            this.style.borderColor = '#dc3545';
        } else {
            this.style.borderColor = '#B8860B';
        }
    });
    
    // Limpa validação ao focar
    emailInput.addEventListener('focus', function() {
        this.style.borderColor = '#B8860B';
    });
    
    senhaInput.addEventListener('focus', function() {
        this.style.borderColor = '#B8860B';
    });
    
    // Preenchimento automático para desenvolvimento (opcional)
    function preencherCredenciaisAdmin() {
        // Apenas em ambiente local para facilitar testes
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            emailInput.value = ADMIN_EMAIL;
            senhaInput.value = ADMIN_SENHA;
            
            console.log('Credenciais pré-preenchidas para testes:');
            console.log('Email: admin@olivemail.com');
            console.log('Senha: adminadmin');
        }
    }
    
    // Descomente a linha abaixo para preenchimento automático em desenvolvimento
    // preencherCredenciaisAdmin();
    
    // Adiciona instruções no console
    console.log('=== SISTEMA DE LOGIN OLIVE LEITURAS ===');
    console.log('Credenciais de acesso administrativo:');
    console.log('Email: admin@olivemail.com');
    console.log('Senha: adminadmin');
    console.log('==============================');
});

// Função global para verificar se está logado (pode ser usada em outras páginas)
function verificarLoginAdmin() {
    return localStorage.getItem('adminLogado') === 'true';
}

// Função para fazer logout (para usar no admin.html)
function fazerLogoutAdmin() {
    localStorage.removeItem('adminLogado');
    window.location.href = 'login.html';
}