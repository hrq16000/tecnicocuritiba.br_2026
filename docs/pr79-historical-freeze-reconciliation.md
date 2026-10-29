# PR #79 — reconciliação exata do drift histórico

Revisão em 28/10/2026 do HEAD `a0c4604015812aa75e00f86e4d0715e74c57b764`.

O gate de originalidade interrompia o CI antes do freeze. Depois da correção comprovada, o gate de freeze expôs 46 diferenças ainda sem registro: 40 arquivos já idênticos ao HEAD e seis sitemaps gerados.

A reconciliação usa o mecanismo existente de hashes exatos, vinculado ao selo histórico. Arquivos adicionados omitem before porque não existiam no selo; added:true documenta essa condição. Nenhuma exclusão, wildcard, classificação ou lógica do gate foi alterada. Bytes futuros diferentes continuam bloqueados.

Os seis XML foram reproduzidos pelo gerador original em clone depth=1, equivalente ao checkout padrão do Actions, e coincidem byte a byte com os hashes do selo histórico. As seis divergências locais vêm do lastmod derivado do histórico completo. Foram verificados 46 hashes exatos e 46 alterações futuras simuladas continuam bloqueadas. Mantêm 130 URLs e lastmod declarado; não usam o dia do build. Um clone com histórico completo pode gerar datas de fonte diferentes e não deve ser confundido com o artefato shallow revisado.

O selo public/freeze-v2.json, o ledger public/intervencoes-d0.json, os eventos existentes e as coortes D0/D7 não foram regravados. Esta revisão registra mudanças históricas de conteúdo, links, triagem e infraestrutura; não sustenta que as coortes posteriores ao selo ficaram sem intervenção.

O inventário JSON acompanha cada caminho, hashes anterior/atual, commit e data da última mudança e sua justificativa. Os três arquivos de originalidade acrescentados nesta rodada preservam seus registros independentes na reconciliação.

