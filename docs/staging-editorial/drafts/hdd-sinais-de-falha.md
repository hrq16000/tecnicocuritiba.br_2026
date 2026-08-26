# Draft — HD/HDD com sinais de falha

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 4
PRIMARY_INTENT: ENTENDER_CAUSA
USER_DECISION: PARAR_DE_USAR_OU_PRESERVAR
EXISTING_INFORMATION: Serviço de recuperação alerta sobre falhas físicas e lógicas.
NEW_INFORMATION: Relaciona leitura, lentidão, desaparecimento e ruído a decisões seguras.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção

Orientar o usuário diante de HD com comportamento anormal, sem tutorial de abertura ou tentativa física.

# Lacuna atual

Sinais de falha física e problema de sistema podem ser confundidos; é preciso indicar por que insistir no uso pode aumentar o risco aos dados.

# Proposta editorial

## Sinais que justificam cautela

Travamentos ao abrir arquivos, erros de leitura, arquivos corrompidos, desconexões e desaparecimento do HD podem ter causas diferentes. Ruído novo ou repetitivo também é um sinal para interromper tentativas improvisadas. Nenhum desses sinais confirma sozinho o componente exato do defeito.

## Próximo passo seguro

Quando há dados importantes sem cópia, a prioridade é reduzir gravações e registrar o comportamento. Evite formatar, executar correções que escrevem na unidade, abrir o HD, resfriá-lo artificialmente ou aplicar impacto físico.

## Reparo, substituição e dados

A decisão de substituir um HD pode ser independente da decisão sobre os arquivos. Primeiro é preciso avaliar a possibilidade de preservação; depois, a condição do equipamento e a necessidade de novo armazenamento.

# Segurança e limites

Abrir um HDD é TECHNICIAN_ONLY e não deve ser recomendado como teste doméstico. Não prometer que ruído ou lentidão permitem recuperar dados.

# Relações futuras

- “Arquivos inacessíveis” → /servicos/recuperacao-de-dados → limites de avaliação.
- “Computador lento” → /problemas/computador-lento → sintomas semelhantes, causas diferentes.
- “Troca de armazenamento” → /servicos/upgrade-ssd-ram → decisão posterior aos dados.
