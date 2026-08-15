import { createFileRoute } from "@tanstack/react-router";
import FormatacaoCampoComprido from "@/pages/servico-bairro/FormatacaoCampoComprido";

export const Route = createFileRoute("/servicos/formatacao-computador/campo-comprido")({
  component: FormatacaoCampoComprido,
});
