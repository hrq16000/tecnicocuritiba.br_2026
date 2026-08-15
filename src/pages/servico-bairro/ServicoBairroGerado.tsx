import { lazy, Suspense } from "react";
import { useParams } from "@/lib/router-compat";
import { ServicoBairroTemplate } from "./ServicoBairroTemplate";
import { buildServicoBairroData } from "@/lib/servicoBairroFactory";

const ServicoCidadePage = lazy(() => import("./ServicoCidadePage"));

/**
 * Rota dinâmica /servicos/:servico/:local.
 * Quando o segundo segmento é um bairro de Curitiba com contexto local curado,
 * renderiza a landing dedicada serviço × bairro (conteúdo local + NAP).
 * Caso contrário, mantém o comportamento herdado de serviço × cidade.
 */
const ServicoBairroGerado = () => {
  const { servico = "", cidade = "" } = useParams();
  const data = buildServicoBairroData(servico, cidade);

  if (data) return <ServicoBairroTemplate data={data} />;

  return (
    <Suspense fallback={null}>
      <ServicoCidadePage />
    </Suspense>
  );
};

export default ServicoBairroGerado;
