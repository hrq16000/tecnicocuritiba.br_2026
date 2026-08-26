# Draft — Recuperação de dados

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 3
INFORMATION_GAIN_AFTER: 5
PRIMARY_INTENT: DECIDIR_REPARO
USER_DECISION: PARAR_DE_USAR_E_PRESERVAR
EXISTING_INFORMATION: Serviço já diferencia recuperação de garantia comercial.
NEW_INFORMATION: Separa perda lógica, falha física e ações que sobrescrevem dados.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção

DECIDIR_REPARO. Explicar a diferença entre backup, arquivos inacessíveis e recuperação, para reduzir ações que podem agravar uma falha.

# Lacuna atual

O serviço já alerta que recuperação não é garantida, mas precisa separar melhor exclusão lógica, dispositivo não reconhecido e sinais físicos, sem usar percentual de êxito.

# Proposta editorial

## Backup não é recuperação

Backup é uma cópia criada antes da perda e testada para restauração. Recuperação é uma tentativa de acessar dados depois que eles foram apagados, ficaram inacessíveis ou a mídia começou a falhar. Uma não substitui a outra, e a existência de backup muda a decisão: a prioridade passa a ser corrigir ou substituir o equipamento sem arriscar a única cópia.

## O que o sintoma ajuda a indicar

Arquivos apagados, partição alterada e sistema de arquivos corrompido são cenários diferentes de um disco que faz ruído, deixa de ser reconhecido ou desconecta durante a leitura. O sintoma não confirma a causa, mas ajuda a decidir se é prudente interromper o uso e avaliar o dispositivo antes de novas tentativas.

## O que evitar

Não instalar programas, copiar arquivos para a mesma mídia, formatar, inicializar o disco nem continuar gravando dados quando há falha suspeita. Essas ações podem sobrescrever informações que ainda seriam avaliadas.

# Segurança e limites

Nenhum conteúdo pode prometer recuperação. O resultado depende do estado físico e lógico da mídia, do que ocorreu depois da perda e da possibilidade de leitura segura.

# Relações futuras

- “Backup verificado” → /seguranca-dos-dados → prevenção antes da falha.
- “Mídia com falha” → /problemas/hd-nao-reconhecido → evidências de diagnóstico.
- “Avaliação” → /servicos/recuperacao-de-dados → serviço e limites.
