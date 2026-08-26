# Draft — Quando aumentar a RAM pode ajudar

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 3
INFORMATION_GAIN_AFTER: 4
PRIMARY_INTENT: AVALIAR_UPGRADE_DE_MEMORIA
USER_DECISION: MEDIR_PRESSAO_E_VERIFICAR_COMPATIBILIDADE
EXISTING_INFORMATION: RAM é citada em upgrade e lentidão, sem separar insuficiência de defeito.
NEW_INFORMATION: Considera paginação, multitarefa, capacidade atual e plataforma.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Médio

# Intenção
Diferenciar RAM insuficiente de RAM defeituosa antes de comprar módulo.

# Lacuna atual
Mais memória é tratada como aumento automático de velocidade.

# Proposta editorial
RAM adicional pode ajudar quando muitas aplicações provocam pressão de memória e paginação, mas depende do uso, capacidade instalada e compatibilidade. Travamentos, erros e reinicializações podem apontar para defeito, não apenas falta de capacidade. Verifique tipo, slots, limites da placa e comportamento observado; não escolha módulo por marca ou quantidade genérica.

# Segurança e limites
Não instalar componente sem confirmar especificações e não tratar RAM como solução para CPU, armazenamento ou temperatura.

# Relações futuras
- Upgrade → /servicos/upgrade-ssd-ram
- Travamentos → /problemas/computador-travando
