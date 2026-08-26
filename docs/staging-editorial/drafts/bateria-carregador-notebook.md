# Draft — Bateria, carregador e energia do notebook

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 4
PRIMARY_INTENT: DIFERENCIAR_FALHA_DE_ALIMENTACAO
USER_DECISION: TESTAR_EXTERNAMENTE_OU_PARAR
EXISTING_INFORMATION: Termos aparecem dispersos em artigos auxiliares.
NEW_INFORMATION: Matriz separa bateria, carregador, conector, circuito e configuração.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção
Orientar a primeira triagem de não carrega, autonomia baixa, mau contato e desligamento ao retirar a tomada.

# Lacuna atual
Autonomia reduzida é tratada como defeito certo, sem diferenciar fonte, conector, circuito e sistema.

# Proposta editorial
“Só funciona na tomada” pode envolver bateria, circuito ou leitura do sistema; “não carrega” também pode envolver carregador e conector. Carga lenta pode refletir potência, temperatura ou uso intenso. Compare indicadores em repouso, confira apenas o encaixe externo e não mova o plugue para testar. Autonomia baixa não confirma bateria defeituosa: brilho, processos e perfil de energia também influenciam.

# Segurança e limites
Não abra bateria, fonte ou equipamento energizado. Bateria estufada, aquecimento anormal ou cheiro indicam parar de usar.

# Relações futuras
- Desligamento → /problemas/notebook-desligando-sozinho
- Manutenção → /servicos/manutencao-de-notebook
