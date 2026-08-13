# Template de brief e FAQ único por página

Obrigatório antes de remover `noindex` de qualquer página (artigo, sintoma, bairro Wi-Fi/TV).
O gate `npm run check:originality` valida corpo autoral mínimo e duplicidade; este brief é o
insumo humano que garante que a página nasça exclusiva.

## 1. Cabeçalho do brief

| Campo | Valor |
| --- | --- |
| URL canônica | `/...` |
| Família | editorial · problema · serviço · bairro Wi-Fi/TV |
| Intenção de busca | informacional · comercial · transacional |
| Consulta-alvo | (uma só, sem canibalizar página existente) |
| Página-pilar | `/servicos/...` |
| Página de apoio | `/...` |
| Prova visual real | mínimo 2 fotos próprias em `public/` (sem IA) |
| Palavras mínimas | 800 (editorial e sintomas) · 600 (bairro/serviço) |

## 2. Corpo autoral mínimo (≥ 800 palavras)

Seções obrigatórias, todas escritas do zero para esta URL:

1. **Abertura de contexto real** — quem procura isso e em que situação (2 parágrafos).
2. **Como o problema se manifesta** — sinais observáveis, com números e medições reais.
3. **Causas por ordem de frequência** — o que a bancada encontra na prática, com percentuais
   próprios da operação (nunca estatística inventada).
4. **O que fazemos em cada etapa** — diagnóstico, execução, teste final, entrega.
5. **Quando não compensa** — critério honesto de recusa ou encaminhamento.
6. **Condições comerciais** — preço-base, prazo, garantia escopada (via `precosConfig`).
7. **Seção exclusiva da URL** — bloco que não existe em nenhuma outra página:
   - bairro: perfil urbano, tipos de imóvel, particularidades de rede/energia, referências geográficas;
   - sintoma: sequência de testes específica daquele defeito;
   - editorial: caso técnico real anonimizado.

## 3. FAQ única (mínimo 5 perguntas)

Regras:

- nenhuma pergunta repetida em outra URL (validado por `check:faq-parity` e `check:meta-uniqueness`);
- linguagem de busca real ("quanto custa", "quanto tempo", "vale a pena", "perto de mim");
- resposta com 40–90 palavras, autoconclusiva, sem prometer prazo que não cumprimos;
- toda pergunta que entra no HTML entra também no `FAQPage` JSON-LD (paridade obrigatória).

| # | Pergunta | Ângulo obrigatório |
| --- | --- | --- |
| 1 | | preço/orçamento |
| 2 | | prazo |
| 3 | | garantia escopada |
| 4 | | logística (coleta/entrega, sem balcão) |
| 5 | | risco/limite técnico ("quando não compensa") |

## 4. Checklist de liberação

- [ ] Brief preenchido e revisado
- [ ] Corpo ≥ mínimo da família, sem trecho reciclado
- [ ] FAQ única + JSON-LD em paridade
- [ ] Fotos reais próprias declaradas (2+), com origem registrada
- [ ] Interlinking: pilar + apoio + 2 relacionados
- [ ] `npm run check:originality` verde para a URL
- [ ] URL adicionada a `scripts/lib/curated-urls.mjs` (e à onda, se for Wi-Fi/TV)
