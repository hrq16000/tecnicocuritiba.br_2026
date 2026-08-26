# Draft — Wi-Fi caindo toda hora

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 5
PRIMARY_INTENT: DIAGNOSTICAR_PROBLEMA
USER_DECISION: OBSERVAR_TESTAR_COM_SEGURANCA_OU_AVALIAR
EXISTING_INFORMATION: Sintoma de instabilidade e orientação inicial.
NEW_INFORMATION: Diferencia provedor, cobertura, roteador e dispositivo.
SAFETY_VALUE: Média
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção

DIAGNOSTICAR_PROBLEMA. Ajudar a localizar se a falha está no provedor, na rede local, no alcance ou em um dispositivo.

# Lacuna atual

Falta um critério simples para não confundir velocidade contratada com cobertura e para não recomendar repetidor ou mesh antes de observar o padrão da falha.

# Proposta editorial

## Onde está o gargalo?

Se todos os dispositivos caem ao mesmo tempo, a investigação começa por modem/ONT, roteador e provedor. Se apenas um cômodo ou aparelho falha, alcance, obstáculos, interferência e o dispositivo cliente ganham relevância. Wi-Fi é o meio local sem fio; internet é a conectividade externa. Um aparelho pode permanecer conectado ao Wi-Fi e estar sem internet.

## Verificações seguras

Compare dois dispositivos no mesmo local e, quando possível, um teste por Ethernet. Observe se a rede desaparece, se permanece conectada sem acesso ou se fica apenas lenta. Reiniciar uma vez pode recuperar estado temporário, mas não identifica a causa; reset de fábrica pode apagar credenciais e configurações.

## Como a avaliação diferencia causas

A análise compara sinal, comportamento de mais de um dispositivo, posição do roteador e estabilidade do link. A escolha entre ajuste, reposicionamento, equipamento adicional ou contato com o provedor depende desse conjunto de evidências.

# Segurança e limites

Não compartilhar senha de Wi-Fi em conteúdo público. Não alterar configurações avançadas, firmware ou credenciais do provedor sem saber como restaurar o acesso.

# Relações futuras

- “Cobertura” → /servicos/redes-e-wifi → avaliação de rede local.
- “Dispositivo” → /problemas/notebook-nao-conecta-no-wifi → diagnóstico específico.
- “Configuração” → /atendimento-remoto → verificar se o caso é compatível com suporte remoto.
