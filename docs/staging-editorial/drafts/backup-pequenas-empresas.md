# Draft — Backup para pequenas empresas
STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 3
INFORMATION_GAIN_AFTER: 5
PRIMARY_INTENT: PROTEGER_DADOS_EMPRESARIAIS
USER_DECISION: IDENTIFICAR_COPIA_INDEPENDENTE
EXISTING_INFORMATION: Backup e sincronização foram diferenciados na P0.4.
NEW_INFORMATION: Aplica a arquivos compartilhados, falha de computador e ransomware.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Média
DUPLICATION_RISK: Baixo
# Intenção
Definir o que precisa ser protegido e testado em uma empresa pequena.
# Lacuna atual
Compartilhamento e nuvem são confundidos com cópia recuperável.
# Proposta editorial
Liste arquivos críticos, responsáveis, permissões e cópias independentes. Sincronização pode replicar exclusões ou corrupção; histórico e restauração devem ser testados. Considere cópia local, externa e nuvem conforme o risco. Antes de manutenção, migração ou malware, preserve a origem e evite sobrescrever dados.
# Segurança e limites
Não prometer recuperação, compliance ou proteção universal de fornecedor.
# Relações futuras
- Backup → /servicos/backup-para-empresas
- Recuperação → /servicos/recuperacao-de-dados
