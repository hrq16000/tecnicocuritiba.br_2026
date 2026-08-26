# Draft — SSD não reconhecido

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 5
PRIMARY_INTENT: DIAGNOSTICAR_PROBLEMA
USER_DECISION: PRESERVAR_DADOS_OU_AVALIAR
EXISTING_INFORMATION: Conteúdo de armazenamento e recuperação distribuído no acervo.
NEW_INFORMATION: Separa reconhecimento no sistema, gerenciamento de disco e BIOS/UEFI.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção

Explicar o que “não reconhecido” pode significar sem concluir que o SSD falhou definitivamente.

# Lacuna atual

Falta uma orientação que diferencie ausência no Windows, no gerenciamento de disco e na BIOS/UEFI, com preservação antes de inicializar ou formatar.

# Proposta editorial

## Onde o SSD deixa de aparecer muda a próxima verificação

Um SSD pode não aparecer no Explorador de Arquivos, mas ainda estar visível no gerenciamento de disco. Pode também não aparecer no sistema de firmware do computador. São situações diferentes: configuração, partição, conexão, compatibilidade ou falha do dispositivo podem entrar na avaliação, sem que uma hipótese confirme a outra.

## O que verificar sem alterar dados

Anote a mensagem apresentada, o momento em que o problema começou e onde o SSD ainda é reconhecido. Se os dados forem importantes, evite inicializar, criar volume, formatar ou instalar o sistema na unidade antes de entender o cenário.

## Quando parar

Desconexões repetidas, erros de leitura, travamentos durante o acesso ou dados que se tornaram inacessíveis pedem redução de uso. Em SSD, não há ruído mecânico como em HDD; ausência de ruído não elimina risco de falha.

# Segurança e limites

Não orientar atualização de firmware, alteração de BIOS/UEFI ou abertura de equipamento sem avaliação de modelo, interface e dados. TRIM e características de memória flash podem limitar tentativas posteriores; não há promessa de recuperação.

# Relações futuras

- “Dados importantes” → /servicos/recuperacao-de-dados → preservação antes de corrigir.
- “Lentidão” → /problemas/computador-lento → hipótese de armazenamento sem certeza.
- “Compatibilidade” → /servicos/upgrade-ssd-ram → decisão de upgrade.
