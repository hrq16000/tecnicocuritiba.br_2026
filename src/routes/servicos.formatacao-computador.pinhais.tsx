import { createFileRoute } from "@tanstack/react-router";
import FormatacaoPinhais from "@/pages/servico-bairro/FormatacaoPinhais";

export const Route = createFileRoute("/servicos/formatacao-computador/pinhais")({
  component: FormatacaoPinhais,
});
