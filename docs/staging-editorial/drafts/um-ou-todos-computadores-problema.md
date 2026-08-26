# Draft — Um computador ou toda a empresa está com problema?
STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 5
PRIMARY_INTENT: DEFINIR_ESCOPO_DO_INCIDENTE
USER_DECISION: ISOLAR_DISPOSITIVO_OU_COMPONENTE_COMPARTILHADO
EXISTING_INFORMATION: Páginas de problemas são majoritariamente individuais.
NEW_INFORMATION: Matriz por quantidade de usuários afetados.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo
# Intenção
Localizar se o incidente é de dispositivo, segmento ou infraestrutura compartilhada.
# Lacuna atual
Cinco computadores lentos ao mesmo tempo recebem a mesma triagem de um computador isolado.
# Proposta editorial
Um usuário afetado favorece investigação do equipamento e configuração. Alguns usuários podem compartilhar rede, software ou segmento. Todos afetados apontam para componentes comuns, como internet, roteador, serviço central ou atualização. É evidência inicial, não diagnóstico definitivo.
# Segurança e limites
Registrar horário, usuários, serviços e mudanças antes de reiniciar ou alterar configurações.
# Relações futuras
- Empresa → /empresas
- Rede → /servicos/redes-e-wifi
