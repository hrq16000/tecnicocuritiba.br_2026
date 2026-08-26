# Draft — Wi-Fi caindo toda hora

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 4
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

## Cobertura, velocidade e queda são problemas diferentes

Se todos os dispositivos caem ao mesmo tempo, a investigação começa pela conexão e pelo roteador. Se apenas um cômodo ou aparelho falha, alcance, obstáculos, interferência e o dispositivo cliente ganham relevância. Uma conexão rápida perto do roteador não prova boa cobertura em toda a residência.

## Verificações seguras

Compare dois dispositivos no mesmo local e um dispositivo perto e longe do roteador. Observe se a rede desaparece, se permanece conectada sem acesso ou se fica apenas lenta. Reiniciar o roteador uma vez pode ser uma verificação; repetir resets de fábrica pode apagar configurações úteis.

## Como a avaliação diferencia causas

A análise compara sinal, comportamento de mais de um dispositivo, posição do roteador e estabilidade do link. A escolha entre ajuste, reposicionamento, equipamento adicional ou contato com o provedor depende desse conjunto de evidências.

# Segurança e limites

Não compartilhar senha de Wi-Fi em conteúdo público. Não alterar configurações avançadas, firmware ou credenciais do provedor sem saber como restaurar o acesso.

# Relações futuras

- “Cobertura” → /servicos/redes-e-wifi → avaliação de rede local.
- “Dispositivo” → /problemas/notebook-nao-conecta-no-wifi → diagnóstico específico.
- “Configuração” → /atendimento-remoto → verificar se o caso é compatível com suporte remoto.
