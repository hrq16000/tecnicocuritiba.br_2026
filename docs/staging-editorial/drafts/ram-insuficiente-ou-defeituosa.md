# Draft — RAM insuficiente ou RAM defeituosa

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 4
PRIMARY_INTENT: ENTENDER_CAUSA
USER_DECISION: OBSERVAR_E_AVALIAR_COMPATIBILIDADE
EXISTING_INFORMATION: Upgrade de memória é citado nas páginas de serviço.
NEW_INFORMATION: Separa uso alto de RAM, paginação, incompatibilidade e possível defeito.
SAFETY_VALUE: Média
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção

Diferenciar memória RAM de armazenamento e evitar que lentidão seja tratada como defeito confirmado de RAM.

# Lacuna atual

Falta uma explicação simples de que RAM é temporária, enquanto SSD/HDD guarda dados, e de que pouca capacidade não é o mesmo que módulo defeituoso.

# Proposta editorial

## RAM e armazenamento fazem trabalhos diferentes

RAM sustenta os programas e arquivos em uso naquele momento; SSD ou HDD conserva dados quando o computador está desligado. Ao faltar RAM para a carga de trabalho, o sistema pode recorrer ao armazenamento e ficar menos responsivo. Espaço cheio no SSD/HDD é outro problema e pede outra investigação.

## Capacidade insuficiente não prova defeito

Lentidão com muitas abas e programas pode indicar uso alto de memória, mas também pode envolver CPU, armazenamento, temperatura ou software. Tela azul, reinicializações e travamentos exigem avaliação mais cuidadosa porque compatibilidade, drivers e falhas de hardware também são hipóteses.

## Próximo passo

Observe quando o sintoma aparece e quais programas estavam abertos. A troca de RAM depende de modelo, tipo, capacidade suportada e configuração; não é recomendação universal.

# Segurança e limites

Não orientar desmontagem ou encaixe de módulos sem confirmar o modelo. Alterar peças sem compatibilidade pode impedir a inicialização e não deve ser usado como teste de tentativa e erro.

# Relações futuras

- “Computador lento” → /problemas/computador-lento → separar gargalos.
- “Travamentos” → /problemas/computador-travando → ampliar hipóteses.
- “Upgrade” → /servicos/upgrade-ssd-ram → compatibilidade e escopo.
