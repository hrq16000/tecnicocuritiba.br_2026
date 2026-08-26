# Draft — Internet lenta: provedor, Wi-Fi ou dispositivo?

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 5
PRIMARY_INTENT: ISOLAR_GARGALO_DE_CONECTIVIDADE
USER_DECISION: TESTAR_CAMADAS_SEM_COMPRAR_EQUIPAMENTO
EXISTING_INFORMATION: Há páginas de Wi-Fi, mas não uma árvore provedor × rede local × dispositivo.
NEW_INFORMATION: Usa escopo, cabo, horário e destino como evidências.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção
Descobrir se a lentidão está na conexão externa, no Wi-Fi, na rede local, no dispositivo ou em um único serviço.

# Lacuna atual
Speed test isolado e recomendações de roteador não localizam a camada do problema.

# Proposta editorial
Pergunte: ocorre em um ou vários dispositivos? Acontece por cabo? Perto do roteador? Em horários específicos? Em todos os serviços ou apenas um? Cabo e Wi-Fi ruins em vários dispositivos podem apontar para upstream, modem/ONT, roteador ou provedor; cabo normal e Wi-Fi ruim favorecem investigação sem fio; um único notebook aponta para dispositivo/configuração. Isso é evidência inicial, não diagnóstico definitivo.

Velocidade, latência, estabilidade, perda de pacotes e cobertura são dimensões diferentes. Um teste por cabo ajuda a isolar Wi-Fi, mas não “resolve a internet”.

# Segurança e limites
Não culpar o provedor sem comparação e não comprar roteador, mesh ou repetidor antes de localizar o gargalo.

# Relações futuras
- Wi-Fi caindo → /problemas/wifi-caindo-toda-hora
- Redes e Wi-Fi → /servicos/redes-e-wifi
