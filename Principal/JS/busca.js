//SOCORRO!!! PELO AMOR DE DEUS!!! EU NÃO AGUENTO MAAAAAAAAIS!!!


// Base de dados completa com TODOS os volumes atuais
const dadosBusca = [
    // HQs e Graphic Novels (7 volumes)
    {
        id: 1,
        titulo: "Batman Ano Um",
        autor: "Frank Miller",
        tipo: "HQ",
        imagem: "../imagensCatalogo/batmanAnoUm.png",
        link: "batmanY1.html"
    },
    {
        id: 2,
        titulo: "Batman Cavaleiro das Trevas",
        autor: "Frank Miller",
        tipo: "HQ",
        imagem: "../imagensCatalogo/batmanCavaleiroDasTrevas.png",
        link: "batmanCdT.html"
    },
    {
        id: 3,
        titulo: "Batman Longo Dia das Bruxas Parte 1",
        autor: "Jeph Loeb",
        tipo: "HQ",
        imagem: "../imagensCatalogo/batmanDiaDasBruxas_1.png",
        link: "batmanLDdB1.html"
    },
    {
        id: 4,
        titulo: "Batman Longo Dia das Bruxas Parte 2",
        autor: "Jeph Loeb",
        tipo: "HQ",
        imagem: "../imagensCatalogo/batmanDiaDasBruxas_2.png",
        link: "batmanLDdB2.html"
    },
    {
        id: 5,
        titulo: "Watchmen: The Deluxe Edition",
        autor: "Alan Moore",
        tipo: "HQ",
        imagem: "../imagensCatalogo/watchmen.png",
        link: "watchmen.html"
    },
    {
        id: 6,
        titulo: "Batman: A Piada Mortal: Edição Absoluta",
        autor: "Alan Moore",
        tipo: "HQ",
        imagem: "../imagensCatalogo/batmanAPM.png",
        link: "batmanAPM.html"
    },
    {
        id: 7,
        titulo: "V de Vingança",
        autor: "Alan Moore",
        tipo: "HQ",
        imagem: "../imagensCatalogo/Vdivinganca.png",
        link: "Vvinganca.html"
    },

    // Fantasia - Tolkien (4 volumes)
    {
        id: 8,
        titulo: "O Senhor dos Anéis: A Sociedade do Anel",
        autor: "J.R.R. Tolkien",
        tipo: "Livro",
        imagem: "../imagensCatalogo/lotr1.png",
        link: "lotr1.html"
    },
    {
        id: 9,
        titulo: "O Senhor dos Anéis: As Duas Torres",
        autor: "J.R.R. Tolkien",
        tipo: "Livro",
        imagem: "../imagensCatalogo/lotr2.png",
        link: "lotr2.html"
    },
    {
        id: 10,
        titulo: "O Senhor dos Anéis: O Retorno do Rei",
        autor: "J.R.R. Tolkien",
        tipo: "Livro",
        imagem: "../imagensCatalogo/lotr3.png",
        link: "lotr3.html"
    },
    {
        id: 11,
        titulo: "O Hobbit",
        autor: "J.R.R. Tolkien",
        tipo: "Livro",
        imagem: "../imagensCatalogo/oHobbit.png",
        link: "oHobbit.html"
    },

    // Série Supernova (3 volumes)
    {
        id: 12,
        titulo: "Supernova 1 - O Encantador de Flechas",
        autor: "Renan Carvalho",
        tipo: "Livro",
        imagem: "../imagensCatalogo/supernova1.png",
        link: "supernova1.html"
    },
    {
        id: 13,
        titulo: "Supernova 2 - A Estrela dos Mortos",
        autor: "Renan Carvalho",
        tipo: "Livro",
        imagem: "../imagensCatalogo/supernova2.png",
        link: "supernova2.html"
    },
    {
        id: 14,
        titulo: "Supernova 3 - O Satélite de Ferro",
        autor: "Renan Carvalho",
        tipo: "Livro",
        imagem: "../imagensCatalogo/supernova3.jpg",
        link: "supernova3.html"
    },

    // Horror (1 volume)
    {
        id: 15,
        titulo: "O Chamado de Cthulhu",
        autor: "H.P. Lovecraft",
        tipo: "Livro",
        imagem: "../imagensCatalogo/cthulhu.png",
        link: "lovecraft.html" // CORREÇÃO: link correto para Lovecraft
    }
];

class HeaderInterativo {
    constructor() {
        this.header = document.querySelector('.cabecalho');
        this.formBusca = document.querySelector('.form-busca');
        this.inputBusca = document.querySelector('#campo-busca');
        this.resultadosContainer = document.querySelector('#resultados-busca');
        
        this.ultimoScrollY = 0;
        this.escondido = false;
        this.timeoutBusca = null;
        
        this.init();
    }
    
    init() {
        // Configurar busca
        this.formBusca.addEventListener('submit', (e) => this.handleSubmit(e));
        this.inputBusca.addEventListener('input', (e) => this.handleInput(e));
        this.inputBusca.addEventListener('focus', () => this.mostrarResultados());
        document.addEventListener('click', (e) => this.handleClickOutside(e));
        
        // Configurar scroll behavior
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Criar área de trigger para hover
        this.criarAreaTrigger();
        
        // Ajustar posição dos resultados
        this.ajustarPosicaoResultados();
    }
    
    ajustarPosicaoResultados() {
        const headerHeight = this.header.offsetHeight;
        this.resultadosContainer.style.top = `${headerHeight + 5}px`;
    }
    