| Arquivo | Último commit de origem | Revisão |
| --- | --- | --- |
| `public/85fad1bb57c44507a97ed5bc051f6da8.txt` | `6f859cc3` | Arquivo público de validação IndexNow já versionado desde agosto; reconciliação de adição histórica, sem criação ou exposição de credencial privada. |
| `public/sitemap-bairros.xml` | `b4898b88` | Serialização dos mesmos 130 caminhos curados pelo gerador atual; lastmod declarado é o fallback documentado para clone shallow do CI. Não promove URL nem usa data do build. |
| `public/sitemap-editorial.xml` | `b4898b88` | Serialização dos mesmos 130 caminhos curados pelo gerador atual; lastmod declarado é o fallback documentado para clone shallow do CI. Não promove URL nem usa data do build. |
| `public/sitemap-main.xml` | `b4898b88` | Serialização dos mesmos 130 caminhos curados pelo gerador atual; lastmod declarado é o fallback documentado para clone shallow do CI. Não promove URL nem usa data do build. |
| `public/sitemap-problemas.xml` | `b4898b88` | Serialização dos mesmos 130 caminhos curados pelo gerador atual; lastmod declarado é o fallback documentado para clone shallow do CI. Não promove URL nem usa data do build. |
| `public/sitemap-regioes.xml` | `b4898b88` | Serialização dos mesmos 130 caminhos curados pelo gerador atual; lastmod declarado é o fallback documentado para clone shallow do CI. Não promove URL nem usa data do build. |
| `public/sitemap-servicos.xml` | `b4898b88` | Serialização dos mesmos 130 caminhos curados pelo gerador atual; lastmod declarado é o fallback documentado para clone shallow do CI. Não promove URL nem usa data do build. |
| `src/components/ImageLicenseCaption.tsx` | `014343cb` | Componente factual de crédito Unsplash/Pexels adicionado na PR #79; associa autor/licença à imagem existente. |
| `src/components/bairro/BairroLocalLayout.tsx` | `863dd8ca` | Interligação técnica e territorial já versionada em agosto: bairro/cidade para serviços, diagnósticos e localidades existentes. |
| `src/components/bairro/DicasLocaisList.tsx` | `dcd7a4ff` | Validação tipada dos dados de bairros e renderização segura das dicas locais já versionadas em agosto. |
| `src/components/cidade/CidadeLandingLayout.tsx` | `b1d79bff` | Interligação técnica e territorial já versionada em agosto: bairro/cidade para serviços, diagnósticos e localidades existentes. |
| `src/components/home/HeroPremium.tsx` | `1a22a3a8` | Ordem inicial de slides determinística para SSR; embaralhamento ocorre após hidratação, conforme mudança histórica de agosto. |
| `src/components/servico/RespostasConversacionais.tsx` | `bfda0104` | Blocos de respostas conversacionais e conteúdo técnico contextual por serviço já versionados em agosto. |
| `src/components/servico/ServicoLandingLayout.tsx` | `bfda0104` | Blocos de respostas conversacionais e conteúdo técnico contextual por serviço já versionados em agosto. |
| `src/components/servico/SuporteEmpresarialBlocos.tsx` | `5747f1c1` | Modalidades e planos de suporte empresarial existentes desde agosto; este registro não altera preço nem promessa comercial. |
| `src/components/servico/SuporteModalidadesSection.tsx` | `5747f1c1` | Modalidades e planos de suporte empresarial existentes desde agosto; este registro não altera preço nem promessa comercial. |
| `src/data/blogPostsContent.tsx` | `16106c47` | Correções históricas de links internos e orientação técnica segura nos artigos e páginas de sintomas, já versionadas em agosto. |
| `src/lib/bairroDataSchema.ts` | `dcd7a4ff` | Validação tipada dos dados de bairros e renderização segura das dicas locais já versionadas em agosto. |
| `src/lib/bairroLinks.ts` | `20ef2d5d` | Interligação técnica e territorial já versionada em agosto: bairro/cidade para serviços, diagnósticos e localidades existentes. |
| `src/lib/conversacional.ts` | `bfda0104` | Blocos de respostas conversacionais e conteúdo técnico contextual por serviço já versionados em agosto. |
| `src/lib/enrichmentStatus.ts` | `990b743a` | Integração histórica da impressora 3D à ficha, triagem e catálogo; política de enriquecimento continua fail-closed sem prova visual aprovada. Valores existentes não são modificados nesta reconciliação. |
| `src/lib/fichaComercial.ts` | `990b743a` | Integração histórica da impressora 3D à ficha, triagem e catálogo; política de enriquecimento continua fail-closed sem prova visual aprovada. Valores existentes não são modificados nesta reconciliação. |
| `src/lib/funnel/triageConfig.ts` | `18ad18ec` | Integração histórica da impressora 3D à ficha, triagem e catálogo; política de enriquecimento continua fail-closed sem prova visual aprovada. Valores existentes não são modificados nesta reconciliação. |
| `src/lib/funnel/triageMachine.ts` | `18ad18ec` | Integração histórica da impressora 3D à ficha, triagem e catálogo; política de enriquecimento continua fail-closed sem prova visual aprovada. Valores existentes não são modificados nesta reconciliação. |
| `src/lib/mcp/__tests__/mcp-auth-audit.test.ts` | `9aed7d05` | Ferramentas e testes de autenticação/auditoria MCP já versionados em agosto; classificados conservadoramente PUBLIC_CHANGE pelo gate, sem ampliar a exclusão de diretórios. |
| `src/lib/mcp/index.ts` | `6af2b692` | Ferramentas e testes de autenticação/auditoria MCP já versionados em agosto; classificados conservadoramente PUBLIC_CHANGE pelo gate, sem ampliar a exclusão de diretórios. |
| `src/lib/mcp/lib/audit.ts` | `e9f6eccf` | Ferramentas e testes de autenticação/auditoria MCP já versionados em agosto; classificados conservadoramente PUBLIC_CHANGE pelo gate, sem ampliar a exclusão de diretórios. |
| `src/lib/mcp/tools/check-geo-conformance.ts` | `71059145` | Ferramentas e testes de autenticação/auditoria MCP já versionados em agosto; classificados conservadoramente PUBLIC_CHANGE pelo gate, sem ampliar a exclusão de diretórios. |
| `src/lib/mcp/tools/validate-jsonld.ts` | `71059145` | Ferramentas e testes de autenticação/auditoria MCP já versionados em agosto; classificados conservadoramente PUBLIC_CHANGE pelo gate, sem ampliar a exclusão de diretórios. |
| `src/lib/mcp/tools/validate-seo.ts` | `71059145` | Ferramentas e testes de autenticação/auditoria MCP já versionados em agosto; classificados conservadoramente PUBLIC_CHANGE pelo gate, sem ampliar a exclusão de diretórios. |
| `src/lib/politicaComercial.ts` | `5747f1c1` | Modalidades e planos de suporte empresarial existentes desde agosto; este registro não altera preço nem promessa comercial. |
| `src/lib/precosConfig.ts` | `073e6402` | Integração histórica da impressora 3D à ficha, triagem e catálogo; política de enriquecimento continua fail-closed sem prova visual aprovada. Valores existentes não são modificados nesta reconciliação. |
| `src/lib/redirectMatrix.ts` | `d5cd1ff7` | Tratamento histórico de 404 e aliases antigos já versionado em agosto; não altera a matriz ou contratos HTTP nesta revisão. |
| `src/lib/triagePreset.ts` | `990b743a` | Integração histórica da impressora 3D à ficha, triagem e catálogo; política de enriquecimento continua fail-closed sem prova visual aprovada. Valores existentes não são modificados nesta reconciliação. |
| `src/pages/ArrumarPC.tsx` | `990b743a` | Integração histórica da impressora 3D à ficha, triagem e catálogo; política de enriquecimento continua fail-closed sem prova visual aprovada. Valores existentes não são modificados nesta reconciliação. |
| `src/pages/NotFound.tsx` | `d5cd1ff7` | Tratamento histórico de 404 e aliases antigos já versionado em agosto; não altera a matriz ou contratos HTTP nesta revisão. |
| `src/pages/PrecosEPoliticas.tsx` | `5747f1c1` | Modalidades e planos de suporte empresarial existentes desde agosto; este registro não altera preço nem promessa comercial. |
| `src/pages/Servicos.tsx` | `990b743a` | Integração histórica da impressora 3D à ficha, triagem e catálogo; política de enriquecimento continua fail-closed sem prova visual aprovada. Valores existentes não são modificados nesta reconciliação. |
| `src/pages/problemas/DobradicaNotebookQuebrada.tsx` | `16106c47` | Correções históricas de links internos e orientação técnica segura nos artigos e páginas de sintomas, já versionadas em agosto. |
| `src/pages/problemas/HdNaoReconhecido.tsx` | `e536e8d8` | Correções históricas de links internos e orientação técnica segura nos artigos e páginas de sintomas, já versionadas em agosto. |
| `src/pages/problemas/MonitorSemSinal.tsx` | `16106c47` | Correções históricas de links internos e orientação técnica segura nos artigos e páginas de sintomas, já versionadas em agosto. |
| `src/pages/problemas/TelaAzulWindows.tsx` | `16106c47` | Correções históricas de links internos e orientação técnica segura nos artigos e páginas de sintomas, já versionadas em agosto. |
| `src/pages/problemas/TouchpadNaoFunciona.tsx` | `16106c47` | Correções históricas de links internos e orientação técnica segura nos artigos e páginas de sintomas, já versionadas em agosto. |
| `src/pages/problemas/WebcamNaoFunciona.tsx` | `16106c47` | Correções históricas de links internos e orientação técnica segura nos artigos e páginas de sintomas, já versionadas em agosto. |
| `src/pages/servicos/ServicoCore.tsx` | `bfda0104` | Blocos de respostas conversacionais e conteúdo técnico contextual por serviço já versionados em agosto. |
| `src/routes/servicos.conserto-impressora-3d.tsx` | `990b743a` | Integração histórica da impressora 3D à ficha, triagem e catálogo; política de enriquecimento continua fail-closed sem prova visual aprovada. Valores existentes não são modificados nesta reconciliação. |

## Expectativa desatualizada do gate de coortes

O gate ainda esperava 91/28/11 do evento INT-2026-08-25-003 (commit 0519f776). O ledger e o FREEZE_V2 históricos, selados em fe63d291, já incluíam o evento005: /tecnico-informatica-curitiba passou de descoberta indireta para intervenção direta, resultando em 91/29/10. Somente a expectativa e a mensagem do gate foram alinhadas ao selo existente. O total130, a exclusividade, a ausência de duplicatas e a cobertura exata do universo continuam exigidos. Quatro testes de regressão verificam o aceite do selo e o bloqueio das distribuições/URLs inválidas; ledger, coortes e freeze históricos não foram regravados.
