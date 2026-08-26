# Draft — Windows não inicia: cenários e próximos passos

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 3
INFORMATION_GAIN_AFTER: 5
PRIMARY_INTENT: DIFERENCIAR_FALHA_DE_INICIALIZACAO
USER_DECISION: PRESERVAR_DADOS_E_ESCOLHER_REPARO
EXISTING_INFORMATION: A página principal cobre o tema, mas introduções genéricas se repetem.
NEW_INFORMATION: Separa energia, imagem, BIOS/UEFI, reparo, loop, tela azul e armazenamento.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção
Identificar em qual etapa a inicialização falha para evitar formatar antes de avaliar dados e armazenamento.

# Lacuna atual
“Não inicia” reúne ausência de energia, imagem e erro do Windows como o mesmo problema.

# Proposta editorial
Sem energia: investigar alimentação externamente. Com energia e sem imagem: separar tela/vídeo de inicialização. BIOS aparece, mas o Windows não: observar mensagem, reparo automático ou loop. Tela azul exige registrar o código. Atualização interrompida, arquivos do sistema e armazenamento são hipóteses distintas. Com dados importantes, priorize cópia ou avaliação antes de reinstalar; formatação pode apagar dados e não corrige falha física.

# Segurança e limites
Não inicializar, particionar ou formatar a unidade sem backup. Não atualizar BIOS como primeira solução genérica.

# Relações futuras
- Página principal → /problemas/windows-nao-inicia
- Recuperação → /servicos/recuperacao-de-dados
