import { createFileRoute } from "@tanstack/react-router";
import AguaVerdeBairro from "@/pages/bairros/AguaVerdeBairro";

export const Route = createFileRoute("/bairros/jardim-botanico")({
  component: AguaVerdeBairro,
});
