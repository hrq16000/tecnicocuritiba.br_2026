# Política de Poda de Bairros — tecnico.curitiba.br

Objetivo: eliminar *thin content* e canibalização entre as ~230 páginas de bairro
herdadas do remix, mantendo apenas um conjunto enxuto de **bairros-âncora reais**
de Curitiba com demanda de busca e conteúdo distinto.

## Regra quantitativa

- **Máximo de 13 bairros-âncora indexáveis** (apenas Curitiba capital).
- Todo o restante das páginas de bairro permanece `noindex` e **fora do sitemap**
  (estado atual: `BairroTemplate` já aplica `noindex`; `sitemap-bairros.xml` só
  lista âncoras aprovadas).
- **Não** criar páginas por bairro para cidades da região metropolitana. Essas
  cidades usam somente a página dedicada `/tecnico-informatica-<cidade>`
  (Curitiba, São José dos Pinhais, Pinhais, Colombo, Araucária, Campo Largo,
  Almirante Tamandaré, Fazenda Rio Grande, Piraquara, Campo Magro, Quatro Barras).

## Lista de bairros-âncora (13) — Curitiba

Selecionados por demanda comercial + densidade populacional + distinção de conteúdo:

1. Centro
2. Batel
3. Água Verde
4. Portão
5. Bigorrilho
6. Cabral
7. Santa Felicidade
8. Boa Vista
9. CIC (Cidade Industrial de Curitiba)
10. Jardim das Américas
11. Ecoville
12. Alto da XV
13. Rebouças

## Bairros rebaixados (permanecem noindex, URL preservada)

Removidos da lista âncora após revisão de canibalização e ROI. URL continua
respondendo (SEO evolutivo — nunca removemos URLs), mas com `noindex` e
fora do sitemap:

- Cajuru — canibalização com Boqueirão + baixa densidade comercial de busca.
- Cristo Rei — sobreposição de intenção com Centro / Alto da XV.
- Boqueirão — competição orgânica muito alta para ROI atual; retomar em onda futura.

## Critérios para um bairro entrar/sair da lista-âncora

Só é elegível a indexação quando cumpre TODOS:

- Bloco `narrativaLocal` com **≥ 300 palavras próprias** (perfil urbano,
  tipos de imóvel, particularidades de rede/TV, referências geográficas
  específicas). Validado por `scripts/validate-bairro-copy.mjs`.
- Sem `aggregateRating`/reviews fictícios (regra de integridade de schema).
- Canonical/@id consistentes com `https://tecnico.curitiba.br`.
- Sem sobreposição de intenção com outra página-âncora (evita canibalização).

Se um bairro não cumprir os critérios, permanece `noindex` e fora do sitemap —
não é excluído.

## Estado atual (Onda 1 de liberação de índice)

- Páginas de bairro herdadas: `noindex` ativo, ausentes do sitemap.
- Indexáveis hoje: 9 hubs `/bairros/<slug>` + 27 landings serviço × bairro
  + 8 landings Wi-Fi/TV Smart (Jardim das Américas, Ecoville, Alto da XV,
  Rebouças — os 4 bairros com `narrativaLocal` exclusiva validada).
- Os 5 âncoras grandfathered (Centro, Batel, Água Verde, Portão, CIC) seguem
  indexáveis, mas precisam de `narrativaLocal` própria antes de ganhar novas
  landings Wi-Fi/TV.
- Promoção de um bairro a âncora exige reescrita de `narrativaLocal` antes de
  remover o `noindex` e incluir no sitemap.
- Gate de referência: `node scripts/validate-bairro-copy.mjs` +
  `node scripts/check-sitemap-source.mjs` (ambos rodam no CI).

