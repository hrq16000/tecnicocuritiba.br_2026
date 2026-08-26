# Draft — Notebook superaquecendo

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 5
PRIMARY_INTENT: DIFERENCIAR_TEMPERATURA_E_DESEMPENHO
USER_DECISION: OBSERVAR_OU_AGENDAR_AVALIACAO
EXISTING_INFORMATION: O acervo cita limpeza e pasta térmica, mas não separa hipóteses.
NEW_INFORMATION: Distingue aquecimento normal, redução de desempenho e desligamento de proteção.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção
Explicar o que observar quando o notebook aquece, sem concluir que a causa é pasta térmica ou cooler.

# Lacuna atual
Falta relacionar temperatura, carga, ventilação, ruído, desempenho e desligamento em uma sequência observável.

# Proposta editorial
Aquecimento e ventoinha audível durante jogos, renderização ou atualizações podem ser compatíveis com carga elevada. A hipótese muda quando o equipamento reduz muito o desempenho, desliga para se proteger, aquece em repouso ou mantém ruído intenso com pouca atividade. Poeira, obstrução, contato do dissipador, pasta envelhecida, ambiente quente, cooler desgastado e sensor são hipóteses distintas. Registre quando ocorre e qual tarefa estava aberta. Use superfície rígida e ventilada; não abra o equipamento nem aplique pasta sem desmontagem correta.

# Segurança e limites
Temperatura percebida na carcaça não confirma temperatura interna. A troca de pasta não é solução universal. Pare diante de cheiro de queimado, líquido ou bateria estufada.

# Relações futuras
- Desligamento sob carga → /problemas/notebook-desligando-sozinho
- Lentidão com aquecimento → /problemas/notebook-lento
- Manutenção → /servicos/manutencao-de-notebook
