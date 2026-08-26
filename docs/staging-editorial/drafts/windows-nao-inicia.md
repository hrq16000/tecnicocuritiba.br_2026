# Draft — Windows não inicia

STATUS: STAGING_ONLY
INFORMATION_GAIN_BEFORE: 2
INFORMATION_GAIN_AFTER: 4
PRIMARY_INTENT: DIAGNOSTICAR_PROBLEMA
USER_DECISION: PRESERVAR_OU_AVALIAR_SISTEMA_HARDWARE
EXISTING_INFORMATION: Formatação e manutenção abordam reinstalação e diagnóstico.
NEW_INFORMATION: Separa falha de inicialização, atualização e risco de apagar dados.
SAFETY_VALUE: Alta
DIAGNOSTIC_VALUE: Alta
DUPLICATION_RISK: Baixo

# Intenção

Orientar uma falha de inicialização sem induzir formatação ou alteração de partição antes de considerar os dados.

# Lacuna atual

Falta uma resposta direta para quem vê tela de reparo, ciclo de reinicialização ou mensagem de inicialização e não sabe se o problema é sistema ou armazenamento.

# Proposta editorial

## Não iniciar não significa automaticamente que o Windows precisa ser reinstalado

Uma atualização interrompida, arquivos de sistema corrompidos, falha de armazenamento, memória ou outro componente podem produzir sintomas parecidos. A mensagem e o ponto onde a inicialização para são evidências úteis, mas não confirmam a causa por si só.

## Antes de tentar corrigir

Se há dados importantes sem cópia, evite formatar, apagar partições ou iniciar uma instalação limpa por impulso. Registre a mensagem de erro, confirme se o armazenamento é reconhecido e avalie se há sinais físicos, como travamentos de leitura ou desconexões.

## O que fazer agora

Quando o equipamento volta a iniciar, faça backup dos arquivos críticos antes de mudanças maiores. Se não inicia ou os dados estão inacessíveis, a prioridade pode ser avaliação do armazenamento e preservação, não reinstalação.

# Segurança e limites

Não orientar comandos destrutivos, alteração de firmware ou reparo interno como procedimento de primeira resposta. Não prometer que o reparo do sistema preservará todos os dados.

# Relações futuras

- “Formatação” → /servicos/formatacao → escopo e riscos.
- “Dados inacessíveis” → /servicos/recuperacao-de-dados → preservação antes de alteração.
- “Disco não reconhecido” → /problemas/hd-nao-reconhecido → diagnóstico relacionado.
