# Draft — Notebook desligando sozinho

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 5
PRIMARY_INTENT: TRIAR_DESLIGAMENTO
USER_DECISION: OBSERVAR_SEM_RISCO_OU_PARAR
EXISTING_INFORMATION: Há conteúdo sobre notebook não ligar e superaquecimento, sem árvore de observação.
NEW_INFORMATION: Separa energia, bateria, carregador, temperatura e sistema por evidência.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção
Diferenciar desligamento completo, reinicialização e perda de imagem antes de qualquer reparo.

# Lacuna atual
As causas aparecem misturadas e não orientam a comparação entre tomada, bateria e carga elevada.

# Proposta editorial
Anote se desliga completamente ou reinicia, se há aviso, e se ocorre em repouso ou durante carga. Compare com carregador conectado e apenas na bateria, sem abrir o aparelho. Desligamento somente sob carga aponta para investigação de temperatura ou alimentação; em repouso amplia a hipótese para bateria, circuito, sistema ou hardware. Funcionar apenas na tomada não prova defeito da bateria. Salve dados estáveis, não force conectores e pare diante de cheiro, líquido ou bateria inchada.

# Segurança e limites
O padrão orienta a triagem, mas não confirma componente defeituoso. Falhas intermitentes podem exigir inspeção técnica.

# Relações futuras
- Bateria → /servicos/manutencao-de-notebook
- Dados → /servicos/recuperacao-de-dados
