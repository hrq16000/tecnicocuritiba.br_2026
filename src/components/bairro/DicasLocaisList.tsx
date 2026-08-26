import { CheckCircle, MapPin } from "lucide-react";

export function DicasLocaisList({ nome, dicas }: { nome: string; dicas: string[] }) {
  return (
    <div className="bg-card rounded-xl p-6 md:p-8 border border-border">
      <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-accent" />
        Dicas para quem é do {nome}
      </h3>
      <ul className="space-y-2 text-muted-foreground">
        {dicas.map((dica) => (
          <li key={dica} className="flex gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>{dica}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
