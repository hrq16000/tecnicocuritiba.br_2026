import { createFileRoute } from "@tanstack/react-router";
import FormatacaoCentro from "@/pages/servico-bairro/FormatacaoCentro";

export const Route = createFileRoute("/servicos/formatacao-computador/centro")({
  component: FormatacaoCentro,
});
