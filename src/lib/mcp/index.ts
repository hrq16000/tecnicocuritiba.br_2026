import { auth, defineMcp } from "@lovable.dev/mcp-js";
import validateSeo from "./tools/validate-seo";
import validateJsonld from "./tools/validate-jsonld";
import checkGeoConformance from "./tools/check-geo-conformance";

export default defineMcp({
  name: "tecnico-curitiba-br",
  title: "Tecnico.Curitiba.br",
  version: "0.1.0",
  instructions:
    "Ferramentas de validação técnica de SEO do site Técnico em Curitiba. Use `validate_seo` para conferir title, description, canonical, og:url e H1 de uma rota pública; `validate_jsonld` para extrair e validar os blocos schema.org; e `check_geo_conformance` para auditar em lote a conformidade GEO (conteúdo legível sem JavaScript) de várias rotas. Todas leem apenas HTML público do site.",
  tools: [validateSeo, validateJsonld, checkGeoConformance],
});
