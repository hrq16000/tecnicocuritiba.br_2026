# Operação administrativa de Ordens de Serviço — rodada pré-D14

Data: 2026-08-25 · Janela: **WAIT (D14 LOCKED até 08/09/2026 01:49 UTC)**
Escopo autorizado: camada operacional/administrativa. Nenhuma iniciativa de SEO.

## 1. O que foi entregue

| Camada | Entrega |
| --- | --- |
| Banco | `ordens_servico` estendida (diagnóstico, serviço, peças JSONB, valores, técnico, datas); tabelas `os_eventos`, `os_lembretes`, `os_pdf_snapshots` com RLS restrita a `has_role(auth.uid(), 'admin')` |
| Domínio | `src/lib/os/statusOs.ts` (máquina de estados + motor financeiro determinístico) |
| Comunicação | `src/lib/os/whatsappOs.ts` (templates validados, sem placeholder vazio, deep link `wa.me` normalizado) |
| Servidor | `src/lib/os/osAdmin.functions.ts` (listagem, CRUD, transição com timeline, lembretes, snapshots), todas com `requireSupabaseAuth` + verificação de role |
| PDF | `src/lib/os/osAdminPdf.ts` (jsPDF, omissão de campos vazios, assinatura SHA-256 por versão) |
| UI interna | `/admin/ordens`, `/admin/ordens/nova`, `/admin/ordens/$protocolo` — todas `noindex, nofollow` |

## 2. Governança de privacidade

Gate novo `npm run check:os-privacidade` (fail-closed, ligado ao CI). Verifica:

1. toda rota `admin.ordens*` declara `noindex`;
2. nenhum sitemap público referencia `/admin` ou ordens;
3. nenhum módulo de analytics consome telefone, nome do cliente, diagnóstico ou número de série;
4. as server functions administrativas só são importadas por superfície interna;
5. nenhuma referência a `service_role` no código de O.S.

Resultado atual: **PASS**.

## 3. Testes

- `src/__tests__/os-admin.test.ts` — 11 casos: transições válidas/inválidas, terminalidade, cancelamento, cálculo com peças e desconto, recusa de total negativo, templates sem placeholder inválido, omissão de linhas sem dado, recusa de telefone inválido, assinatura de PDF sensível ao estado.
- `src/__tests__/os-privacidade-selo.test.ts` — 6 casos: privacidade das rotas, ausência em sitemaps, ausência de analytics no painel e **detector de discrepância selo × arquivo** para rotas críticas.

Total: 17 testes, todos verdes.

## 4. Drift pré-existente resolvido

`src/routes/problemas.tv-sem-som.tsx` aparecia como `PUBLIC_CHANGE` desde o selo FREEZE_V2 `fb95e1e4…`.

Diagnóstico: o arquivo em disco é **idêntico ao commit HEAD** — o selo havia capturado um estado transitório de build (injeção de head), não uma mudança pública. Portanto não é intervenção e não entra no ledger de coortes.

Correção via `npm run freeze:corrigir-selo src/routes/problemas.tv-sem-som.tsx`, que só aceita arquivos comprovadamente iguais ao HEAD e registra a correção em `correcoesSelo` + histórico append-only.

- Selo anterior: `fb95e1e4d676…`
- Selo corrigido: `b12f35b43683…`
- URLs congeladas, coortes (91 / 2 / 37) e FREEZE_V1: **inalterados**
- Drift público não registrado: **0**

## 5. Estado do experimento

| Item | Valor |
| --- | --- |
| Universo curado | 130 URLs |
| Coortes | CLEAN 91 · DIRECT 2 · INDIRECT 37 |
| PUBLIC_CHANGE não registrado | 0 |
| Gate temporal D14 | LOCKED até 08/09/2026 01:49 UTC |
| Decisão SEO | WAIT |

**Veredito: ADMIN OPERATION READY — SEO FREEZE PRESERVED.**
