import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, MapPin, Wrench, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchItem {
  title: string;
  path: string;
  category: "servico" | "cidade" | "bairro" | "pagina";
  keywords: string[];
}

const searchData: SearchItem[] = [
  // Serviços
  { title: "Formatação de Computador", path: "/servicos/formatacao", category: "servico", keywords: ["formatar", "windows", "reinstalar", "lento", "formatação"] },
  { title: "Remoção de Vírus", path: "/servicos/remocao-de-virus", category: "servico", keywords: ["virus", "malware", "trojan", "infectado", "lento", "popup"] },
  { title: "Upgrade de SSD e RAM", path: "/servicos/upgrade-ssd-ram", category: "servico", keywords: ["ssd", "ram", "memória", "lento", "upgrade", "hd"] },
  { title: "Manutenção de computador e notebook", path: "/servicos/manutencao-de-computador", category: "servico", keywords: ["conserto", "notebook", "pc", "desktop", "não liga", "quebrado"] },
  { title: "Computador Lento", path: "/servicos/computador-lento", category: "servico", keywords: ["lento", "travando", "demora", "devagar"] },
  { title: "Computador Não Liga", path: "/servicos/computador-nao-liga", category: "servico", keywords: ["não liga", "desligado", "morto", "tela preta"] },
  { title: "Conserto de TV", path: "/servicos/conserto-tv", category: "servico", keywords: ["tv", "televisão", "tela", "lcd", "led", "smart tv", "não liga"] },
  { title: "Conserto de Celular", path: "/servicos/conserto-celular", category: "servico", keywords: ["celular", "smartphone", "iphone", "samsung", "tela quebrada", "bateria"] },
  { title: "Manutenção de TV", path: "/servicos/manutencao-tv", category: "servico", keywords: ["tv", "manutenção", "televisão"] },
  { title: "Conserto de Placa", path: "/servicos/conserto-placa", category: "servico", keywords: ["placa", "mãe", "placa-mãe", "componente"] },
  { title: "Montagem de PC", path: "/servicos/montagem-pc", category: "servico", keywords: ["montar", "montagem", "pc gamer", "desktop", "personalizado"] },
  { title: "Redes e Wi-Fi", path: "/servicos/redes-e-wifi", category: "servico", keywords: ["wifi", "wi-fi", "rede", "internet", "roteador", "cabo", "sem sinal"] },
  { title: "Recuperação de dados", path: "/servicos/recuperacao-de-dados", category: "servico", keywords: ["backup", "dados", "recuperar", "arquivo", "perdido", "hd"] },
  { title: "CFTV / Câmeras de Segurança", path: "/cftv", category: "servico", keywords: ["câmera", "cftv", "segurança", "vigilância", "monitoramento"] },

  // Cidades
  { title: "Técnico em Curitiba", path: "/tecnico-informatica-curitiba", category: "cidade", keywords: ["curitiba", "ctba"] },
  { title: "Técnico em São José dos Pinhais", path: "/tecnico-informatica-sao-jose-pinhais", category: "cidade", keywords: ["são josé", "sjp", "pinhais"] },
  { title: "Técnico em Araucária", path: "/tecnico-informatica-araucaria", category: "cidade", keywords: ["araucária"] },
  { title: "Técnico em Colombo", path: "/tecnico-informatica-colombo", category: "cidade", keywords: ["colombo"] },
  { title: "Técnico em Pinhais", path: "/tecnico-informatica-pinhais", category: "cidade", keywords: ["pinhais"] },
  { title: "Técnico em Campo Largo", path: "/tecnico-informatica-campo-largo", category: "cidade", keywords: ["campo largo"] },
  { title: "Técnico em Fazenda Rio Grande", path: "/tecnico-informatica-fazenda-rio-grande", category: "cidade", keywords: ["fazenda rio grande", "frg"] },
  { title: "Técnico em Almirante Tamandaré", path: "/tecnico-informatica-almirante-tamandare", category: "cidade", keywords: ["tamandaré", "almirante"] },
  { title: "Técnico em Piraquara", path: "/tecnico-informatica-piraquara", category: "cidade", keywords: ["piraquara"] },
  { title: "Técnico em Campo Magro", path: "/tecnico-informatica-campo-magro", category: "cidade", keywords: ["campo magro"] },
  { title: "Técnico em Quatro Barras", path: "/tecnico-informatica-quatro-barras", category: "cidade", keywords: ["quatro barras"] },

  // Bairros de Curitiba
  { title: "Técnico no Centro – Curitiba", path: "/bairros/centro", category: "bairro", keywords: ["centro", "curitiba"] },
  { title: "Técnico no Batel – Curitiba", path: "/bairros/batel", category: "bairro", keywords: ["batel", "curitiba"] },
  { title: "Técnico no Portão – Curitiba", path: "/bairros/portao", category: "bairro", keywords: ["portão", "curitiba"] },
  { title: "Técnico em Santa Felicidade", path: "/bairros/santa-felicidade", category: "bairro", keywords: ["santa felicidade", "curitiba"] },
  { title: "Técnico na Água Verde", path: "/bairros/agua-verde", category: "bairro", keywords: ["água verde", "curitiba"] },
  { title: "Técnico no Bigorrilho", path: "/bairros/bigorrilho", category: "bairro", keywords: ["bigorrilho", "curitiba"] },
  { title: "Técnico no CIC", path: "/bairros/cic", category: "bairro", keywords: ["cic", "cidade industrial", "curitiba"] },
  { title: "Técnico no Cajuru", path: "/bairros/cajuru", category: "bairro", keywords: ["cajuru", "curitiba"] },
  { title: "Técnico no Boqueirão", path: "/bairros/boqueirao", category: "bairro", keywords: ["boqueirão", "curitiba"] },
  { title: "Técnico no Xaxim", path: "/bairros/xaxim", category: "bairro", keywords: ["xaxim", "curitiba"] },
  { title: "Técnico no Pinheirinho", path: "/bairros/pinheirinho", category: "bairro", keywords: ["pinheirinho", "curitiba"] },
  { title: "Técnico no Uberaba", path: "/bairros/uberaba", category: "bairro", keywords: ["uberaba", "curitiba"] },
  { title: "Técnico no Hauer", path: "/bairros/hauer", category: "bairro", keywords: ["hauer", "curitiba"] },
  { title: "Técnico no Bacacheri", path: "/bairros/bacacheri", category: "bairro", keywords: ["bacacheri", "curitiba"] },
  { title: "Técnico no Rebouças", path: "/bairros/reboucas", category: "bairro", keywords: ["rebouças", "curitiba"] },
  { title: "Técnico no Seminário", path: "/bairros/seminario", category: "bairro", keywords: ["seminário", "curitiba"] },
  { title: "Técnico no Campo Comprido", path: "/bairros/campo-comprido", category: "bairro", keywords: ["campo comprido", "curitiba"] },
  { title: "Técnico no Alto da Glória", path: "/bairros/alto-da-gloria", category: "bairro", keywords: ["alto da glória", "curitiba"] },
  { title: "Técnico na Vila Izabel", path: "/bairros/vila-izabel", category: "bairro", keywords: ["vila izabel", "curitiba"] },
  { title: "Técnico no Hugo Lange", path: "/bairros/hugo-lange", category: "bairro", keywords: ["hugo lange", "curitiba"] },
  { title: "Técnico no Novo Mundo", path: "/bairros/novo-mundo", category: "bairro", keywords: ["novo mundo", "curitiba"] },
  { title: "Técnico no Sítio Cercado", path: "/bairros/sitio-cercado", category: "bairro", keywords: ["sítio cercado", "curitiba"] },
  { title: "Técnico no Tarumã", path: "/bairros/taruma", category: "bairro", keywords: ["tarumã", "curitiba"] },
  { title: "Técnico no Mercês", path: "/bairros/merces", category: "bairro", keywords: ["mercês", "curitiba"] },
  { title: "Técnico no Juvevê", path: "/bairros/juveve", category: "bairro", keywords: ["juvevê", "curitiba"] },
  { title: "Técnico no Cabral", path: "/bairros/cabral", category: "bairro", keywords: ["cabral", "curitiba"] },
  { title: "Técnico no Cristo Rei", path: "/bairros/cristo-rei", category: "bairro", keywords: ["cristo rei", "curitiba"] },
  { title: "Técnico no Boa Vista", path: "/bairros/boa-vista", category: "bairro", keywords: ["boa vista", "curitiba"] },
  { title: "Técnico no Tingui", path: "/bairros/tingui", category: "bairro", keywords: ["tingui", "curitiba"] },
  { title: "Técnico no Jardim das Américas", path: "/bairros/jardim-das-americas", category: "bairro", keywords: ["jardim das américas", "curitiba"] },
  { title: "Técnico no Jardim Social", path: "/bairros/jardim-social", category: "bairro", keywords: ["jardim social", "curitiba"] },
  { title: "Técnico na Fazendinha", path: "/bairros/fazendinha", category: "bairro", keywords: ["fazendinha", "curitiba"] },
  { title: "Técnico no Capão da Imbuia", path: "/bairros/capao-da-imbuia", category: "bairro", keywords: ["capão da imbuia", "curitiba"] },
  { title: "Técnico no Alto Boqueirão", path: "/bairros/alto-boqueirao", category: "bairro", keywords: ["alto boqueirão", "curitiba"] },
  { title: "Técnico no São Francisco", path: "/bairros/sao-francisco", category: "bairro", keywords: ["são francisco", "curitiba"] },

  // Bairros de SJP
  { title: "Técnico no Centro – SJP", path: "/tecnico-informatica-sao-jose-pinhais", category: "bairro", keywords: ["centro", "sjp", "são josé"] },
  { title: "Técnico no Afonso Pena – SJP", path: "/bairros/afonso-pena", category: "bairro", keywords: ["afonso pena", "sjp", "aeroporto"] },
  { title: "Técnico no Guatupê – SJP", path: "/bairros/guatupe", category: "bairro", keywords: ["guatupê", "sjp"] },
  { title: "Técnico no Aristocrata – SJP", path: "/bairros/aristocrata", category: "bairro", keywords: ["aristocrata", "sjp"] },
  { title: "Técnico na Costeira – SJP", path: "/bairros/costeira", category: "bairro", keywords: ["costeira", "sjp"] },
  { title: "Técnico na Aviação – SJP", path: "/bairros/aviacao", category: "bairro", keywords: ["aviação", "sjp"] },
  { title: "Técnico no Del Rey – SJP", path: "/bairros/del-rey", category: "bairro", keywords: ["del rey", "sjp"] },
  { title: "Técnico no Cidade Jardim – SJP", path: "/bairros/cidade-jardim-sjp", category: "bairro", keywords: ["cidade jardim", "sjp"] },
  { title: "Técnico no Ouro Fino – SJP", path: "/bairros/ouro-fino-sjp", category: "bairro", keywords: ["ouro fino", "sjp"] },
  { title: "Técnico no Quississana – SJP", path: "/bairros/quississana-sjp", category: "bairro", keywords: ["quississana", "sjp"] },

  // Bairros de Araucária
  { title: "Técnico no Centro – Araucária", path: "/bairros/centro-araucaria", category: "bairro", keywords: ["centro", "araucária"] },
  { title: "Técnico na Capela Velha – Araucária", path: "/bairros/capela-velha", category: "bairro", keywords: ["capela velha", "araucária"] },
  { title: "Técnico no Thomaz Coelho – Araucária", path: "/bairros/thomaz-coelho", category: "bairro", keywords: ["thomaz coelho", "araucária"] },
  { title: "Técnico na Chapada – Araucária", path: "/bairros/chapada", category: "bairro", keywords: ["chapada", "araucária"] },
  { title: "Técnico no Iguaçu – Araucária", path: "/bairros/iguacu-araucaria", category: "bairro", keywords: ["iguaçu", "araucária"] },
  { title: "Técnico na Campina da Barra", path: "/bairros/campina-da-barra", category: "bairro", keywords: ["campina da barra", "araucária"] },
  { title: "Técnico no Guajuvira – Araucária", path: "/bairros/guajuvira", category: "bairro", keywords: ["guajuvira", "araucária"] },
  { title: "Técnico na Cachoeira – Araucária", path: "/bairros/cachoeira-araucaria", category: "bairro", keywords: ["cachoeira", "araucária"] },
  { title: "Técnico no Thomaz Coelho II – Araucária", path: "/bairros/thomaz-coelho-ii", category: "bairro", keywords: ["thomaz coelho ii", "araucária"] },
  { title: "Técnico no Jd. Boa Vista – Araucária", path: "/bairros/jardim-boa-vista-araucaria", category: "bairro", keywords: ["jardim boa vista", "araucária"] },
  { title: "Técnico no São Miguel – Araucária", path: "/bairros/sao-miguel-araucaria", category: "bairro", keywords: ["são miguel", "araucária"] },
  { title: "Técnico na Califórnia – Araucária", path: "/bairros/california-araucaria", category: "bairro", keywords: ["califórnia", "araucária"] },
  { title: "Técnico na Vila Nova – Araucária", path: "/bairros/vila-nova-araucaria", category: "bairro", keywords: ["vila nova", "araucária"] },
  { title: "Técnico no Industrial – Araucária", path: "/bairros/industrial-araucaria", category: "bairro", keywords: ["industrial", "araucária"] },
  { title: "Técnico no Jd. Iguaçu – Araucária", path: "/bairros/jardim-iguacu-araucaria", category: "bairro", keywords: ["jardim iguaçu", "araucária"] },
  { title: "Técnico no Jd. Shangri-lá – Araucária", path: "/bairros/jardim-shangrila-araucaria", category: "bairro", keywords: ["shangri-lá", "araucária"] },

  // Bairros de Campo Largo
  { title: "Técnico no Centro – Campo Largo", path: "/bairros/centro-campo-largo", category: "bairro", keywords: ["centro", "campo largo"] },
  { title: "Técnico na Ferraria – Campo Largo", path: "/bairros/ferraria", category: "bairro", keywords: ["ferraria", "campo largo"] },
  { title: "Técnico no Jd. Guilhermina – CL", path: "/bairros/jardim-guilhermina", category: "bairro", keywords: ["guilhermina", "campo largo"] },
  { title: "Técnico no Ouro Fino – Campo Largo", path: "/bairros/ouro-fino", category: "bairro", keywords: ["ouro fino", "campo largo"] },
  { title: "Técnico no Itaqui – Campo Largo", path: "/bairros/itaqui", category: "bairro", keywords: ["itaqui", "campo largo"] },
  { title: "Técnico nas Bateias – Campo Largo", path: "/bairros/bateias", category: "bairro", keywords: ["bateias", "campo largo"] },
  { title: "Técnico no Jd. Laranjeiras – CL", path: "/bairros/jardim-laranjeiras-cl", category: "bairro", keywords: ["laranjeiras", "campo largo"] },
  { title: "Técnico no São Marcos – Campo Largo", path: "/bairros/sao-marcos-campo-largo", category: "bairro", keywords: ["são marcos", "campo largo"] },
  { title: "Técnico no São José – Campo Largo", path: "/bairros/sao-jose-campo-largo", category: "bairro", keywords: ["são josé", "campo largo"] },
  { title: "Técnico no Jd. Esperança – CL", path: "/bairros/jardim-esperanca-cl", category: "bairro", keywords: ["esperança", "campo largo"] },
  { title: "Técnico na Lamenha Grande – CL", path: "/bairros/lamenha-grande-cl", category: "bairro", keywords: ["lamenha", "campo largo"] },
  { title: "Técnico na Vila Cândida – CL", path: "/bairros/vila-candida-cl", category: "bairro", keywords: ["vila cândida", "campo largo"] },
  { title: "Técnico na Timbotuva – CL", path: "/bairros/timbotuva-cl", category: "bairro", keywords: ["timbotuva", "campo largo"] },

  // Bairros de Colombo
  { title: "Técnico no Centro – Colombo", path: "/bairros/centro-colombo", category: "bairro", keywords: ["centro", "colombo"] },
  { title: "Técnico no Maracanã – Colombo", path: "/bairros/maracana-colombo", category: "bairro", keywords: ["maracanã", "colombo"] },
  { title: "Técnico no Guaraituba – Colombo", path: "/bairros/guaraituba-colombo", category: "bairro", keywords: ["guaraituba", "colombo"] },
  { title: "Técnico no Palmital – Colombo", path: "/bairros/palmital-colombo", category: "bairro", keywords: ["palmital", "colombo"] },
  { title: "Técnico no Atuba – Colombo", path: "/bairros/atuba-colombo", category: "bairro", keywords: ["atuba", "colombo"] },
  { title: "Técnico no Fátima – Colombo", path: "/bairros/fatima-colombo", category: "bairro", keywords: ["fátima", "colombo"] },
  { title: "Técnico no Gabirobal – Colombo", path: "/bairros/gabirobal", category: "bairro", keywords: ["gabirobal", "colombo"] },

  // Bairros de Pinhais
  { title: "Técnico no Centro – Pinhais", path: "/bairros/centro-pinhais", category: "bairro", keywords: ["centro", "pinhais"] },
  { title: "Técnico no Weissópolis – Pinhais", path: "/bairros/weissopolis", category: "bairro", keywords: ["weissópolis", "pinhais"] },
  { title: "Técnico no Pineville – Pinhais", path: "/bairros/pineville", category: "bairro", keywords: ["pineville", "pinhais"] },
  { title: "Técnico no Emiliano Perneta – Pinhais", path: "/bairros/emiliano-perneta", category: "bairro", keywords: ["emiliano perneta", "pinhais"] },
  { title: "Técnico no Estância – Pinhais", path: "/bairros/estancia-pinhais", category: "bairro", keywords: ["estância", "pinhais"] },
  { title: "Técnico no Alto Tarumã – Pinhais", path: "/bairros/alto-taruma", category: "bairro", keywords: ["alto tarumã", "pinhais"] },
  { title: "Técnico no Palmital – Pinhais", path: "/bairros/palmital-pinhais", category: "bairro", keywords: ["palmital", "pinhais"] },
  { title: "Técnico no Jardim Cláudia – Pinhais", path: "/bairros/jardim-claudia", category: "bairro", keywords: ["jardim cláudia", "pinhais"] },
  { title: "Técnico no Jd. Pedro Demeterco – Pinhais", path: "/bairros/jardim-pedro-demeterco", category: "bairro", keywords: ["pedro demeterco", "pinhais"] },
  { title: "Técnico no Jd. Karla – Pinhais", path: "/bairros/jardim-karla-pinhais", category: "bairro", keywords: ["jardim karla", "pinhais"] },
  { title: "Técnico no Jd. Wissinger – Pinhais", path: "/bairros/jardim-wissinger-pinhais", category: "bairro", keywords: ["wissinger", "pinhais"] },
  { title: "Técnico na Vila Amélia – Pinhais", path: "/bairros/vila-amelia-pinhais", category: "bairro", keywords: ["vila amélia", "pinhais"] },
  { title: "Técnico no Jd. Esplanada – Pinhais", path: "/bairros/jardim-esplanada-pinhais", category: "bairro", keywords: ["esplanada", "pinhais"] },
  { title: "Técnico no Jd. Dona Rosa – Pinhais", path: "/bairros/jardim-dona-rosa-pinhais", category: "bairro", keywords: ["dona rosa", "pinhais"] },
  { title: "Técnico no Jd. Tropical – Pinhais", path: "/bairros/jardim-tropical-pinhais", category: "bairro", keywords: ["tropical", "pinhais"] },

  // Páginas gerais
  { title: "Como Funciona o Atendimento", path: "/como-funciona", category: "pagina", keywords: ["como funciona", "atendimento", "processo"] },
  { title: "Preços e Políticas", path: "/precos-e-politicas", category: "pagina", keywords: ["preço", "valor", "quanto custa", "tabela", "política"] },
  { title: "Diagnóstico Técnico", path: "/diagnostico-tecnico", category: "pagina", keywords: ["diagnóstico", "avaliação", "Valor do atendimento"] },
  { title: "Atendimento a Domicílio", path: "/atendimento-domicilio", category: "pagina", keywords: ["domicílio", "casa", "residência", "visita"] },
  { title: "Coleta e Entrega", path: "/coleta-e-entrega", category: "pagina", keywords: ["coleta", "entrega", "buscar", "levar"] },
  { title: "Atendimento Remoto", path: "/atendimento-remoto", category: "pagina", keywords: ["remoto", "online", "distância", "teamviewer"] },
  { title: "Suporte técnico empresarial", path: "/servicos/suporte-tecnico-empresarial", category: "pagina", keywords: ["empresa", "corporativo", "contrato", "mensal"] },
  { title: "Blog", path: "/blog", category: "pagina", keywords: ["blog", "artigo", "dicas", "tutorial"] },
  { title: "FAQ – Perguntas Frequentes", path: "/faq", category: "pagina", keywords: ["faq", "pergunta", "dúvida", "ajuda"] },
  { title: "Sobre Nós", path: "/sobre", category: "pagina", keywords: ["sobre", "quem somos", "história"] },
  { title: "Contato", path: "/contato", category: "pagina", keywords: ["contato", "telefone", "endereço", "email"] },
  { title: "Equipamentos Atendidos", path: "/equipamentos-atendidos", category: "pagina", keywords: ["equipamento", "marca", "modelo", "notebook", "desktop"] },
];

