import { createFileRoute } from "@tanstack/react-router";
import FormatacaoCampoLargo from "@/pages/servico-bairro/FormatacaoCampoLargo";

export const Route = createFileRoute("/servicos/formatacao-computador/campo-largo")({
  component: FormatacaoCampoLargo,
});
