# Draft — Conectado ao Wi-Fi, mas sem internet

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 4
PRIMARY_INTENT: DIFERENCIAR_REDE_LOCAL_E_INTERNET
USER_DECISION: ISOLAR_DISPOSITIVO_OU_UPSTREAM
EXISTING_INFORMATION: O sintoma aparece em artigos de rede sem fluxo dedicado.
NEW_INFORMATION: Separa associação ao roteador, DNS, autenticação, provedor e dispositivo.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção
Explicar por que estar conectado ao Wi-Fi não garante acesso à internet.

# Lacuna atual
“Sem internet” é tratado como sinal fraco ou falha do provedor sem verificar escopo.

# Proposta editorial
Se apenas um dispositivo mostra “sem internet”, investigue configuração, autenticação e DNS nesse dispositivo. Se vários permanecem conectados ao roteador e perdem acesso externo, modem/ONT, provedor ou autenticação ganham relevância. Se somente um site falha, o destino pode estar indisponível. DNS afeta resolução de nomes; trocar DNS não corrige cobertura, interferência ou baixa velocidade física.

Observe outros dispositivos e, quando aplicável, compare por cabo. Reiniciar o roteador uma vez pode recuperar estado temporário; reset de fábrica é cautela e pode apagar parâmetros do provedor.

# Segurança e limites
Não alterar credenciais, firmware ou configuração avançada sem saber restaurar o acesso.

# Relações futuras
- Internet lenta → /problemas/internet-lenta
- Wi-Fi → /servicos/redes-e-wifi
