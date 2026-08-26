# Contradições editoriais — staging

## Método

Varredura inicial de claims e de padrões de conteúdo das rotas prioritárias. Os itens abaixo são propostas de revisão; nada foi corrigido em produção nesta rodada.

| Severidade | Área | Achado | Proposta |
| --- | --- | --- | --- |
| COMMERCIAL | Páginas locais legadas | Há textos com prazo fixo, rapidez ou garantia sem fonte operacional associada. | Substituir por agendamento, diagnóstico e aprovação prévia, conforme cada caso. |
| TECHNICAL | Lentidão | Upgrade e formatação aparecem como solução antes da evidência em alguns textos legados. | Explicar armazenamento, memória, sistema e temperatura como hipóteses distintas. |
| TECHNICAL | Wi-Fi | Cobertura e velocidade podem ser tratadas como equivalentes em copy genérica. | Diferenciar provedor, rede local, posição, obstáculos e dispositivo cliente. |
| MINOR | Localidade | Parte do acervo usa contexto de bairro como enfeite editorial. | Restringir contexto a cobertura/logística comprovadas. |
| SAFETY_CRITICAL | Acervo legado | Há trechos com percentuais de recuperação e promessa de ganho fixo sem evidência editorial registrada. | Manter noindex e substituir por condições, riscos e limites verificáveis antes de qualquer promoção. |
| COMMERCIAL | Acervo legado | Há menção a outra marca e a garantia escrita sem suporte no registro atual. | Remover ou consolidar em revisão própria; não promover esse material. |

Safety critical: 1. Technical: 2. Commercial: 2. Minor: 1.

## Triagem automatizada P0.2

O relatório `reports/p0-storage-memory-article-audit.json` marcou 16 artigos como `CONFLITANTE` por conter percentuais, promessas de resultado ou linguagem que precisa de fonte. Esse marcador é bloqueador de promoção; não representa diagnóstico definitivo de cada artigo.
