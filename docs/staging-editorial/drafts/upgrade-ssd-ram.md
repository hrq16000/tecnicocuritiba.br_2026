# Draft — Upgrade de SSD e RAM

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 3
INFORMATION_GAIN_AFTER: 4
PRIMARY_INTENT: DECIDIR_REPARO
USER_DECISION: AVALIAR_COMPATIBILIDADE_E_PRIORIZAR_DADOS
EXISTING_INFORMATION: Serviço descreve upgrade e migração.
NEW_INFORMATION: Distingue RAM, armazenamento, compatibilidade e cópia independente.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção

DECIDIR_REPARO. Explicar quando SSD ou RAM podem ser adequados, sem prometer desempenho ou compatibilidade antes da avaliação.

# Lacuna atual

O conteúdo precisa distinguir tempo de inicialização, falta de espaço, muitos programas abertos e defeito de hardware. Esses cenários são parecidos para quem usa a máquina, mas não pedem necessariamente a mesma intervenção.

# Proposta editorial

## SSD e RAM tratam gargalos diferentes

SSD pode reduzir espera ligada ao armazenamento em equipamentos compatíveis, especialmente quando um HD mecânico está limitando leituras. RAM ajuda quando o uso exige manter vários programas, abas ou arquivos abertos. Nenhum dos dois corrige sozinho falha de temperatura, sistema corrompido, processador incompatível ou um dispositivo já com defeito.

## O que avaliar antes da escolha

Modelo do equipamento, interfaces disponíveis, capacidade atual, estado do armazenamento, tipo de uso e os dados que precisam migrar são parte da decisão. Se há sinais de falha no disco, preservar os arquivos pode vir antes de clonagem ou instalação de um novo componente.

## Migração não é cópia de segurança

Migrar o sistema para outra unidade pode ser apropriado em alguns casos, mas não substitui uma cópia independente dos arquivos. A estratégia deve prever dados, acessos, programas essenciais e uma forma de confirmar que a nova instalação funciona.

# Segurança e limites

Não orientar abertura, troca de componentes ou alteração de firmware sem avaliar modelo, compatibilidade e risco de dados. Não anunciar ganho de velocidade fixo.

# Relações futuras

- “Computador lento” → /problemas/computador-lento → confirmar o gargalo antes do upgrade.
- “Dados antes da migração” → /servicos/recuperacao-de-dados → prioridade em caso de falha.
- “Avaliação de serviço” → /servicos/upgrade-ssd-ram → escopo técnico.
