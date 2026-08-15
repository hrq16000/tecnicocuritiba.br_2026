import { createFileRoute } from "@tanstack/react-router";
import FormatacaoSaoJosePinhais from "@/pages/servico-bairro/FormatacaoSaoJosePinhais";

export const Route = createFileRoute("/servicos/formatacao-computador/sao-jose-dos-pinhais")({
  component: FormatacaoSaoJosePinhais,
});
