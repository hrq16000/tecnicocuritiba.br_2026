import { Link } from "@/lib/router-compat";

/**
 * Link curto de transparência exibido junto aos CTAs principais.
 * Aponta para a página fundida /precos-e-politicas (termos, condições, valores e prazos).
 */
export const TermosCtaLink = ({ className = "" }: { className?: string }) => (
  <p className={`text-xs text-muted-foreground ${className}`}>
    Ao continuar você concorda com os{" "}
    <Link to="/precos-e-politicas#termos" className="underline underline-offset-2 hover:text-foreground">
      termos, valores e prazos de atendimento
    </Link>
    .
  </p>
);

export default TermosCtaLink;
