# Draft — SSD ou RAM: como identificar o gargalo

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 3
INFORMATION_GAIN_AFTER: 5
PRIMARY_INTENT: IDENTIFICAR_GARGALO_ANTES_DO_UPGRADE
USER_DECISION: MEDIR_E_PRIORIZAR_INTERVENCAO
EXISTING_INFORMATION: Upgrade SSD/RAM já explica diferenças básicas.
NEW_INFORMATION: Matriz sintoma → evidência → decisão, sem recomendação automática.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Médio

# Intenção
Responder “meu PC lento precisa de SSD ou RAM?” com critérios de observação.

# Lacuna atual
Usuários associam qualquer lentidão ao componente mais divulgado.

# Proposta editorial
SSD pode ajudar esperas de leitura/escrita e inicialização quando o armazenamento é o gargalo. RAM adicional pode ajudar quando há pressão de memória, paginação e multitarefa, desde que haja compatibilidade. CPU, GPU, temperatura, sistema, malware e defeito também podem limitar. Observe em que tarefa ocorre, uso de recursos e estado do disco antes de comprar.

# Segurança e limites
Não recomendar quantidade universal, não inventar compatibilidade e preservar dados antes de migração.

# Relações futuras
- Upgrade combinado → /servicos/upgrade-ssd-ram
- Computador lento → /problemas/computador-lento
