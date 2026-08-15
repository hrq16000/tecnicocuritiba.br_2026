import { createFileRoute } from "@tanstack/react-router";
import RemocaoVirusPinhais from "@/pages/servico-bairro/RemocaoVirusPinhais";

export const Route = createFileRoute("/servicos/remocao-virus/pinhais")({
  component: RemocaoVirusPinhais,
});
