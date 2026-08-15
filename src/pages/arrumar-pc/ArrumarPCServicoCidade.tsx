import { useParams, Navigate } from "@/lib/router-compat";
import { ArrumarPCServicoCidadeTemplate } from "./ArrumarPCServicoCidadeTemplate";
import { cities } from "./cities";
import { servicos } from "./services";

const ArrumarPCServicoCidade = () => {
  const { servico, cidade } = useParams<{ servico: string; cidade: string }>();
  const s = servicos.find((x) => x.slug === servico);
  const c = cities.find((x) => x.slug === cidade);
  if (!s || !c) return <Navigate to="/arrumar-pc" replace />;
  return <ArrumarPCServicoCidadeTemplate servico={s} cidade={c} />;
};

export default ArrumarPCServicoCidade;
