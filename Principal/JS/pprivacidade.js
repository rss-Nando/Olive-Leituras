class PoliticaPrivacidade {
    constructor() {
        this.menuLinks = document.querySelectorAll('.menu-rapido a');
        this.secoes = document.querySelectorAll('.secao');
        
        this.init();
    }
    
    init() {
        // Ativar link ativo no menu rápido
        this.observarSecoes();
        
        // Adicionar smooth scroll para links do menu
        this.configurarScrollSuave();
        
        // Adicionar funcionalidade de impressão
        this.configurarImpressao();
    }
    
    observarSecoes() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.atualizarLinkAtivo(entry.target.id);
                }
            });
        }, { threshold: 0.5 });
        
        this.secoes.forEach(secao => {
            if (secao.id) {
                observer.observe(secao);
            }
        });
    }
    
    atualizarLinkAtivo(idSecao) {
        this.menuLinks.forEach(link => {
            link.classList.remove('ativo');
            if (link.getAttribute('href') === `#${idSecao}`) {
                link.classList.add('ativo');
            }
        });
    }
    
    configurarScrollSuave() {
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    configurarImpressao() {
        // Adicionar botão de impressão (opcional)
        const botaoImprimir = document.createElement('button');
        botaoImprimir.textContent = '📄 Imprimir Política';
        botaoImprimir.className = 'botao-imprimir';
        botaoImprimir.addEventListener('click', () => window.print());
        
        const cabecalho = document.querySelector('.cabecalho-politica .container');
        cabecalho.appendChild(botaoImprimir);
    }
}

// CSS adicional para o botão de impressão
const estiloAdicional = document.createElement('style');
estiloAdicional.textContent = `
    .botao-imprimir {
        background: linear-gradient(135deg, var(--dourado-principal) 0%, var(--dourado-secundario) 100%);
        color: var(--marrom-escuro);
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        font-family: 'Jacques Francois', serif;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 15px;
        box-shadow: var(--sombra-suave);
    }
    
    .botao-imprimir:hover {
        transform: translateY(-2px);
        box-shadow: var(--sombra-media);
    }
    
    .menu-rapido nav a.ativo {
        background: var(--dourado-principal);
        color: var(--marrom-escuro);
        font-weight: bold;
    }
    
    @media print {
        .menu-rapido, .botao-imprimir, .rodape-politica .links-uteis {
            display: none;
        }
        
        body {
            background: white !important;
            color: black !important;
        }
        
        .cabecalho-politica {
            background: white !important;
            color: black !important;
            border-bottom: 2px solid black;
        }
        
        .cabecalho-politica h1 {
            background: none !important;
            -webkit-text-fill-color: black !important;
            color: black !important;
        }
    }
`;
document.head.appendChild(estiloAdicional);

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new PoliticaPrivacidade();
});

// Funcionalidades específicas do footer da política de privacidade
class FooterPolitica {
    constructor() {
        this.botaoVoltar = document.querySelector('.botao-voltar');
        this.linksLegais = document.querySelectorAll('.links-legais a');
        
        this.init();
    }
    
    init() {
        this.configurarAnimacaoBotao();
        this.configurarLinksExternos();
        this.adicionarConfiancaVisual();
    }
    
    configurarAnimacaoBotao() {
        this.botaoVoltar.addEventListener('mouseenter', () => {
            const svg = this.botaoVoltar.querySelector('svg');
            svg.style.transform = 'translateX(-3px)';
        });
        
        this.botaoVoltar.addEventListener('mouseleave', () => {
            const svg = this.botaoVoltar.querySelector('svg');
            svg.style.transform = 'translateX(0)';
        });
    }
    
    configurarLinksExternos() {
        this.linksLegais.forEach(link => {
            // Adicionar indicador visual para links externos
            if (link.href && !link.href.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                
                const icon = document.createElement('span');
                icon.innerHTML = ' ↗';
                icon.style.fontSize = '0.8em';
                link.appendChild(icon);
            }
        });
    }
    
    adicionarConfiancaVisual() {
        // Adicionar selo visual de segurança
        const selo = document.createElement('div');
        selo.className = 'selo-seguranca';
        selo.innerHTML = `
            <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                <p style="margin: 0; font-size: 0.8rem; opacity: 0.8;">
                    🔒 Sua privacidade está protegida
                </p>
            </div>
        `;
        
        document.querySelector('.info-empresa').appendChild(selo);
    }
}

// Inicializar funcionalidades do footer
document.addEventListener('DOMContentLoaded', () => {
    new FooterPolitica();
});