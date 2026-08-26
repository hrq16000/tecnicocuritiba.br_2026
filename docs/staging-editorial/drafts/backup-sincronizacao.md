# Draft — Backup, sincronização e preservação de dados

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 5
PRIMARY_INTENT: PROTEGER_DADOS_ANTES_DE_INTERVENCAO
USER_DECISION: CONFIRMAR_COPIA_E_RISCO
EXISTING_INFORMATION: Backup aparece como pré-condição em recuperação e formatação, sem explicação canônica.
NEW_INFORMATION: Distingue cópia local, externa, nuvem, sincronização, histórico e recuperação.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Média
DUPLICATION_RISK: Baixo

# Intenção
Explicar o que realmente protege arquivos antes de manutenção, upgrade, malware ou reinstalação.

# Lacuna atual
Sincronização é confundida com backup completo e cópia não é verificada.

# Proposta editorial
Backup é uma cópia recuperável; sincronização replica alterações e pode propagar exclusões ou corrupção. Combine, conforme o caso, cópia local, mídia externa, nuvem e histórico/versionamento. O princípio 3-2-1 (três cópias, dois tipos de mídia e uma separada) é uma referência útil, não uma única estratégia obrigatória. Teste a restauração: arquivo copiado não é automaticamente arquivo recuperável. Antes de formatar, trocar armazenamento ou investigar malware, preserve dados importantes e evite sobrescrever a origem.

# Segurança e limites
Não prometer recuperação nem tratar um serviço de nuvem específico como proteção universal.

# Relações futuras
- Recuperação → /servicos/recuperacao-de-dados
- Formatação → /servicos/formatacao-de-computador
