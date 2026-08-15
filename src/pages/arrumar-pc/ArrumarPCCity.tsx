import { useParams, Navigate } from "@/lib/router-compat";
import { ArrumarPCCityTemplate } from "./ArrumarPCCityTemplate";
import { cities } from "./cities";

const ArrumarPCCity = () => {
  const { cidade } = useParams<{ cidade: string }>();
  const data = cities.find((c) => c.slug === cidade);
  if (!data) return <Navigate to="/arrumar-pc" replace />;
  return <ArrumarPCCityTemplate data={data} />;
};

export default ArrumarPCCity;
