import { createFileRoute } from "@tanstack/react-router";
import FormatacaoAraucaria from "@/pages/servico-bairro/FormatacaoAraucaria";

export const Route = createFileRoute("/servicos/formatacao-computador/araucaria")({
  component: FormatacaoAraucaria,
});