const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const categoryIcon = {
  servico: Wrench,
  cidade: MapPin,
  bairro: MapPin,
  pagina: FileText,
};

const categoryLabel = {
  servico: "Serviço",
  cidade: "Cidade",
  bairro: "Bairro",
  pagina: "Página",
};

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartSearch = ({ isOpen, onClose }: SmartSearchProps) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = normalize(query);
    const words = q.split(/\s+/).filter(Boolean);

    return searchData
      .map((item) => {
        const titleNorm = normalize(item.title);
        const keywordsNorm = item.keywords.map(normalize);
        let score = 0;

        for (const word of words) {
          if (titleNorm.includes(word)) score += 10;
          if (titleNorm.startsWith(word)) score += 5;
          for (const kw of keywordsNorm) {
            if (kw.includes(word)) score += 5;
            if (kw === word) score += 8;
          }
        }
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && results[selectedIndex]) {
        navigate(results[selectedIndex].path);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, navigate, onClose]);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleGlobal = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent("openSmartSearch"));
      }
    };
    window.addEventListener("keydown", handleGlobal);
    return () => window.removeEventListener("keydown", handleGlobal);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
      <div
        className="relative w-full max-w-xl mx-4 bg-background rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar serviço, bairro ou cidade..."
            className="flex-1 bg-transparent text-foreground text-base outline-hidden placeholder:text-muted-foreground"
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md border border-border">
            ESC
          </kbd>
          <button onClick={onClose} className="sm:hidden p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="px-5 py-10 text-center text-muted-foreground">
              <p className="text-sm">Nenhum resultado para "<strong className="text-foreground">{query}</strong>"</p>
              <p className="text-xs mt-1">Tente buscar por "formatação", "batel" ou "conserto de tv"</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              {results.map((item, i) => {
                const Icon = categoryIcon[item.category];
                return (
                  <button
                    key={item.path}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                      i === selectedIndex
                        ? "bg-accent/10 text-accent"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                    onClick={() => { navigate(item.path); onClose(); }}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 ${i === selectedIndex ? "text-accent" : "text-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{categoryLabel[item.category]}</p>
                    </div>
                    <ArrowRight className={`h-3.5 w-3.5 flex-shrink-0 transition-opacity ${i === selectedIndex ? "opacity-100" : "opacity-0"}`} />
                  </button>
                );
              })}
            </div>
          )}

          {!query.trim() && (
            <div className="px-5 py-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Buscas populares</p>
              <div className="flex flex-wrap gap-2">
                {["Formatação", "Conserto de TV", "Vírus", "Batel", "SSD", "Wi-Fi", "Notebook", "Celular"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-border bg-muted/30 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px]">↑↓</kbd> navegar
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px]">Enter</kbd> abrir
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px]">Ctrl+K</kbd> buscar
          </span>
        </div>
      </div>
    </div>
  );
};
