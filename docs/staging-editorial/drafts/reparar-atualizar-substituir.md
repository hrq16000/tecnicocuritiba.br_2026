# Draft — Reparar, atualizar ou substituir?

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 5
PRIMARY_INTENT: DECIDIR_PROXIMA_INTERVENCAO
USER_DECISION: ESCOLHER_REPARO_UPGRADE_OU_TROCA
EXISTING_INFORMATION: Critérios aparecem dispersos em manutenção, upgrade e recuperação.
NEW_INFORMATION: Framework separa defeito pontual, limitação, incompatibilidade, recorrência e dados.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção
Organizar a decisão depois de identificar o problema e o gargalo.

# Lacuna atual
“Funciona devagar” e “está falhando” recebem a mesma recomendação.

# Proposta editorial
Reparar tende a fazer sentido diante de defeito pontual e diagnóstico confiável. Atualizar pode ser adequado para limitação de desempenho com compatibilidade e estado geral favoráveis. Substituir pode ser mais racional quando há degradação geral, recorrência, incompatibilidade, peças indisponíveis ou custo desproporcional. Em qualquer cenário, o valor dos dados e o risco de intervenção entram antes da decisão.

# Segurança e limites
Não dar certeza automática nem criar orçamento fictício. Preserve arquivos antes de intervenção potencialmente destrutiva.

# Relações futuras
- Upgrade → /servicos/upgrade-ssd-ram
- Manutenção → /servicos/manutencao-de-computador
- Recuperação → /servicos/recuperacao-de-dados
