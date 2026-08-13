import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { redirectRoutes } from "@/routes/redirectRoutes";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProblemaLocalSchema } from "@/components/problemas/ProblemaLocalSchema";
import { captureUtmsFromUrl } from "@/lib/utmCapture";
import { RouteLoader } from "@/components/RouteLoader";
import { RouteProgress } from "@/components/motion/RouteProgress";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import Index from "./pages/Index";

// Lazy-loaded pages for code splitting & faster initial load
const Servicos = lazy(() => import("./pages/Servicos"));
const AtendimentoDomicilio = lazy(() => import("./pages/AtendimentoDomicilio"));
const AtendimentoRemoto = lazy(() => import("./pages/AtendimentoRemoto"));

const PrecosEPoliticas = lazy(() => import("./pages/PrecosEPoliticas"));
const TecnicoInformaticaCuritiba = lazy(() => import("./pages/TecnicoInformaticaCuritiba"));
const TecnicoInformaticaSaoJosePinhais = lazy(() => import("./pages/TecnicoInformaticaSaoJosePinhais"));
const TecnicoInformaticaAraucaria = lazy(() => import("./pages/TecnicoInformaticaAraucaria"));
const TecnicoInformaticaCampoLargo = lazy(() => import("./pages/TecnicoInformaticaCampoLargo"));
const TecnicoInformaticaPinhais = lazy(() => import("./pages/TecnicoInformaticaPinhais"));
const Sobre = lazy(() => import("./pages/Sobre"));
const GestorResponsavel = lazy(() => import("./pages/GestorResponsavel"));
const Contato = lazy(() => import("./pages/Contato"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ComoFunciona = lazy(() => import("./pages/ComoFunciona"));
const DiagnosticoTecnico = lazy(() => import("./pages/DiagnosticoTecnico"));
const Diagnostico60s = lazy(() => import("./pages/Diagnostico60s"));
const EquipamentosAtendidos = lazy(() => import("./pages/EquipamentosAtendidos"));
const AreasAtendidas = lazy(() => import("./pages/AreasAtendidas"));
const ProblemasReaisCasos = lazy(() => import("./pages/ProblemasReaisCasos"));
const ColetaEntrega = lazy(() => import("./pages/ColetaEntrega"));
const SegurancaDosDados = lazy(() => import("./pages/SegurancaDosDados"));
const PoliticaPecasCliente = lazy(() => import("./pages/PoliticaPecasCliente"));
const ColetaFormulario = lazy(() => import("./pages/ColetaFormulario"));
const QuandoNaoCompensa = lazy(() => import("./pages/QuandoNaoCompensa"));
const SejaParceiro = lazy(() => import("./pages/SejaParceiro"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AssistenciaTecnicaCuritiba = lazy(() => import("./pages/AssistenciaTecnicaCuritiba"));
const ArrumarPC = lazy(() => import("./pages/ArrumarPC"));
const ArrumarPCCity = lazy(() => import("./pages/arrumar-pc/ArrumarPCCity"));
const ArrumarPCServicoCidade = lazy(() => import("./pages/arrumar-pc/ArrumarPCServicoCidade"));
const TermosCondicoes = lazy(() => import("./pages/TermosCondicoes"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const PoliticaCookiesAnuncios = lazy(() => import("./pages/PoliticaCookiesAnuncios"));
const StatusAnuncios = lazy(() => import("./pages/StatusAnuncios"));
const Anuncie = lazy(() => import("./pages/Anuncie"));
const FunilIndisponivel = lazy(() => import("./pages/FunilIndisponivel"));
const OrdemDeServico = lazy(() => import("./pages/OrdemDeServico"));
const StatusOs = lazy(() => import("./pages/StatusOs"));
const Depoimentos = lazy(() => import("./pages/Depoimentos"));
const ComoAvaliar = lazy(() => import("./pages/ComoAvaliar"));
const Avaliar = lazy(() => import("./pages/Avaliar"));
const ExcluirMeusDados = lazy(() => import("./pages/ExcluirMeusDados"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminFunnel = lazy(() => import("./pages/admin/AdminFunnel"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminVitals = lazy(() => import("./pages/admin/AdminVitals"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCasos = lazy(() => import("./pages/admin/AdminCasos"));
const AdminOsAudit = lazy(() => import("./pages/admin/AdminOsAudit"));
const AdminOperacao = lazy(() => import("./pages/admin/AdminOperacao"));
const AdminProvasMonitor = lazy(() => import("./pages/admin/AdminProvasMonitor"));
const AdminProvasVerticais = lazy(() => import("./pages/admin/AdminProvasVerticais"));
const AdminConversao = lazy(() => import("./pages/admin/AdminConversao"));
const AdminPublishStatus = lazy(() => import("./pages/admin/AdminPublishStatus"));
const AdminFotosBairros = lazy(() => import("./pages/admin/AdminFotosBairros"));
const ParceirosHub = lazy(() => import("./pages/parceiros/ParceirosHub"));
const ParceiroPage = lazy(() => import("./pages/parceiros/ParceiroPage"));

const ConsertoImpressoraCuritiba = lazy(() => import("./pages/ConsertoImpressoraCuritiba"));
const AssistenciaEletrodomesticosInteligentesCuritiba = lazy(() => import("./pages/AssistenciaEletrodomesticosInteligentesCuritiba"));
const Status = lazy(() => import("./pages/Status"));
const Obrigado = lazy(() => import("./pages/Obrigado"));

// Hubs SEO de categorias (TV, Som, Videogame, Celular) × cidades/bairros
const ConsertoTVCity = lazy(() => import("./pages/hubs/CategoryLocalTemplate").then(m => ({ default: m.ConsertoTVCity })));
const ConsertoSomCity = lazy(() => import("./pages/hubs/CategoryLocalTemplate").then(m => ({ default: m.ConsertoSomCity })));
const ConsertoVideogameCity = lazy(() => import("./pages/hubs/CategoryLocalTemplate").then(m => ({ default: m.ConsertoVideogameCity })));
const ConsertoCelularLocalCity = lazy(() => import("./pages/hubs/CategoryLocalTemplate").then(m => ({ default: m.ConsertoCelularLocalCity })));
const ConsertoTVHub = lazy(() => import("./pages/hubs/CategoryLocalTemplate").then(m => ({ default: m.ConsertoTVHub })));
const ConsertoSomHub = lazy(() => import("./pages/hubs/CategoryLocalTemplate").then(m => ({ default: m.ConsertoSomHub })));
const ConsertoVideogameHub = lazy(() => import("./pages/hubs/CategoryLocalTemplate").then(m => ({ default: m.ConsertoVideogameHub })));
const ConsertoCelularLocalHub = lazy(() => import("./pages/hubs/CategoryLocalTemplate").then(m => ({ default: m.ConsertoCelularLocalHub })));
// Hub SEO — Empresa de TI em Curitiba
const EmpresaDeTiCuritiba = lazy(() => import("./pages/EmpresaDeTiCuritiba"));

// Bairros Curitiba
const Centro = lazy(() => import("./pages/bairros/Centro"));
const Batel = lazy(() => import("./pages/bairros/Batel"));
const Portao = lazy(() => import("./pages/bairros/Portao"));
const CampoComprido = lazy(() => import("./pages/bairros/CampoComprido"));
const CIC = lazy(() => import("./pages/bairros/CIC"));
const SantaFelicidade = lazy(() => import("./pages/bairros/SantaFelicidade"));

// Bairros São José dos Pinhais
const SaoJoseDosPinhais = lazy(() => import("./pages/bairros/SaoJoseDosPinhais"));
const AfonsoPena = lazy(() => import("./pages/bairros/AfonsoPena"));
const Cruzeiro = lazy(() => import("./pages/bairros/Cruzeiro"));
const Aristocrata = lazy(() => import("./pages/bairros/Aristocrata"));
const Braga = lazy(() => import("./pages/bairros/Braga"));
const Costeira = lazy(() => import("./pages/bairros/Costeira"));
const Aviacao = lazy(() => import("./pages/bairros/Aviacao"));
const ParqueDaFonte = lazy(() => import("./pages/bairros/ParqueDaFonte"));
const Guatupe = lazy(() => import("./pages/bairros/Guatupe"));
const SaoCristovao = lazy(() => import("./pages/bairros/SaoCristovao"));
const SaoDomingos = lazy(() => import("./pages/bairros/SaoDomingos"));
const SaoMarcos = lazy(() => import("./pages/bairros/SaoMarcos"));
const SaoFrancisco = lazy(() => import("./pages/bairros/SaoFrancisco"));
const DelRey = lazy(() => import("./pages/bairros/DelRey"));
const BarroPreto = lazy(() => import("./pages/bairros/BarroPreto"));

// Bairros Araucária
const AraucariaCentro = lazy(() => import("./pages/bairros/AraucariaCentro"));
const CapelaVelhaAraucaria = lazy(() => import("./pages/bairros/CapelaVelhaAraucaria"));
const ThomazCoelhoAraucaria = lazy(() => import("./pages/bairros/ThomazCoelhoAraucaria"));

const CacheiraAraucaria = lazy(() => import("./pages/bairros/CacheiraAraucaria"));
const ThomazCoelhoIIAraucaria = lazy(() => import("./pages/bairros/ThomazCoelhoIIAraucaria"));
const JardimBoaVistaAraucaria = lazy(() => import("./pages/bairros/JardimBoaVistaAraucaria"));
const SaoMiguelAraucaria = lazy(() => import("./pages/bairros/SaoMiguelAraucaria"));
const CaliforniaAraucaria = lazy(() => import("./pages/bairros/CaliforniaAraucaria"));
const VilaNovaAraucaria = lazy(() => import("./pages/bairros/VilaNovaAraucaria"));
const IndustrialAraucaria = lazy(() => import("./pages/bairros/IndustrialAraucaria"));
const JardimIguacuAraucaria = lazy(() => import("./pages/bairros/JardimIguacuAraucaria"));
const PlantaSaoTiagoAraucaria = lazy(() => import("./pages/bairros/PlantaSaoTiagoAraucaria"));
const JardimShangrilaAraucaria = lazy(() => import("./pages/bairros/JardimShangrilaAraucaria"));
const JardimLaranjeirasCL = lazy(() => import("./pages/bairros/JardimLaranjeirasCL"));
const SaoMarcosCampoLargo = lazy(() => import("./pages/bairros/SaoMarcosCampoLargo"));
const SaoJoseCampoLargo = lazy(() => import("./pages/bairros/SaoJoseCampoLargo"));
const JardimEsperancaCL = lazy(() => import("./pages/bairros/JardimEsperancaCL"));
const ColoniaMalhadaCL = lazy(() => import("./pages/bairros/ColoniaMalhadaCL"));
const LamenhaGrandeCL = lazy(() => import("./pages/bairros/LamenhaGrandeCL"));
const VilaCandidaCL = lazy(() => import("./pages/bairros/VilaCandidaCL"));
const JardimNovoHorizonteCL = lazy(() => import("./pages/bairros/JardimNovoHorizonteCL"));
const TimbotuvaCL = lazy(() => import("./pages/bairros/TimbotuvaCL"));
const JardimPlanaltoIICL = lazy(() => import("./pages/bairros/JardimPlanaltoIICL"));
const JardimPedroDemeterco = lazy(() => import("./pages/bairros/JardimPedroDemeterco"));
const JardimKarlaPinhais = lazy(() => import("./pages/bairros/JardimKarlaPinhais"));
const JardimClaudiaIIPinhais = lazy(() => import("./pages/bairros/JardimClaudiaIIPinhais"));
const JardimWissingerPinhais = lazy(() => import("./pages/bairros/JardimWissingerPinhais"));
const VilaAmeliaPinhais = lazy(() => import("./pages/bairros/VilaAmeliaPinhais"));
const JardimEsplanadaPinhais = lazy(() => import("./pages/bairros/JardimEsplanadaPinhais"));
const VilaMariaAntonietaPinhais = lazy(() => import("./pages/bairros/VilaMariaAntonietaPinhais"));
const JardimDonaRosaPinhais = lazy(() => import("./pages/bairros/JardimDonaRosaPinhais"));
const ParqueNascentesPinhais = lazy(() => import("./pages/bairros/ParqueNascentesPinhais"));
const JardimTropicalPinhais = lazy(() => import("./pages/bairros/JardimTropicalPinhais"));
// Bairros Campo Largo
const CampoLargoCentro = lazy(() => import("./pages/bairros/CampoLargoCentro"));
const FerrariaCampoLargo = lazy(() => import("./pages/bairros/FerrariaCampoLargo"));
const JardimGuilherminaCampoLargo = lazy(() => import("./pages/bairros/JardimGuilherminaCampoLargo"));

// Bairros Pinhais
const PinhaisCentro = lazy(() => import("./pages/bairros/PinhaisCentro"));
const WeissopolisPinhais = lazy(() => import("./pages/bairros/WeissopolisPinhais"));
const AltoGloria = lazy(() => import("./pages/bairros/AltoGloria"));
const Reboucas = lazy(() => import("./pages/bairros/Reboucas"));
const VilaIzabel = lazy(() => import("./pages/bairros/VilaIzabel"));
const Seminario = lazy(() => import("./pages/bairros/Seminario"));
const HugoLange = lazy(() => import("./pages/bairros/HugoLange"));
const JardimSocial = lazy(() => import("./pages/bairros/JardimSocial"));
const JardimAmericas = lazy(() => import("./pages/bairros/JardimAmericas"));
const Taruma = lazy(() => import("./pages/bairros/Taruma"));
const CapaoImbuia = lazy(() => import("./pages/bairros/CapaoImbuia"));
const Hauer = lazy(() => import("./pages/bairros/Hauer"));
const AltoBoqueiraoCtba = lazy(() => import("./pages/bairros/AltoBoqueiraoCtba"));
const SitioCercado = lazy(() => import("./pages/bairros/SitioCercado"));
const NovoMundo = lazy(() => import("./pages/bairros/NovoMundo"));
const Fazendinha = lazy(() => import("./pages/bairros/Fazendinha"));
const AguaVerdeBairro = lazy(() => import("./pages/bairros/AguaVerdeBairro"));
const QuissisanaSJP = lazy(() => import("./pages/bairros/QuissisanaSJP"));
const AcademiaSJP = lazy(() => import("./pages/bairros/AcademiaSJP"));
const ColoniaMurcySJP = lazy(() => import("./pages/bairros/ColoniaMurcySJP"));
const BonecaSJP = lazy(() => import("./pages/bairros/BonecaSJP"));
const OuroFinoSJP = lazy(() => import("./pages/bairros/OuroFinoSJP"));
const AgricolareSJP = lazy(() => import("./pages/bairros/AgricolareSJP"));
const CampoLargoSJP = lazy(() => import("./pages/bairros/CampoLargoSJP"));
const ItaliaSJP = lazy(() => import("./pages/bairros/ItaliaSJP"));
const BordoDoCampoSJP2 = lazy(() => import("./pages/bairros/BordoDoCampoSJP2"));
const IndependenciaSJP = lazy(() => import("./pages/bairros/IndependenciaSJP"));
const OswaldoCruzColombo = lazy(() => import("./pages/bairros/OswaldoCruzColombo"));
const ColareColombo = lazy(() => import("./pages/bairros/ColareColombo"));
const CampinaGrandeColombo = lazy(() => import("./pages/bairros/CampinaGrandeColombo"));
const TaxiqueiraColomboo = lazy(() => import("./pages/bairros/TaxiqueiraColomboo"));
const EmbuColombo = lazy(() => import("./pages/bairros/EmbuColombo"));
const JardimUniaoPiraquara = lazy(() => import("./pages/bairros/JardimUniaoPiraquara"));
const JardimSantoAntonioPiraquara = lazy(() => import("./pages/bairros/JardimSantoAntonioPiraquara"));
const JardimSaoPauloPiraquara = lazy(() => import("./pages/bairros/JardimSaoPauloPiraquara"));
const IraiPiraquara = lazy(() => import("./pages/bairros/IraiPiraquara"));
const BoaVistaTamandare = lazy(() => import("./pages/bairros/BoaVistaTamandare"));
const CampoDoTenenteTamandare = lazy(() => import("./pages/bairros/CampoDoTenenteTamandare"));
const JardimParanaguaTamandare = lazy(() => import("./pages/bairros/JardimParanaguaTamandare"));
const JardimSaoJorgeTamandare = lazy(() => import("./pages/bairros/JardimSaoJorgeTamandare"));
const EucaliptosFRG2 = lazy(() => import("./pages/bairros/EucaliptosFRG2"));
const JardimCondorFRG = lazy(() => import("./pages/bairros/JardimCondorFRG"));
const JardimIperigoFRG = lazy(() => import("./pages/bairros/JardimIperigoFRG"));
const JardimDasPedrasFRG = lazy(() => import("./pages/bairros/JardimDasPedrasFRG"));
const JoqueiFRCM = lazy(() => import("./pages/bairros/JoqueiFRCM"));
const AntonioOliveraCM = lazy(() => import("./pages/bairros/AntonioOliveraCM"));
const EspigoAlegreCM = lazy(() => import("./pages/bairros/EspigoAlegreCM"));
const JardimFlorestalQB = lazy(() => import("./pages/bairros/JardimFlorestalQB"));
const JardimJaponeQB = lazy(() => import("./pages/bairros/JardimJaponeQB"));
const GraciosaMirQB = lazy(() => import("./pages/bairros/GraciosaMirQB"));
const PinevillePinhais = lazy(() => import("./pages/bairros/PinevillePinhais"));

// Novas cidades
const TecnicoInformaticaColombo = lazy(() => import("./pages/TecnicoInformaticaColombo"));
const TecnicoInformaticaFazendaRioGrande = lazy(() => import("./pages/TecnicoInformaticaFazendaRioGrande"));
const TecnicoInformaticaAlmiranteTamandare = lazy(() => import("./pages/TecnicoInformaticaAlmiranteTamandare"));

// Bairros Colombo
const CentroColombo = lazy(() => import("./pages/bairros/CentroColombo"));
const MaracanaColombo = lazy(() => import("./pages/bairros/MaracanaColombo"));
const GuaraitubaColombo = lazy(() => import("./pages/bairros/GuaraitubaColombo"));

// Bairros Fazenda Rio Grande
const CentroFRG = lazy(() => import("./pages/bairros/CentroFRG"));
const EucaliptosFRG = lazy(() => import("./pages/bairros/EucaliptosFRG"));
const NacoesFRG = lazy(() => import("./pages/bairros/NacoesFRG"));

// Bairros Almirante Tamandaré
const CentroAlmiranteTamandare = lazy(() => import("./pages/bairros/CentroAlmiranteTamandare"));
const JardimMontoSantoAT = lazy(() => import("./pages/bairros/JardimMontoSantoAT"));
const CachoeiraAT = lazy(() => import("./pages/bairros/CachoeiraAT"));

// Novos bairros Curitiba
const AguaVerde = lazy(() => import("./pages/bairros/AguaVerde"));
const Bigorrilho = lazy(() => import("./pages/bairros/Bigorrilho"));
const Merces = lazy(() => import("./pages/bairros/Merces"));
const BoaVista = lazy(() => import("./pages/bairros/BoaVista"));
const Juveve = lazy(() => import("./pages/bairros/Juveve"));
const Cabral = lazy(() => import("./pages/bairros/Cabral"));
const CristoRei = lazy(() => import("./pages/bairros/CristoRei"));
const Cajuru = lazy(() => import("./pages/bairros/Cajuru"));
const Uberaba = lazy(() => import("./pages/bairros/Uberaba"));
const Pinheirinho = lazy(() => import("./pages/bairros/Pinheirinho"));
const Xaxim = lazy(() => import("./pages/bairros/Xaxim"));
const Boqueirao = lazy(() => import("./pages/bairros/Boqueirao"));
const Bacacheri = lazy(() => import("./pages/bairros/Bacacheri"));
const Tingui = lazy(() => import("./pages/bairros/Tingui"));
// Novos bairros Araucária
const ChapadaAraucaria = lazy(() => import("./pages/bairros/ChapadaAraucaria"));
const CosteiraAraucaria = lazy(() => import("./pages/bairros/CosteiraAraucaria"));
const IguacuAraucaria = lazy(() => import("./pages/bairros/IguacuAraucaria"));
const CampinaDaBarra = lazy(() => import("./pages/bairros/CampinaDaBarra"));
const PortoDasLaranjeiras = lazy(() => import("./pages/bairros/PortoDasLaranjeiras"));
const Tindiquera = lazy(() => import("./pages/bairros/Tindiquera"));
const BariguiAraucaria = lazy(() => import("./pages/bairros/BariguiAraucaria"));
const FazendaVelhaAraucaria = lazy(() => import("./pages/bairros/FazendaVelhaAraucaria"));
const EstacaoAraucaria = lazy(() => import("./pages/bairros/EstacaoAraucaria"));
const BoqueiraoAraucaria = lazy(() => import("./pages/bairros/BoqueiraoAraucaria"));
const SabiaAraucaria = lazy(() => import("./pages/bairros/SabiaAraucaria"));
const PassaunaAraucaria = lazy(() => import("./pages/bairros/PassaunaAraucaria"));
const GuajuviraAraucaria = lazy(() => import("./pages/bairros/GuajuviraAraucaria"));
// Novos bairros Colombo
const AltoMaracanaColombo = lazy(() => import("./pages/bairros/AltoMaracanaColombo"));
const AtubaColombo = lazy(() => import("./pages/bairros/AtubaColombo"));
const CampoPequenoColombo = lazy(() => import("./pages/bairros/CampoPequenoColombo"));
const FatimaColombo = lazy(() => import("./pages/bairros/FatimaColombo"));
const GabirobalColombo = lazy(() => import("./pages/bairros/GabirobalColombo"));
const JardimOsascoColombo = lazy(() => import("./pages/bairros/JardimOsascoColombo"));
const MonzaColombo = lazy(() => import("./pages/bairros/MonzaColombo"));
const PalmitalColombo = lazy(() => import("./pages/bairros/PalmitalColombo"));
const RocaGrandeColombo = lazy(() => import("./pages/bairros/RocaGrandeColombo"));
const SaoGabrielColombo = lazy(() => import("./pages/bairros/SaoGabrielColombo"));
const SantaTerezinhaColombo = lazy(() => import("./pages/bairros/SantaTerezinhaColombo"));
// Novos bairros Pinhais
const EmilianoPerneta = lazy(() => import("./pages/bairros/EmilianoPerneta"));
const MariaAntonieta = lazy(() => import("./pages/bairros/MariaAntonieta"));
const VargemGrande = lazy(() => import("./pages/bairros/VargemGrande"));
const EstanciaPinhais = lazy(() => import("./pages/bairros/EstanciaPinhais"));
const AltoTaruma = lazy(() => import("./pages/bairros/AltoTaruma"));
const GraciosaPinhais = lazy(() => import("./pages/bairros/GraciosaPinhais"));
const JardimAmelia = lazy(() => import("./pages/bairros/JardimAmelia"));
const PalmitalPinhais = lazy(() => import("./pages/bairros/PalmitalPinhais"));
const AtubaPinhais = lazy(() => import("./pages/bairros/AtubaPinhais"));
const SeteVilas = lazy(() => import("./pages/bairros/SeteVilas"));
const VilaTaruma = lazy(() => import("./pages/bairros/VilaTaruma"));
const ValeDasAguas = lazy(() => import("./pages/bairros/ValeDasAguas"));
const JardimClaudia = lazy(() => import("./pages/bairros/JardimClaudia"));
// Novos bairros Campo Largo
const JardimAmericaCL = lazy(() => import("./pages/bairros/JardimAmericaCL"));
const BotiatuvaCL = lazy(() => import("./pages/bairros/BotiatuvaCL"));
const RondinhaCL = lazy(() => import("./pages/bairros/RondinhaCL"));
const SaoSilvestreCL = lazy(() => import("./pages/bairros/SaoSilvestreCL"));
const TresCorregosCL = lazy(() => import("./pages/bairros/TresCorregosCL"));
const ItaquiCL = lazy(() => import("./pages/bairros/ItaquiCL"));
const OuroFinoCL = lazy(() => import("./pages/bairros/OuroFinoCL"));
const BateiasCL = lazy(() => import("./pages/bairros/BateiasCL"));
const PalmitalCL = lazy(() => import("./pages/bairros/PalmitalCL"));
const SantaCruzCL = lazy(() => import("./pages/bairros/SantaCruzCL"));
const CorreiaDeFreitasCL = lazy(() => import("./pages/bairros/CorreiaDeFreitasCL"));
const JardimPlanaltoCL = lazy(() => import("./pages/bairros/JardimPlanaltoCL"));
const VilaSoleneCL = lazy(() => import("./pages/bairros/VilaSoleneCL"));
// Novos bairros FRG, AT, Piraquara, Campo Magro, Quatro Barras, SJP
const IguacuFRG = lazy(() => import("./pages/bairros/IguacuFRG"));
const GralhaAzulFRG = lazy(() => import("./pages/bairros/GralhaAzulFRG"));
const SantaTerezinhaFRG = lazy(() => import("./pages/bairros/SantaTerezinhaFRG"));
const JardimEstadosFRG = lazy(() => import("./pages/bairros/JardimEstadosFRG"));
const PioneirosFRG = lazy(() => import("./pages/bairros/PioneirosFRG"));
const SaoLourencoFRG = lazy(() => import("./pages/bairros/SaoLourencoFRG"));
const HortenciaFRG = lazy(() => import("./pages/bairros/HortenciaFRG"));
const TanguaAT = lazy(() => import("./pages/bairros/TanguaAT"));
const SaoVenancioAT = lazy(() => import("./pages/bairros/SaoVenancioAT"));
const JardimGrazielaAT = lazy(() => import("./pages/bairros/JardimGrazielaAT"));
const JardimRomaAT = lazy(() => import("./pages/bairros/JardimRomaAT"));
const ColoniaAntonioPradoAT = lazy(() => import("./pages/bairros/ColoniaAntonioPradoAT"));
const TranqueiraAT = lazy(() => import("./pages/bairros/TranqueiraAT"));
const JardimParaisoAT = lazy(() => import("./pages/bairros/JardimParaisoAT"));
const CentroPiraquara = lazy(() => import("./pages/bairros/CentroPiraquara"));
const JardimPrimaveraPiraquara = lazy(() => import("./pages/bairros/JardimPrimaveraPiraquara"));
const PlantaDeodoroPiraquara = lazy(() => import("./pages/bairros/PlantaDeodoroPiraquara"));
const VilaMacedoPiraquara = lazy(() => import("./pages/bairros/VilaMacedoPiraquara"));
const GuaritubaPiraquara = lazy(() => import("./pages/bairros/GuaritubaPiraquara"));
const PradoVelhoPiraquara = lazy(() => import("./pages/bairros/PradoVelhoPiraquara"));
const SaoCristaoPiraquara = lazy(() => import("./pages/bairros/SaoCristaoPiraquara"));
const JardimBelaVistaPiraquara = lazy(() => import("./pages/bairros/JardimBelaVistaPiraquara"));
const CaiuaPiraquara = lazy(() => import("./pages/bairros/CaiuaPiraquara"));
const CentroCampoMagro = lazy(() => import("./pages/bairros/CentroCampoMagro"));
const SedeCampoMagro = lazy(() => import("./pages/bairros/SedeCampoMagro"));
const JardimBoaVistaCM = lazy(() => import("./pages/bairros/JardimBoaVistaCM"));
const SaoSebastiaoCM = lazy(() => import("./pages/bairros/SaoSebastiaoCM"));
const RioVerdeCM = lazy(() => import("./pages/bairros/RioVerdeCM"));
const BotiatuvaCM = lazy(() => import("./pages/bairros/BotiatuvaCM"));
const CentroQuatroBarras = lazy(() => import("./pages/bairros/CentroQuatroBarras"));
const JardimMeninoDeusQB = lazy(() => import("./pages/bairros/JardimMeninoDeusQB"));
const VilaSaoJoseQB = lazy(() => import("./pages/bairros/VilaSaoJoseQB"));
const BordaDoCampoQB = lazy(() => import("./pages/bairros/BordaDoCampoQB"));
const SaoLourencoQB = lazy(() => import("./pages/bairros/SaoLourencoQB"));
const VilaMariaQB = lazy(() => import("./pages/bairros/VilaMariaQB"));
const CidadeJardimSJP = lazy(() => import("./pages/bairros/CidadeJardimSJP"));
const PedroMoroSJP = lazy(() => import("./pages/bairros/PedroMoroSJP"));
const IpeSJP = lazy(() => import("./pages/bairros/IpeSJP"));
const RioPequenoSJP = lazy(() => import("./pages/bairros/RioPequenoSJP"));
const BordaDoCampoSJP = lazy(() => import("./pages/bairros/BordaDoCampoSJP"));

const TecnicoInformaticaCuritibaAds = lazy(() => import("./pages/ads/TecnicoInformaticaCuritibaAds"));

// Páginas de Serviços Individuais
const ServicoCore = lazy(() => import("./pages/servicos/ServicoCore"));

const MontagemPc = lazy(() => import("./pages/servicos/MontagemPc"));
const ComputadorLento = lazy(() => import("./pages/servicos/ComputadorLento"));
const ComputadorNaoLiga = lazy(() => import("./pages/servicos/ComputadorNaoLiga"));
const ManutencaoTV = lazy(() => import("./pages/servicos/ManutencaoTV"));
const ConsertoCelular = lazy(() => import("./pages/servicos/ConsertoCelular"));

// Novas cidades
const TecnicoInformaticaPiraquara = lazy(() => import("./pages/TecnicoInformaticaPiraquara"));
const TecnicoInformaticaCampoMagro = lazy(() => import("./pages/TecnicoInformaticaCampoMagro"));
const TecnicoInformaticaQuatroBarras = lazy(() => import("./pages/TecnicoInformaticaQuatroBarras"));

// Páginas combinadas Serviço + Bairro
const FormatacaoCentro = lazy(() => import("./pages/servico-bairro/FormatacaoCentro"));
const ConsertoNotebookBatel = lazy(() => import("./pages/servico-bairro/ConsertoNotebookBatel"));
const RemocaoVirusPortao = lazy(() => import("./pages/servico-bairro/RemocaoVirusPortao"));
const UpgradeSsdSantaFelicidade = lazy(() => import("./pages/servico-bairro/UpgradeSsdSantaFelicidade"));
const FormatacaoSaoJosePinhais = lazy(() => import("./pages/servico-bairro/FormatacaoSaoJosePinhais"));
const ConsertoNotebookCIC = lazy(() => import("./pages/servico-bairro/ConsertoNotebookCIC"));
const RedesWifiAraucaria = lazy(() => import("./pages/servico-bairro/RedesWifiAraucaria"));
const RemocaoVirusCentro = lazy(() => import("./pages/servico-bairro/RemocaoVirusCentro"));
const UpgradeSsdBatel = lazy(() => import("./pages/servico-bairro/UpgradeSsdBatel"));
const FormatacaoPortao = lazy(() => import("./pages/servico-bairro/FormatacaoPortao"));
const RedesWifiCIC = lazy(() => import("./pages/servico-bairro/RedesWifiCIC"));
const BackupCentro = lazy(() => import("./pages/servico-bairro/BackupCentro"));
const ConsertoNotebookPortao = lazy(() => import("./pages/servico-bairro/ConsertoNotebookPortao"));
// RedesWifiSantaFelicidade legado desativado; rota agora usa RedesWifiSantaFelicidadeAncora (indexável).
const FormatacaoCampoComprido = lazy(() => import("./pages/servico-bairro/FormatacaoCampoComprido"));
const RemocaoVirusBatel = lazy(() => import("./pages/servico-bairro/RemocaoVirusBatel"));
const MontagemPcCIC = lazy(() => import("./pages/servico-bairro/MontagemPcCIC"));

// SJP
const RemocaoVirusSaoJosePinhais = lazy(() => import("./pages/servico-bairro/RemocaoVirusSaoJosePinhais"));
const ConsertoNotebookSaoJosePinhais = lazy(() => import("./pages/servico-bairro/ConsertoNotebookSaoJosePinhais"));
const UpgradeSsdSaoJosePinhais = lazy(() => import("./pages/servico-bairro/UpgradeSsdSaoJosePinhais"));
const RedesWifiSaoJosePinhais = lazy(() => import("./pages/servico-bairro/RedesWifiSaoJosePinhais"));

// Araucária
const FormatacaoAraucaria = lazy(() => import("./pages/servico-bairro/FormatacaoAraucaria"));
const RemocaoVirusAraucaria = lazy(() => import("./pages/servico-bairro/RemocaoVirusAraucaria"));
const ConsertoNotebookAraucaria = lazy(() => import("./pages/servico-bairro/ConsertoNotebookAraucaria"));
const UpgradeSsdAraucaria = lazy(() => import("./pages/servico-bairro/UpgradeSsdAraucaria"));

// Campo Largo
const FormatacaoCampoLargo = lazy(() => import("./pages/servico-bairro/FormatacaoCampoLargo"));
const RemocaoVirusCampoLargo = lazy(() => import("./pages/servico-bairro/RemocaoVirusCampoLargo"));
const ConsertoNotebookCampoLargo = lazy(() => import("./pages/servico-bairro/ConsertoNotebookCampoLargo"));
const RedesWifiCampoLargo = lazy(() => import("./pages/servico-bairro/RedesWifiCampoLargo"));

// Pinhais
const FormatacaoPinhais = lazy(() => import("./pages/servico-bairro/FormatacaoPinhais"));
const RemocaoVirusPinhais = lazy(() => import("./pages/servico-bairro/RemocaoVirusPinhais"));
const ConsertoNotebookPinhais = lazy(() => import("./pages/servico-bairro/ConsertoNotebookPinhais"));
const UpgradeSsdPinhais = lazy(() => import("./pages/servico-bairro/UpgradeSsdPinhais"));
const RedesWifiPinhais = lazy(() => import("./pages/servico-bairro/RedesWifiPinhais"));

// Wi-Fi + TV Smart por bairro (indexáveis — 5 bairros âncora)
const RedesWifiBatel = lazy(() => import("./pages/servico-bairro/RedesWifiBatel"));
const RedesWifiCentro = lazy(() => import("./pages/servico-bairro/RedesWifiCentro"));
const RedesWifiAguaVerde = lazy(() => import("./pages/servico-bairro/RedesWifiAguaVerde"));
const RedesWifiPortao = lazy(() => import("./pages/servico-bairro/RedesWifiPortao"));
const ManutencaoTvBatel = lazy(() => import("./pages/servico-bairro/ManutencaoTvBatel"));
const ManutencaoTvCentro = lazy(() => import("./pages/servico-bairro/ManutencaoTvCentro"));
const ManutencaoTvAguaVerde = lazy(() => import("./pages/servico-bairro/ManutencaoTvAguaVerde"));
const ManutencaoTvCic = lazy(() => import("./pages/servico-bairro/ManutencaoTvCic"));
const ManutencaoTvPortao = lazy(() => import("./pages/servico-bairro/ManutencaoTvPortao"));
// Onda 2 — completa 12 bairros-âncora indexáveis (Wi-Fi + TV Smart)
const RedesWifiBigorrilho = lazy(() => import("./pages/servico-bairro/RedesWifiBigorrilho"));
const RedesWifiCabral = lazy(() => import("./pages/servico-bairro/RedesWifiCabral"));
const RedesWifiSantaFelicidadeAncora = lazy(() => import("./pages/servico-bairro/RedesWifiSantaFelicidadeAncora"));
const RedesWifiBoaVista = lazy(() => import("./pages/servico-bairro/RedesWifiBoaVista"));
const RedesWifiCristoRei = lazy(() => import("./pages/servico-bairro/RedesWifiCristoRei"));
const RedesWifiCajuru = lazy(() => import("./pages/servico-bairro/RedesWifiCajuru"));
const RedesWifiBoqueirao = lazy(() => import("./pages/servico-bairro/RedesWifiBoqueirao"));
const ManutencaoTvBigorrilho = lazy(() => import("./pages/servico-bairro/ManutencaoTvBigorrilho"));
const ManutencaoTvCabral = lazy(() => import("./pages/servico-bairro/ManutencaoTvCabral"));
const ManutencaoTvSantaFelicidade = lazy(() => import("./pages/servico-bairro/ManutencaoTvSantaFelicidade"));
const ManutencaoTvBoaVista = lazy(() => import("./pages/servico-bairro/ManutencaoTvBoaVista"));
const ManutencaoTvCristoRei = lazy(() => import("./pages/servico-bairro/ManutencaoTvCristoRei"));
const ManutencaoTvCajuru = lazy(() => import("./pages/servico-bairro/ManutencaoTvCajuru"));
const ManutencaoTvBoqueirao = lazy(() => import("./pages/servico-bairro/ManutencaoTvBoqueirao"));
// Onda 3 — 4 novos bairros âncora (Wi-Fi + TV Smart)
const RedesWifiJardimAmericas = lazy(() => import("./pages/servico-bairro/RedesWifiJardimAmericas"));
const ManutencaoTvJardimAmericas = lazy(() => import("./pages/servico-bairro/ManutencaoTvJardimAmericas"));
const RedesWifiEcoville = lazy(() => import("./pages/servico-bairro/RedesWifiEcoville"));
const ManutencaoTvEcoville = lazy(() => import("./pages/servico-bairro/ManutencaoTvEcoville"));
const RedesWifiAltoXV = lazy(() => import("./pages/servico-bairro/RedesWifiAltoXV"));
const ManutencaoTvAltoXV = lazy(() => import("./pages/servico-bairro/ManutencaoTvAltoXV"));
const RedesWifiReboucas = lazy(() => import("./pages/servico-bairro/RedesWifiReboucas"));
const ManutencaoTvReboucas = lazy(() => import("./pages/servico-bairro/ManutencaoTvReboucas"));

// Dynamic service+city page
const ServicoCidadePage = lazy(() => import("./pages/servico-bairro/ServicoBairroGerado"));

// Dynamic problem/intent pages (50 páginas de intenção de busca)
const ProblemaPage = lazy(() => import("./pages/ProblemaPage"));
const NotebookNaoLiga = lazy(() => import("./pages/problemas/NotebookNaoLiga"));
const ProblemaComputadorLento = lazy(() => import("./pages/problemas/ComputadorLento"));
const ProblemaTelaAzulWindows = lazy(() => import("./pages/problemas/TelaAzulWindows"));
const ProblemaNotebookNaoCarregaBateria = lazy(() => import("./pages/problemas/NotebookNaoCarregaBateria"));
const ProblemaTvNaoLiga = lazy(() => import("./pages/problemas/TvNaoLiga"));
const ProblemaComputadorDesligaSozinho = lazy(() => import("./pages/problemas/ComputadorDesligaSozinho"));
const ProblemaWifiCaindoTodaHora = lazy(() => import("./pages/problemas/WifiCaindoTodaHora"));
const ProblemaTvComSomSemImagem = lazy(() => import("./pages/problemas/TvComSomSemImagem"));
const ProblemaNotebookMolhado = lazy(() => import("./pages/problemas/NotebookMolhado"));
const ProblemaTelaNotebookQuebrada = lazy(() => import("./pages/problemas/TelaDeNotebookQuebrada"));
const ProblemaHdNaoReconhecido = lazy(() => import("./pages/problemas/HdNaoReconhecido"));
const ProblemaComputadorNaoLiga = lazy(() => import("./pages/problemas/ComputadorNaoLiga"));
const ProblemaTecladoNotebook = lazy(() => import("./pages/problemas/TecladoNotebookNaoFunciona"));
const ProblemaComputadorBarulho = lazy(() => import("./pages/problemas/ComputadorFazendoBarulho"));
const ProblemaTvLinhas = lazy(() => import("./pages/problemas/TvComLinhasNaTela"));
const ProblemaNotebookTelaPreta = lazy(() => import("./pages/problemas/NotebookComTelaPreta"));
const ProblemaTvDesligando = lazy(() => import("./pages/problemas/TvDesligandoSozinha"));
const ProblemaTvSemSom = lazy(() => import("./pages/problemas/TvSemSom"));
const ProblemaImpressoraNaoImprime = lazy(() => import("./pages/problemas/ImpressoraNaoImprime"));
const ProblemaMonitorSemSinal = lazy(() => import("./pages/problemas/MonitorSemSinal"));
const ProblemaNotebookLento = lazy(() => import("./pages/problemas/NotebookLento"));
const ProblemaComputadorTravando = lazy(() => import("./pages/problemas/ComputadorTravando"));
const ProblemaNotebookDesligandoSozinho = lazy(() => import("./pages/problemas/NotebookDesligandoSozinho"));
const ProblemaPenDriveNaoReconhecido = lazy(() => import("./pages/problemas/PenDriveNaoReconhecido"));
const ProblemaTouchpadNaoFunciona = lazy(() => import("./pages/problemas/TouchpadNaoFunciona"));
const ProblemaDobradicaNotebookQuebrada = lazy(() => import("./pages/problemas/DobradicaNotebookQuebrada"));
const ProblemaComputadorSemSom = lazy(() => import("./pages/problemas/ComputadorSemSom"));
const ProblemaTelaDoComputadorPiscando = lazy(() => import("./pages/problemas/TelaDoComputadorPiscando"));
const ProblemaTvTravando = lazy(() => import("./pages/problemas/TvTravando"));
const ProblemaMouseNaoFunciona = lazy(() => import("./pages/problemas/MouseNaoFunciona"));
const ProblemaNotebookNaoConectaWifi = lazy(() => import("./pages/problemas/NotebookNaoConectaWifi"));
const ProblemaWindowsNaoInicia = lazy(() => import("./pages/problemas/WindowsNaoInicia"));
const ProblemaWebcamNaoFunciona = lazy(() => import("./pages/problemas/WebcamNaoFunciona"));
const ProblemaTvNaoConectaWifi = lazy(() => import("./pages/problemas/TvNaoConectaWifi"));
const ProblemasHub = lazy(() => import("./pages/problemas/ProblemasHub"));
const ProblemaTvComImagemEscura = lazy(() => import("./pages/problemas/TvComImagemEscura"));
const ProblemaNotebookSuperaquecendo = lazy(() => import("./pages/problemas/NotebookSuperaquecendo"));

// Pillar do cluster de informática
const GuiaTecnicoInformatica = lazy(() => import("./pages/GuiaTecnicoInformatica"));

// Procedimentos Técnicos hub
const ProcedimentosPlaca = lazy(() => import("./pages/ProcedimentosPlaca"));

// Marcas
const Marcas = lazy(() => import("./pages/Marcas"));
const MarcaPage = lazy(() => import("./pages/MarcaPage"));

// CFTV
const CFTVPage = lazy(() => import("./pages/CFTV"));
const CFTVCuritiba = lazy(() => import("./pages/cftv/CFTVCuritiba"));
const CFTVSaoJosePinhais = lazy(() => import("./pages/cftv/CFTVSaoJosePinhais"));
const CFTVLitoral = lazy(() => import("./pages/cftv/CFTVLitoral"));
const CFTVGuaratuba = lazy(() => import("./pages/cftv/CFTVGuaratuba"));
const CFTVAraucaria = lazy(() => import("./pages/cftv/CFTVAraucaria"));
const CFTVCampoLargo = lazy(() => import("./pages/cftv/CFTVCampoLargo"));
const CFTVPinhais = lazy(() => import("./pages/cftv/CFTVPinhais"));

const WhatsAppChatbot = lazy(() => import("@/components/WhatsAppChatbot").then((m) => ({ default: m.WhatsAppChatbot })));
const SocialProofProvider = lazy(() => import("@/components/social-proof").then((m) => ({ default: m.SocialProofProvider })));
const GA4ChecklistPanel = lazy(() => import("@/components/GA4ChecklistPanel").then((m) => ({ default: m.GA4ChecklistPanel })));
const Toaster = lazy(() => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));

const AppInit = () => {
  useEffect(() => { captureUtmsFromUrl(); }, []);
  return null;
};

const IdleEnhancements = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const activate = () => setEnabled(true);
    const idleId: number = typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback(activate, { timeout: 4500 })
      : (globalThis.setTimeout(activate, 2500) as unknown as number);

    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId);
      }

    };
  }, []);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <Toaster />
      <Sonner />
      <WhatsAppChatbot />
      <SocialProofProvider />
      <GA4ChecklistPanel />
    </Suspense>
  );
};

/**
 * Progresso de navegação no shell legado: ativa enquanto a rota lazy resolve
 * (Suspense), completando em 100% ao montar o novo conteúdo.
 */
const LegacyRouteProgress = () => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(true);
    const t = window.setTimeout(() => setActive(false), 350);
    return () => window.clearTimeout(t);
  }, []);
  return <RouteProgress active={active} />;
};

const App = () => (
      <AppErrorBoundary>
      <BrowserRouter>
        <LegacyRouteProgress />
        <ScrollToTop />
        <ProblemaLocalSchema />
        <AppInit />
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            {/* Matriz única de redirects 301 (src/lib/redirectMatrix.ts) */}
            {redirectRoutes()}
            <Route path="/" element={<Index />} />
            <Route path="/index" element={<Index />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/atendimento-domicilio" element={<AtendimentoDomicilio />} />
            <Route path="/atendimento-remoto" element={<AtendimentoRemoto />} />
            <Route path="/arrumar-pc" element={<ArrumarPC />} />
            <Route path="/arrumar-pc/online" element={<ArrumarPC />} />
            <Route path="/arrumar-pc/servico/:servico/:cidade" element={<ArrumarPCServicoCidade />} />
            <Route path="/arrumar-pc/:cidade" element={<ArrumarPCCity />} />
            <Route path="/empresa-de-ti-curitiba" element={<EmpresaDeTiCuritiba />} />
            <Route path="/precos-e-politicas" element={<PrecosEPoliticas />} />
            <Route path="/valores" element={<PrecosEPoliticas />} />
            
            {/* Páginas de Cidades */}
            <Route path="/tecnico-informatica-curitiba" element={<TecnicoInformaticaCuritiba />} />
            <Route path="/tecnico-informatica-sao-jose-pinhais" element={<TecnicoInformaticaSaoJosePinhais />} />
            <Route path="/tecnico-informatica-araucaria" element={<TecnicoInformaticaAraucaria />} />
            <Route path="/tecnico-informatica-campo-largo" element={<TecnicoInformaticaCampoLargo />} />
            <Route path="/tecnico-informatica-pinhais" element={<TecnicoInformaticaPinhais />} />
            <Route path="/tecnico-informatica-colombo" element={<TecnicoInformaticaColombo />} />
            <Route path="/tecnico-informatica-fazenda-rio-grande" element={<TecnicoInformaticaFazendaRioGrande />} />
            <Route path="/tecnico-informatica-almirante-tamandare" element={<TecnicoInformaticaAlmiranteTamandare />} />
            <Route path="/tecnico-informatica-piraquara" element={<TecnicoInformaticaPiraquara />} />
            <Route path="/tecnico-informatica-campo-magro" element={<TecnicoInformaticaCampoMagro />} />
            <Route path="/tecnico-informatica-quatro-barras" element={<TecnicoInformaticaQuatroBarras />} />
            
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/gestor-responsavel" element={<GestorResponsavel />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/obrigado" element={<Obrigado />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="/diagnostico-tecnico" element={<DiagnosticoTecnico />} />
            <Route path="/diagnostico-60s" element={<Diagnostico60s />} />
            <Route path="/equipamentos-atendidos" element={<EquipamentosAtendidos />} />
            <Route path="/areas-atendidas" element={<AreasAtendidas />} />
            <Route path="/seguranca-dos-dados" element={<SegurancaDosDados />} />
            <Route path="/politica-de-pecas-do-cliente" element={<PoliticaPecasCliente />} />
            <Route path="/avaliar" element={<Avaliar />} />
            <Route path="/excluir-meus-dados" element={<ExcluirMeusDados />} />

            <Route path="/problemas-reais-e-casos" element={<ProblemasReaisCasos />} />
            <Route path="/coleta-e-entrega" element={<ColetaEntrega />} />
            <Route path="/coleta-formulario" element={<ColetaFormulario />} />
            <Route path="/quando-nao-compensa" element={<QuandoNaoCompensa />} />
            <Route path="/seja-parceiro" element={<SejaParceiro />} />
            
            {/* Bairros Curitiba */}
            <Route path="/bairros/centro" element={<Centro />} />
            <Route path="/bairros/batel" element={<Batel />} />
            <Route path="/bairros/portao" element={<Portao />} />
            <Route path="/bairros/campo-comprido" element={<CampoComprido />} />
            <Route path="/bairros/cic" element={<CIC />} />
            <Route path="/bairros/santa-felicidade" element={<SantaFelicidade />} />
            
            {/* Bairros São José dos Pinhais */}
            <Route path="/bairros/sao-jose-dos-pinhais" element={<SaoJoseDosPinhais />} />
            <Route path="/bairros/afonso-pena" element={<AfonsoPena />} />
            <Route path="/bairros/cruzeiro" element={<Cruzeiro />} />
            <Route path="/bairros/aristocrata" element={<Aristocrata />} />
            <Route path="/bairros/braga" element={<Braga />} />
            <Route path="/bairros/costeira" element={<Costeira />} />
            <Route path="/bairros/aviacao" element={<Aviacao />} />
            <Route path="/bairros/parque-da-fonte" element={<ParqueDaFonte />} />
            <Route path="/bairros/guatupe" element={<Guatupe />} />
            <Route path="/bairros/sao-cristovao" element={<SaoCristovao />} />
            <Route path="/bairros/sao-domingos" element={<SaoDomingos />} />
            <Route path="/bairros/sao-marcos" element={<SaoMarcos />} />
            <Route path="/bairros/sao-francisco" element={<SaoFrancisco />} />
            <Route path="/bairros/del-rey" element={<DelRey />} />
            <Route path="/bairros/barro-preto" element={<BarroPreto />} />

            {/* Bairros Araucária */}
            <Route path="/bairros/centro-araucaria" element={<AraucariaCentro />} />
            <Route path="/bairros/capela-velha" element={<CapelaVelhaAraucaria />} />
            <Route path="/bairros/thomaz-coelho" element={<ThomazCoelhoAraucaria />} />

            <Route path="/bairros/cachoeira-araucaria" element={<CacheiraAraucaria />} />
            <Route path="/bairros/thomaz-coelho-ii" element={<ThomazCoelhoIIAraucaria />} />
            <Route path="/bairros/jardim-boa-vista-araucaria" element={<JardimBoaVistaAraucaria />} />
            <Route path="/bairros/sao-miguel-araucaria" element={<SaoMiguelAraucaria />} />
            <Route path="/bairros/california-araucaria" element={<CaliforniaAraucaria />} />
            <Route path="/bairros/vila-nova-araucaria" element={<VilaNovaAraucaria />} />
            <Route path="/bairros/industrial-araucaria" element={<IndustrialAraucaria />} />
            <Route path="/bairros/jardim-iguacu-araucaria" element={<JardimIguacuAraucaria />} />
            <Route path="/bairros/planta-sao-tiago-araucaria" element={<PlantaSaoTiagoAraucaria />} />
            <Route path="/bairros/jardim-shangrila-araucaria" element={<JardimShangrilaAraucaria />} />
            <Route path="/bairros/jardim-laranjeiras-cl" element={<JardimLaranjeirasCL />} />
            <Route path="/bairros/sao-marcos-campo-largo" element={<SaoMarcosCampoLargo />} />
            <Route path="/bairros/sao-jose-campo-largo" element={<SaoJoseCampoLargo />} />
            <Route path="/bairros/jardim-esperanca-cl" element={<JardimEsperancaCL />} />
            <Route path="/bairros/colonia-malhada-cl" element={<ColoniaMalhadaCL />} />
            <Route path="/bairros/lamenha-grande-cl" element={<LamenhaGrandeCL />} />
            <Route path="/bairros/vila-candida-cl" element={<VilaCandidaCL />} />
            <Route path="/bairros/jardim-novo-horizonte-cl" element={<JardimNovoHorizonteCL />} />
            <Route path="/bairros/timbotuva-cl" element={<TimbotuvaCL />} />
            <Route path="/bairros/jardim-planalto-ii-cl" element={<JardimPlanaltoIICL />} />
            <Route path="/bairros/jardim-pedro-demeterco" element={<JardimPedroDemeterco />} />
            <Route path="/bairros/jardim-karla-pinhais" element={<JardimKarlaPinhais />} />
            <Route path="/bairros/jardim-claudia-ii-pinhais" element={<JardimClaudiaIIPinhais />} />
            <Route path="/bairros/jardim-wissinger-pinhais" element={<JardimWissingerPinhais />} />
            <Route path="/bairros/vila-amelia-pinhais" element={<VilaAmeliaPinhais />} />
            <Route path="/bairros/jardim-esplanada-pinhais" element={<JardimEsplanadaPinhais />} />
            <Route path="/bairros/vila-maria-antonieta-pinhais" element={<VilaMariaAntonietaPinhais />} />
            <Route path="/bairros/jardim-dona-rosa-pinhais" element={<JardimDonaRosaPinhais />} />
            <Route path="/bairros/parque-nascentes-pinhais" element={<ParqueNascentesPinhais />} />
            <Route path="/bairros/jardim-tropical-pinhais" element={<JardimTropicalPinhais />} />
            {/* Bairros Campo Largo */}
            <Route path="/bairros/centro-campo-largo" element={<CampoLargoCentro />} />
            <Route path="/bairros/ferraria" element={<FerrariaCampoLargo />} />
            <Route path="/bairros/jardim-guilhermina" element={<JardimGuilherminaCampoLargo />} />

            {/* Bairros Pinhais */}
            <Route path="/bairros/centro-pinhais" element={<PinhaisCentro />} />
            <Route path="/bairros/weissopolis" element={<WeissopolisPinhais />} />
            <Route path="/bairros/pineville" element={<PinevillePinhais />} />

            {/* Bairros Colombo */}
            <Route path="/bairros/centro-colombo" element={<CentroColombo />} />
            <Route path="/bairros/maracana-colombo" element={<MaracanaColombo />} />
            <Route path="/bairros/guaraituba-colombo" element={<GuaraitubaColombo />} />

            {/* Bairros Fazenda Rio Grande */}
            <Route path="/bairros/centro-fazenda-rio-grande" element={<CentroFRG />} />
            <Route path="/bairros/eucaliptos-frg" element={<EucaliptosFRG />} />
            <Route path="/bairros/nacoes-frg" element={<NacoesFRG />} />

            {/* Bairros Almirante Tamandaré */}
            <Route path="/bairros/centro-almirante-tamandare" element={<CentroAlmiranteTamandare />} />
            <Route path="/bairros/jardim-monte-santo" element={<JardimMontoSantoAT />} />
            <Route path="/bairros/cachoeira-at" element={<CachoeiraAT />} />

            {/* Novos Bairros Curitiba */}
            <Route path="/bairros/agua-verde" element={<AguaVerde />} />
            <Route path="/bairros/bigorrilho" element={<Bigorrilho />} />
            <Route path="/bairros/merces" element={<Merces />} />
            <Route path="/bairros/boa-vista" element={<BoaVista />} />
            <Route path="/bairros/juveve" element={<Juveve />} />
            <Route path="/bairros/cabral" element={<Cabral />} />
            <Route path="/bairros/cristo-rei" element={<CristoRei />} />
            <Route path="/bairros/cajuru" element={<Cajuru />} />
            <Route path="/bairros/uberaba" element={<Uberaba />} />
            <Route path="/bairros/pinheirinho" element={<Pinheirinho />} />
            <Route path="/bairros/xaxim" element={<Xaxim />} />
            <Route path="/bairros/alto-da-gloria" element={<AltoGloria />} />
            <Route path="/bairros/reboucas" element={<Reboucas />} />
            <Route path="/bairros/vila-izabel" element={<VilaIzabel />} />
            <Route path="/bairros/seminario" element={<Seminario />} />
            <Route path="/bairros/hugo-lange" element={<HugoLange />} />
            <Route path="/bairros/jardim-social" element={<JardimSocial />} />
            <Route path="/bairros/jardim-das-americas" element={<JardimAmericas />} />
            <Route path="/bairros/taruma" element={<Taruma />} />
            <Route path="/bairros/capao-da-imbuia" element={<CapaoImbuia />} />
            <Route path="/bairros/hauer" element={<Hauer />} />
            <Route path="/bairros/alto-boqueirao" element={<AltoBoqueiraoCtba />} />
            <Route path="/bairros/sitio-cercado" element={<SitioCercado />} />
            <Route path="/bairros/novo-mundo" element={<NovoMundo />} />
            <Route path="/bairros/fazendinha" element={<Fazendinha />} />
            <Route path="/bairros/jardim-botanico" element={<AguaVerdeBairro />} />
            <Route path="/bairros/quississana-sjp" element={<QuissisanaSJP />} />
            <Route path="/bairros/academia-sjp" element={<AcademiaSJP />} />
            <Route path="/bairros/colonia-murici-sjp" element={<ColoniaMurcySJP />} />
            <Route path="/bairros/boneca-do-iguacu-sjp" element={<BonecaSJP />} />
            <Route path="/bairros/ouro-fino-sjp" element={<OuroFinoSJP />} />
            <Route path="/bairros/agricola-sjp" element={<AgricolareSJP />} />
            <Route path="/bairros/campo-largo-roseira-sjp" element={<CampoLargoSJP />} />
            <Route path="/bairros/italia-sjp" element={<ItaliaSJP />} />
            <Route path="/bairros/borda-campo-sjp" element={<BordoDoCampoSJP2 />} />
            <Route path="/bairros/independencia-sjp" element={<IndependenciaSJP />} />
            <Route path="/bairros/osvaldo-cruz-colombo" element={<OswaldoCruzColombo />} />
            <Route path="/bairros/sao-dimas-colombo" element={<ColareColombo />} />
            <Route path="/bairros/campina-grande-colombo" element={<CampinaGrandeColombo />} />
            <Route path="/bairros/taxiqueira-colombo" element={<TaxiqueiraColomboo />} />
            <Route path="/bairros/embu-colombo" element={<EmbuColombo />} />
            <Route path="/bairros/jardim-uniao-piraquara" element={<JardimUniaoPiraquara />} />
            <Route path="/bairros/jardim-santo-antonio-piraquara" element={<JardimSantoAntonioPiraquara />} />
            <Route path="/bairros/jardim-sao-paulo-piraquara" element={<JardimSaoPauloPiraquara />} />
            <Route path="/bairros/irai-piraquara" element={<IraiPiraquara />} />
            <Route path="/bairros/boa-vista-at" element={<BoaVistaTamandare />} />
            <Route path="/bairros/campo-tenente-at" element={<CampoDoTenenteTamandare />} />
            <Route path="/bairros/jardim-paranagua-at" element={<JardimParanaguaTamandare />} />
            <Route path="/bairros/jardim-sao-jorge-at" element={<JardimSaoJorgeTamandare />} />
            <Route path="/bairros/parque-industrial-frg" element={<EucaliptosFRG2 />} />
            <Route path="/bairros/jardim-condor-frg" element={<JardimCondorFRG />} />
            <Route path="/bairros/jardim-ipe-frg" element={<JardimIperigoFRG />} />
            <Route path="/bairros/jardim-das-pedras-frg" element={<JardimDasPedrasFRG />} />
            <Route path="/bairros/joquei-clube-cm" element={<JoqueiFRCM />} />
            <Route path="/bairros/antonio-olivero-cm" element={<AntonioOliveraCM />} />
            <Route path="/bairros/espigao-alegre-cm" element={<EspigoAlegreCM />} />
            <Route path="/bairros/jardim-florestal-qb" element={<JardimFlorestalQB />} />
            <Route path="/bairros/jardim-japao-qb" element={<JardimJaponeQB />} />
            <Route path="/bairros/graciosa-qb" element={<GraciosaMirQB />} />
            <Route path="/bairros/boqueirao" element={<Boqueirao />} />
            <Route path="/bairros/bacacheri" element={<Bacacheri />} />
            <Route path="/bairros/tingui" element={<Tingui />} />

            {/* Novos Bairros Araucária */}
            <Route path="/bairros/chapada" element={<ChapadaAraucaria />} />
            <Route path="/bairros/costeira-araucaria" element={<CosteiraAraucaria />} />
            <Route path="/bairros/iguacu-araucaria" element={<IguacuAraucaria />} />
            <Route path="/bairros/campina-da-barra" element={<CampinaDaBarra />} />
            <Route path="/bairros/porto-das-laranjeiras" element={<PortoDasLaranjeiras />} />
            <Route path="/bairros/tindiquera" element={<Tindiquera />} />
            <Route path="/bairros/barigui-araucaria" element={<BariguiAraucaria />} />
            <Route path="/bairros/fazenda-velha-araucaria" element={<FazendaVelhaAraucaria />} />
            <Route path="/bairros/estacao-araucaria" element={<EstacaoAraucaria />} />
            <Route path="/bairros/boqueirao-araucaria" element={<BoqueiraoAraucaria />} />
            <Route path="/bairros/sabia" element={<SabiaAraucaria />} />
            <Route path="/bairros/passauna" element={<PassaunaAraucaria />} />
            <Route path="/bairros/guajuvira" element={<GuajuviraAraucaria />} />

            {/* Novos Bairros Colombo */}
            <Route path="/bairros/alto-maracana" element={<AltoMaracanaColombo />} />
            <Route path="/bairros/atuba-colombo" element={<AtubaColombo />} />
            <Route path="/bairros/campo-pequeno" element={<CampoPequenoColombo />} />
            <Route path="/bairros/fatima-colombo" element={<FatimaColombo />} />
            <Route path="/bairros/gabirobal" element={<GabirobalColombo />} />
            <Route path="/bairros/jardim-osasco" element={<JardimOsascoColombo />} />
            <Route path="/bairros/monza-colombo" element={<MonzaColombo />} />
            <Route path="/bairros/palmital-colombo" element={<PalmitalColombo />} />
            <Route path="/bairros/roca-grande" element={<RocaGrandeColombo />} />
            <Route path="/bairros/sao-gabriel-colombo" element={<SaoGabrielColombo />} />
            <Route path="/bairros/santa-terezinha-colombo" element={<SantaTerezinhaColombo />} />

            {/* Novos Bairros Pinhais */}
            <Route path="/bairros/emiliano-perneta" element={<EmilianoPerneta />} />
            <Route path="/bairros/maria-antonieta" element={<MariaAntonieta />} />
            <Route path="/bairros/vargem-grande" element={<VargemGrande />} />
            <Route path="/bairros/estancia-pinhais" element={<EstanciaPinhais />} />
            <Route path="/bairros/alto-taruma" element={<AltoTaruma />} />
            <Route path="/bairros/graciosa" element={<GraciosaPinhais />} />
            <Route path="/bairros/jardim-amelia" element={<JardimAmelia />} />
            <Route path="/bairros/palmital-pinhais" element={<PalmitalPinhais />} />
            <Route path="/bairros/atuba-pinhais" element={<AtubaPinhais />} />
            <Route path="/bairros/sete-vilas" element={<SeteVilas />} />
            <Route path="/bairros/vila-taruma" element={<VilaTaruma />} />
            <Route path="/bairros/vale-das-aguas" element={<ValeDasAguas />} />
            <Route path="/bairros/jardim-claudia" element={<JardimClaudia />} />

            {/* Novos Bairros Campo Largo */}
            <Route path="/bairros/jardim-america-campo-largo" element={<JardimAmericaCL />} />
            <Route path="/bairros/botiatuva" element={<BotiatuvaCL />} />
            <Route path="/bairros/rondinha" element={<RondinhaCL />} />
            <Route path="/bairros/sao-silvestre" element={<SaoSilvestreCL />} />
            <Route path="/bairros/tres-corregos" element={<TresCorregosCL />} />
            <Route path="/bairros/itaqui" element={<ItaquiCL />} />
            <Route path="/bairros/ouro-fino" element={<OuroFinoCL />} />
            <Route path="/bairros/bateias" element={<BateiasCL />} />
            <Route path="/bairros/palmital-campo-largo" element={<PalmitalCL />} />
            <Route path="/bairros/santa-cruz-campo-largo" element={<SantaCruzCL />} />
            <Route path="/bairros/correia-de-freitas" element={<CorreiaDeFreitasCL />} />
            <Route path="/bairros/jardim-planalto-campo-largo" element={<JardimPlanaltoCL />} />
            <Route path="/bairros/vila-solene" element={<VilaSoleneCL />} />

            {/* Novos Bairros FRG */}
            <Route path="/bairros/iguacu-frg" element={<IguacuFRG />} />
            <Route path="/bairros/gralha-azul" element={<GralhaAzulFRG />} />
            <Route path="/bairros/santa-terezinha-frg" element={<SantaTerezinhaFRG />} />
            <Route path="/bairros/jardim-estados" element={<JardimEstadosFRG />} />
            <Route path="/bairros/pioneiros-frg" element={<PioneirosFRG />} />
            <Route path="/bairros/sao-lourenco-frg" element={<SaoLourencoFRG />} />
            <Route path="/bairros/hortencia-frg" element={<HortenciaFRG />} />

            {/* Novos Bairros AT */}
            <Route path="/bairros/tangua-at" element={<TanguaAT />} />
            <Route path="/bairros/sao-venancio" element={<SaoVenancioAT />} />
            <Route path="/bairros/jardim-graziela" element={<JardimGrazielaAT />} />
            <Route path="/bairros/jardim-roma" element={<JardimRomaAT />} />
            <Route path="/bairros/colonia-antonio-prado" element={<ColoniaAntonioPradoAT />} />
            <Route path="/bairros/tranqueira-at" element={<TranqueiraAT />} />
            <Route path="/bairros/jardim-paraiso-at" element={<JardimParaisoAT />} />

            {/* Novos Bairros Piraquara */}
            <Route path="/bairros/centro-piraquara" element={<CentroPiraquara />} />
            <Route path="/bairros/jardim-primavera-piraquara" element={<JardimPrimaveraPiraquara />} />
            <Route path="/bairros/planta-deodoro-piraquara" element={<PlantaDeodoroPiraquara />} />
            <Route path="/bairros/vila-macedo-piraquara" element={<VilaMacedoPiraquara />} />
            <Route path="/bairros/guarituba-piraquara" element={<GuaritubaPiraquara />} />
            <Route path="/bairros/prado-velho-piraquara" element={<PradoVelhoPiraquara />} />
            <Route path="/bairros/sao-cristao-piraquara" element={<SaoCristaoPiraquara />} />
            <Route path="/bairros/jardim-bela-vista-piraquara" element={<JardimBelaVistaPiraquara />} />
            <Route path="/bairros/caiua-piraquara" element={<CaiuaPiraquara />} />

            {/* Novos Bairros Campo Magro */}
            <Route path="/bairros/centro-campo-magro" element={<CentroCampoMagro />} />
            <Route path="/bairros/sede-campo-magro" element={<SedeCampoMagro />} />
            <Route path="/bairros/jardim-boa-vista-cm" element={<JardimBoaVistaCM />} />
            <Route path="/bairros/sao-sebastiao-cm" element={<SaoSebastiaoCM />} />
            <Route path="/bairros/rio-verde-cm" element={<RioVerdeCM />} />
            <Route path="/bairros/botiatuva-cm" element={<BotiatuvaCM />} />

            {/* Novos Bairros Quatro Barras */}
            <Route path="/bairros/centro-quatro-barras" element={<CentroQuatroBarras />} />
            <Route path="/bairros/jardim-menino-deus-qb" element={<JardimMeninoDeusQB />} />
            <Route path="/bairros/vila-sao-jose-qb" element={<VilaSaoJoseQB />} />
            <Route path="/bairros/borda-do-campo-qb" element={<BordaDoCampoQB />} />
            <Route path="/bairros/sao-lourenco-qb" element={<SaoLourencoQB />} />
            <Route path="/bairros/vila-maria-qb" element={<VilaMariaQB />} />

            {/* Novos Bairros SJP */}
            <Route path="/bairros/cidade-jardim-sjp" element={<CidadeJardimSJP />} />
            <Route path="/bairros/pedro-moro-sjp" element={<PedroMoroSJP />} />
            <Route path="/bairros/ipe-sjp" element={<IpeSJP />} />
            <Route path="/bairros/rio-pequeno-sjp" element={<RioPequenoSJP />} />
            <Route path="/bairros/borda-do-campo-sjp" element={<BordaDoCampoSJP />} />
            
            {/* Landing Pages Ads */}
            <Route path="/ads/tecnico-informatica-curitiba" element={<TecnicoInformaticaCuritibaAds />} />
            
            {/* CFTV */}
            <Route path="/cftv" element={<CFTVPage />} />
            <Route path="/cftv/curitiba" element={<CFTVCuritiba />} />
            <Route path="/cftv/sao-jose-dos-pinhais" element={<CFTVSaoJosePinhais />} />
            <Route path="/cftv/litoral" element={<CFTVLitoral />} />
            <Route path="/cftv/guaratuba" element={<CFTVGuaratuba />} />
            <Route path="/cftv/araucaria" element={<CFTVAraucaria />} />
            <Route path="/cftv/campo-largo" element={<CFTVCampoLargo />} />
            <Route path="/cftv/pinhais" element={<CFTVPinhais />} />
            
            {/* Serviços essenciais — slugs canônicos (SEO local curado) */}
            <Route path="/servicos/formatacao" element={<ServicoCore slug="formatacao" />} />
            <Route path="/servicos/manutencao-de-notebook" element={<ServicoCore slug="manutencao-de-notebook" />} />
            <Route path="/servicos/manutencao-de-computador" element={<ServicoCore slug="manutencao-de-computador" />} />
            <Route path="/servicos/upgrade-ssd-ram" element={<ServicoCore slug="upgrade-ssd-ram" />} />
            <Route path="/servicos/remocao-de-virus" element={<ServicoCore slug="remocao-de-virus" />} />
            <Route path="/servicos/recuperacao-de-dados" element={<ServicoCore slug="recuperacao-de-dados" />} />
            <Route path="/servicos/redes-e-wifi" element={<ServicoCore slug="redes-e-wifi" />} />
            <Route path="/servicos/suporte-tecnico-empresarial" element={<ServicoCore slug="suporte-tecnico-empresarial" />} />
            <Route path="/servicos/manutencao-preventiva-empresas" element={<ServicoCore slug="manutencao-preventiva-empresas" />} />
            <Route path="/servicos/backup-para-empresas" element={<ServicoCore slug="backup-para-empresas" />} />
            <Route path="/servicos/suporte-home-office" element={<ServicoCore slug="suporte-home-office" />} />
            <Route path="/servicos/montagem-de-pc" element={<ServicoCore slug="montagem-de-pc" />} />
            {/* Rodada 3Y — expansão premium multieletrônicos (bancada + coleta) */}
            <Route path="/servicos/conserto-tv" element={<ServicoCore slug="conserto-tv" />} />
            <Route path="/servicos/conserto-placa" element={<ServicoCore slug="conserto-placa" />} />
            <Route path="/servicos/conserto-monitor" element={<ServicoCore slug="conserto-monitor" />} />

            {/* Redirects de slugs herdados para os canônicos */}

            {/* Aliases de keyword (raiz) → páginas canônicas de serviço.
                Evita canibalização: uma única URL indexável por intenção. */}


            {/* Páginas herdadas/thin — mantidas funcionando, mas com noindex */}
            <Route path="/servicos/montagem-pc" element={<MontagemPc />} />
            <Route path="/servicos/computador-lento" element={<ComputadorLento />} />
            <Route path="/servicos/computador-nao-liga" element={<ComputadorNaoLiga />} />
            <Route path="/servicos/manutencao-tv" element={<ManutencaoTV />} />
            <Route path="/servicos/conserto-celular" element={<ConsertoCelular />} />
            
            
            {/* Páginas combinadas Serviço + Bairro (SEO local) */}
            <Route path="/servicos/formatacao-computador/centro" element={<FormatacaoCentro />} />
            <Route path="/servicos/conserto-pc-notebook/batel" element={<ConsertoNotebookBatel />} />
            <Route path="/servicos/remocao-virus/portao" element={<RemocaoVirusPortao />} />
            <Route path="/servicos/upgrade-ssd-memoria/santa-felicidade" element={<UpgradeSsdSantaFelicidade />} />
            <Route path="/servicos/formatacao-computador/sao-jose-dos-pinhais" element={<FormatacaoSaoJosePinhais />} />
            <Route path="/servicos/conserto-pc-notebook/cic" element={<ConsertoNotebookCIC />} />
            <Route path="/servicos/redes-wifi/araucaria" element={<RedesWifiAraucaria />} />
            <Route path="/servicos/remocao-virus/centro" element={<RemocaoVirusCentro />} />
            <Route path="/servicos/upgrade-ssd-memoria/batel" element={<UpgradeSsdBatel />} />
            <Route path="/servicos/formatacao-computador/portao" element={<FormatacaoPortao />} />
            <Route path="/servicos/redes-wifi/cic" element={<RedesWifiCIC />} />
            {/* Wi-Fi + TV Smart por bairro (indexáveis) */}
            <Route path="/servicos/redes-wifi/batel" element={<RedesWifiBatel />} />
            <Route path="/servicos/redes-wifi/centro" element={<RedesWifiCentro />} />
            <Route path="/servicos/redes-wifi/agua-verde" element={<RedesWifiAguaVerde />} />
            <Route path="/servicos/redes-wifi/portao" element={<RedesWifiPortao />} />
            <Route path="/servicos/manutencao-tv/batel" element={<ManutencaoTvBatel />} />
            <Route path="/servicos/manutencao-tv/centro" element={<ManutencaoTvCentro />} />
            <Route path="/servicos/manutencao-tv/agua-verde" element={<ManutencaoTvAguaVerde />} />
            <Route path="/servicos/manutencao-tv/cic" element={<ManutencaoTvCic />} />
            <Route path="/servicos/manutencao-tv/portao" element={<ManutencaoTvPortao />} />
            {/* Onda 2 — 7 bairros âncora restantes (Wi-Fi + TV Smart) */}
            <Route path="/servicos/redes-wifi/bigorrilho" element={<RedesWifiBigorrilho />} />
            <Route path="/servicos/redes-wifi/cabral" element={<RedesWifiCabral />} />
            <Route path="/servicos/redes-wifi/boa-vista" element={<RedesWifiBoaVista />} />
            <Route path="/servicos/redes-wifi/cristo-rei" element={<RedesWifiCristoRei />} />
            <Route path="/servicos/redes-wifi/cajuru" element={<RedesWifiCajuru />} />
            <Route path="/servicos/redes-wifi/boqueirao" element={<RedesWifiBoqueirao />} />
            <Route path="/servicos/manutencao-tv/bigorrilho" element={<ManutencaoTvBigorrilho />} />
            <Route path="/servicos/manutencao-tv/cabral" element={<ManutencaoTvCabral />} />
            <Route path="/servicos/manutencao-tv/santa-felicidade" element={<ManutencaoTvSantaFelicidade />} />
            <Route path="/servicos/manutencao-tv/boa-vista" element={<ManutencaoTvBoaVista />} />
            <Route path="/servicos/manutencao-tv/cristo-rei" element={<ManutencaoTvCristoRei />} />
            <Route path="/servicos/manutencao-tv/cajuru" element={<ManutencaoTvCajuru />} />
            <Route path="/servicos/manutencao-tv/boqueirao" element={<ManutencaoTvBoqueirao />} />
            {/* Onda 3 — 4 novos bairros âncora (Wi-Fi + TV Smart) */}
            <Route path="/servicos/redes-wifi/jardim-das-americas" element={<RedesWifiJardimAmericas />} />
            <Route path="/servicos/manutencao-tv/jardim-das-americas" element={<ManutencaoTvJardimAmericas />} />
            <Route path="/servicos/redes-wifi/ecoville" element={<RedesWifiEcoville />} />
            <Route path="/servicos/manutencao-tv/ecoville" element={<ManutencaoTvEcoville />} />
            <Route path="/servicos/redes-wifi/alto-da-xv" element={<RedesWifiAltoXV />} />
            <Route path="/servicos/manutencao-tv/alto-da-xv" element={<ManutencaoTvAltoXV />} />
            <Route path="/servicos/redes-wifi/reboucas" element={<RedesWifiReboucas />} />
            <Route path="/servicos/manutencao-tv/reboucas" element={<ManutencaoTvReboucas />} />
            <Route path="/servicos/backup-recuperacao/centro" element={<BackupCentro />} />
            <Route path="/servicos/conserto-pc-notebook/portao" element={<ConsertoNotebookPortao />} />
            <Route path="/servicos/redes-wifi/santa-felicidade" element={<RedesWifiSantaFelicidadeAncora />} />
            <Route path="/servicos/formatacao-computador/campo-comprido" element={<FormatacaoCampoComprido />} />
            <Route path="/servicos/remocao-virus/batel" element={<RemocaoVirusBatel />} />
            <Route path="/servicos/montagem-pc/cic" element={<MontagemPcCIC />} />
            
            {/* SJP - Serviço + Cidade */}
            <Route path="/servicos/remocao-virus/sao-jose-dos-pinhais" element={<RemocaoVirusSaoJosePinhais />} />
            <Route path="/servicos/conserto-pc-notebook/sao-jose-dos-pinhais" element={<ConsertoNotebookSaoJosePinhais />} />
            <Route path="/servicos/upgrade-ssd-memoria/sao-jose-dos-pinhais" element={<UpgradeSsdSaoJosePinhais />} />
            <Route path="/servicos/redes-wifi/sao-jose-dos-pinhais" element={<RedesWifiSaoJosePinhais />} />
            
            {/* Araucária - Serviço + Cidade */}
            <Route path="/servicos/formatacao-computador/araucaria" element={<FormatacaoAraucaria />} />
            <Route path="/servicos/remocao-virus/araucaria" element={<RemocaoVirusAraucaria />} />
            <Route path="/servicos/conserto-pc-notebook/araucaria" element={<ConsertoNotebookAraucaria />} />
            <Route path="/servicos/upgrade-ssd-memoria/araucaria" element={<UpgradeSsdAraucaria />} />
            
            {/* Campo Largo - Serviço + Cidade */}
            <Route path="/servicos/formatacao-computador/campo-largo" element={<FormatacaoCampoLargo />} />
            <Route path="/servicos/remocao-virus/campo-largo" element={<RemocaoVirusCampoLargo />} />
            <Route path="/servicos/conserto-pc-notebook/campo-largo" element={<ConsertoNotebookCampoLargo />} />
            <Route path="/servicos/redes-wifi/campo-largo" element={<RedesWifiCampoLargo />} />
            
            {/* Pinhais - Serviço + Cidade */}
            <Route path="/servicos/formatacao-computador/pinhais" element={<FormatacaoPinhais />} />
            <Route path="/servicos/remocao-virus/pinhais" element={<RemocaoVirusPinhais />} />
            <Route path="/servicos/conserto-pc-notebook/pinhais" element={<ConsertoNotebookPinhais />} />
            <Route path="/servicos/upgrade-ssd-memoria/pinhais" element={<UpgradeSsdPinhais />} />
            <Route path="/servicos/redes-wifi/pinhais" element={<RedesWifiPinhais />} />
            
            {/* Dynamic service+bairro/city route (bairro-âncora gera landing local dedicada) */}
            <Route path="/servicos/:servico/:cidade" element={<ServicoCidadePage />} />
            
            {/* Procedimentos Técnicos em Placa */}
            <Route path="/procedimentos-placa" element={<ProcedimentosPlaca />} />
            <Route path="/procedimentos/:slug" element={<ProblemaPage />} />

            {/* Páginas de Marcas */}
            <Route path="/marcas" element={<Marcas />} />
            <Route path="/marcas/:slug" element={<MarcaPage />} />
            
            {/* Redirects das URLs antigas de procedimentos */}
            
            {/* Páginas de Problema / Intenção de Busca (213 páginas dinâmicas) */}
            <Route path="/problemas/notebook-nao-liga" element={<NotebookNaoLiga />} />
            <Route path="/problemas/computador-lento" element={<ProblemaComputadorLento />} />
            <Route path="/problemas/tela-azul-windows" element={<ProblemaTelaAzulWindows />} />
            <Route path="/problemas/notebook-nao-carrega-bateria" element={<ProblemaNotebookNaoCarregaBateria />} />
            <Route path="/problemas/tv-nao-liga" element={<ProblemaTvNaoLiga />} />
            <Route path="/problemas/computador-desliga-sozinho" element={<ProblemaComputadorDesligaSozinho />} />
            <Route path="/problemas/wifi-caindo-toda-hora" element={<ProblemaWifiCaindoTodaHora />} />
            <Route path="/problemas/tv-com-som-sem-imagem" element={<ProblemaTvComSomSemImagem />} />
            <Route path="/problemas/notebook-molhado" element={<ProblemaNotebookMolhado />} />
            <Route path="/problemas/tela-de-notebook-quebrada" element={<ProblemaTelaNotebookQuebrada />} />
            <Route path="/problemas/hd-nao-reconhecido" element={<ProblemaHdNaoReconhecido />} />
            <Route path="/problemas/computador-nao-liga" element={<ProblemaComputadorNaoLiga />} />
            <Route path="/problemas/teclado-de-notebook-nao-funciona" element={<ProblemaTecladoNotebook />} />
            <Route path="/problemas/computador-fazendo-barulho" element={<ProblemaComputadorBarulho />} />
            <Route path="/problemas/tv-com-linhas-na-tela" element={<ProblemaTvLinhas />} />
            <Route path="/problemas/notebook-com-tela-preta" element={<ProblemaNotebookTelaPreta />} />
            <Route path="/problemas/tv-desligando-sozinha" element={<ProblemaTvDesligando />} />
            <Route path="/problemas/tv-sem-som" element={<ProblemaTvSemSom />} />
            <Route path="/problemas/impressora-nao-imprime" element={<ProblemaImpressoraNaoImprime />} />
            <Route path="/problemas/monitor-sem-sinal" element={<ProblemaMonitorSemSinal />} />
            <Route path="/problemas/notebook-lento" element={<ProblemaNotebookLento />} />
            <Route path="/problemas/computador-travando" element={<ProblemaComputadorTravando />} />
            <Route path="/problemas/notebook-desligando-sozinho" element={<ProblemaNotebookDesligandoSozinho />} />
            <Route path="/problemas/pen-drive-nao-reconhecido" element={<ProblemaPenDriveNaoReconhecido />} />
            <Route path="/problemas/touchpad-nao-funciona" element={<ProblemaTouchpadNaoFunciona />} />
            <Route path="/problemas/dobradica-do-notebook-quebrada" element={<ProblemaDobradicaNotebookQuebrada />} />
            <Route path="/problemas/computador-sem-som" element={<ProblemaComputadorSemSom />} />
            <Route path="/problemas/tela-do-computador-piscando" element={<ProblemaTelaDoComputadorPiscando />} />
            <Route path="/problemas/tv-travando" element={<ProblemaTvTravando />} />
            <Route path="/problemas/mouse-nao-funciona" element={<ProblemaMouseNaoFunciona />} />
            <Route path="/problemas/notebook-nao-conecta-no-wifi" element={<ProblemaNotebookNaoConectaWifi />} />
            <Route path="/problemas/windows-nao-inicia" element={<ProblemaWindowsNaoInicia />} />
            <Route path="/problemas/webcam-nao-funciona" element={<ProblemaWebcamNaoFunciona />} />
            <Route path="/problemas" element={<ProblemasHub />} />
            <Route path="/problemas/tv-nao-conecta-no-wifi" element={<ProblemaTvNaoConectaWifi />} />
            <Route path="/problemas/tv-com-imagem-escura" element={<ProblemaTvComImagemEscura />} />

            <Route path="/problemas/notebook-superaquecendo" element={<ProblemaNotebookSuperaquecendo />} />
            <Route path="/guia-tecnico-informatica" element={<GuiaTecnicoInformatica />} />
            <Route path="/problemas/:slug" element={<ProblemaPage />} />
            <Route path="/assistencia-tecnica-curitiba" element={<AssistenciaTecnicaCuritiba />} />
            <Route path="/termos-e-condicoes" element={<TermosCondicoes />} />
            <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/politica-de-cookies-e-anuncios" element={<PoliticaCookiesAnuncios />} />
            <Route path="/status-de-anuncios" element={<StatusAnuncios />} />
            <Route path="/anuncie" element={<Anuncie />} />
            <Route path="/patrocinadores" element={<Navigate to="/anuncie" replace />} />

            <Route path="/funil-indisponivel" element={<FunilIndisponivel />} />
            <Route path="/ordem-de-servico" element={<OrdemDeServico />} />
            <Route path="/status-da-ordem-de-servico" element={<StatusOs />} />
            <Route path="/status-os" element={<StatusOs />} />
            <Route path="/depoimentos" element={<Depoimentos />} />
            <Route path="/como-avaliar" element={<ComoAvaliar />} />

            {/* Admin */}
            <Route path="/admin" element={<Navigate to="/admin/funnel" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/funnel" element={<AdminFunnel />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/vitals" element={<AdminVitals />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/casos" element={<AdminCasos />} />
            <Route path="/admin/auditoria-os" element={<AdminOsAudit />} />
            <Route path="/admin/operacao" element={<AdminOperacao />} />
            <Route path="/admin/provas-monitor" element={<AdminProvasMonitor />} />
            <Route path="/admin/provas-verticais" element={<AdminProvasVerticais />} />
            <Route path="/admin/conversao" element={<AdminConversao />} />
            <Route path="/admin/publicacao" element={<AdminPublishStatus />} />
            <Route path="/admin/fotos-bairros" element={<AdminFotosBairros />} />

            {/* Rede de parceiros prestadores (fail-closed: noindex sem prova real) */}
            <Route path="/parceiros" element={<ParceirosHub />} />
            <Route path="/parceiros/:slug" element={<ParceiroPage />} />

            <Route path="/conserto-impressora-curitiba" element={<ConsertoImpressoraCuritiba />} />
            <Route path="/assistencia-eletrodomesticos-inteligentes-curitiba" element={<AssistenciaEletrodomesticosInteligentesCuritiba />} />

            {/* Hubs SEO Categorias × Local (TV, Som, Videogame, Celular) */}
            <Route path="/conserto-tv-curitiba" element={<ConsertoTVHub />} />
            <Route path="/conserto-tv/:local" element={<ConsertoTVCity />} />
            <Route path="/conserto-som-curitiba" element={<ConsertoSomHub />} />
            <Route path="/conserto-som/:local" element={<ConsertoSomCity />} />
            <Route path="/conserto-videogame-curitiba" element={<ConsertoVideogameHub />} />
            <Route path="/conserto-videogame/:local" element={<ConsertoVideogameCity />} />
            <Route path="/conserto-celular-curitiba" element={<ConsertoCelularLocalHub />} />
            <Route path="/conserto-celular/:local" element={<ConsertoCelularLocalCity />} />

            <Route path="/status" element={<Status />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <IdleEnhancements />
      </BrowserRouter>
      </AppErrorBoundary>
);

export default App;