    criarAreaTrigger() {
        const areaTrigger = document.createElement('div');
        areaTrigger.className = 'area-trigger-header';
        areaTrigger.addEventListener('mouseenter', () => this.mostrarHeader());
        document.body.appendChild(areaTrigger);
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        const scrollDelta = scrollY - this.ultimoScrollY;
        
        // Esconder header ao rolar para baixo, mostrar ao rolar para cima
        if (scrollDelta > 5 && scrollY > 100 && !this.escondido) {
            this.esconderHeader();
        } else if (scrollDelta < -5 && this.escondido) {
            this.mostrarHeader();
        }
        
        this.ultimoScrollY = scrollY;
    }
    
    esconderHeader() {
        this.header.classList.add('escondido');
        this.escondido = true;
        this.esconderResultados();
    }
    
    mostrarHeader() {
        this.header.classList.remove('escondido');
        this.escondido = false;
        setTimeout(() => this.ajustarPosicaoResultados(), 10);
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const termo = this.inputBusca.value.trim();
        
        if (termo) {
            this.realizarBusca(termo);
            setTimeout(() => this.inputBusca.focus(), 100);
        }
    }
    
    handleInput(e) {
        const termo = e.target.value.trim();
        
        // Debounce para evitar buscas muito frequentes
        clearTimeout(this.timeoutBusca);
        
        if (termo.length >= 2) {
            this.timeoutBusca = setTimeout(() => {
                this.realizarBusca(termo);
            }, 300);
        } else {
            this.esconderResultados();
        }
    }
    
    realizarBusca(termo) {
        // Simular loading
        this.formBusca.classList.add('busca-carregando');
        
        // Simular delay de API
        setTimeout(() => {
            const resultados = this.filtrarResultados(termo);
            this.exibirResultados(resultados);
            this.formBusca.classList.remove('busca-carregando');
        }, 200);
    }
    
    filtrarResultados(termo) {
        const termoLower = termo.toLowerCase();
        
        // Busca por relevância
        const resultadosComRelevancia = dadosBusca.map(item => {
            let relevancia = 0;
            
            // Título - maior peso
            if (item.titulo.toLowerCase().includes(termoLower)) {
                relevancia += 3;
                // Bonus se começar com o termo
                if (item.titulo.toLowerCase().startsWith(termoLower)) {
                    relevancia += 2;
                }
            }
            
            // Autor - peso médio
            if (item.autor.toLowerCase().includes(termoLower)) {
                relevancia += 2;
            }
            
            // Tipo - menor peso
            if (item.tipo.toLowerCase().includes(termoLower)) {
                relevancia += 1;
            }
            
            return { ...item, relevancia };
        }).filter(item => item.relevancia > 0)
          .sort((a, b) => b.relevancia - a.relevancia);
        
        return resultadosComRelevancia;
    }
    
    exibirResultados(resultados) {
        this.resultadosContainer.innerHTML = '';
        
        if (resultados.length === 0) {
            this.resultadosContainer.innerHTML = `
                <div class="resultados-vazios">
                    <p>🔍 Nenhum resultado encontrado para</p>
                    <p>"<strong>${this.inputBusca.value}</strong>"</p>
                    <p style="margin-top: 10px; font-size: 12px; opacity: 0.7;">
                        Tente buscar por título, autor ou tipo (HQ/Livro)
                    </p>
                </div>
            `;
        } else {
            resultados.forEach(item => {
                const elemento = this.criarElementoResultado(item);
                this.resultadosContainer.appendChild(elemento);
            });
        }
        
        this.mostrarResultados();
    }
    
    criarElementoResultado(item) {
        const div = document.createElement('div');
        div.className = 'resultado-item';
        div.innerHTML = `
            <img src="${item.imagem}" alt="${item.titulo}" class="resultado-imagem" onerror="this.style.display='none'">
            <div class="resultado-info">
                <h4>${this.destacarTermo(item.titulo, this.inputBusca.value)}</h4>
                <p>${this.destacarTermo(item.autor, this.inputBusca.value)} • ${item.tipo}</p>
            </div>
        `;
        
        div.addEventListener('click', () => {
            window.location.href = item.link;
        });
        
        // Navegação por teclado
        div.setAttribute('tabindex', '0');
        div.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                window.location.href = item.link;
            }
        });
        
        return div;
    }
    
    destacarTermo(texto, termo) {
        if (!termo.trim()) return texto;
        
        const regex = new RegExp(`(${this.escapeRegex(termo)})`, 'gi');
        return texto.replace(regex, '<mark>$1</mark>');
    }
    
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    mostrarResultados() {
        this.resultadosContainer.hidden = false;
        this.ajustarPosicaoResultados();
    }
    
    esconderResultados() {
        this.resultadosContainer.hidden = true;
    }
    
    handleClickOutside(e) {
        if (!this.formBusca.contains(e.target) && !this.resultadosContainer.contains(e.target)) {
            this.esconderResultados();
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new HeaderInterativo();
});

// Adicionar CSS para o mark (destaque do termo buscado)
const estilo = document.createElement('style');
estilo.textContent = `
    mark {
        background: linear-gradient(135deg, var(--dourado-principal) 0%, var(--dourado-secundario) 100%);
        color: var(--marrom-escuro);
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: bold;
    }
    
    .resultado-item mark {
        background: var(--dourado-principal);
    }
    
    .resultados-vazios {
        padding: 30px 20px;
        text-align: center;
        color: var(--marrom-medio);
        font-style: italic;
        line-height: 1.5;
    }
    
    .resultados-vazios strong {
        color: var(--marrom-escuro);
        font-weight: bold;
    }
`;
document.head.appendChild(estilo);