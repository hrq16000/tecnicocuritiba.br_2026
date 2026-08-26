# Draft — Formatação de computador

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 3
INFORMATION_GAIN_AFTER: 4
PRIMARY_INTENT: DECIDIR_REPARO
USER_DECISION: FAZER_BACKUP_OU_PARAR_PARA_AVALIAR
EXISTING_INFORMATION: Serviço já menciona backup e reinstalação.
NEW_INFORMATION: Separa formatação, falha física, contas e licenças.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção

DECIDIR_REPARO e TENTAR_SOLUCAO_SEGURA. Deixar claro quando reinstalar o sistema pode ajudar e quando pode aumentar o risco aos dados.

# Lacuna atual

Falta um módulo explícito sobre confirmação de backup, chaves de acesso, licenças e sinais que sugerem falha física em vez de problema de sistema.

# Proposta editorial

## O que a formatação pode resolver

Reinstalar o sistema pode ser indicado para corrupção de arquivos do sistema, conflitos persistentes de programas ou uma instalação que precisa ser reorganizada. Não corrige automaticamente disco com falha, aquecimento, defeito de memória, tela, bateria ou fonte.

## Antes de reinstalar

Identifique arquivos importantes, contas, chaves de recuperação, programas necessários e a condição do armazenamento. Backup precisa ser conferido em outro local antes de apagar partições ou iniciar uma instalação. Se arquivos já estão inacessíveis ou o disco apresenta erro, a decisão deve parar para avaliação de dados.

## Resultado esperado e limites

Depois da reinstalação, o equipamento ainda depende de drivers, compatibilidade, licença válida e condição saudável do hardware. A entrega deve explicar o que foi instalado, o que precisa ser acessado novamente e quais sintomas indicam que o problema não era apenas software.

# Segurança e limites

Não orientar apagamento de partições, alteração de BIOS/UEFI ou uso de ferramentas de ativação. Não assumir que todos os programas ou dados podem ser restaurados.

# Relações futuras

- “Dados antes de reinstalar” → /servicos/recuperacao-de-dados → impedir perda evitável.
- “Falha física” → /servicos/manutencao-de-computador → diagnóstico de hardware.
- “Remoção de infecção” → /servicos/remocao-de-virus → evitar formatação automática.
