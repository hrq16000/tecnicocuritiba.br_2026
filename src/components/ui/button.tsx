import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // mobile-first: rótulos longos em PT-BR (ex.: "Solicitar atendimento via
  // WhatsApp") estouravam a viewport de 360px por causa do `whitespace-nowrap`
  // + padding fixo. Agora o texto quebra e o botão nunca ultrapassa o container;
  // a partir de sm: volta a ficar em linha única.
  "inline-flex max-w-full items-center justify-center gap-2 text-balance text-center whitespace-normal sm:whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",

  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-hover cta-shadow-whatsapp font-bold",
        cta: "bg-cta text-white hover:bg-cta-hover cta-shadow font-bold",
        heroWhatsapp: "bg-whatsapp text-white hover:bg-whatsapp-hover border-2 border-white/20 font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-5 cta-shadow-whatsapp",
        heroCta: "bg-cta text-white hover:bg-cta-hover border-2 border-white/20 font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-5 cta-shadow",
      },
      // altura mínima (não fixa) para que rótulos que quebram em duas linhas
      // no mobile não cortem o texto; padding menor no mobile evita estouro.
      size: {
        default: "min-h-10 px-4 py-2",
        sm: "min-h-9 rounded-md px-3 py-1.5",
        lg: "min-h-12 rounded-lg px-4 sm:px-6 py-2.5 text-base",
        xl: "min-h-14 rounded-xl px-5 sm:px-8 py-3 text-lg",
        icon: "h-10 w-10 shrink-0",
      },

    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
