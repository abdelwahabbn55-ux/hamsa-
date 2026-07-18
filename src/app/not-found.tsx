import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-rust/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <p className="font-display text-8xl md:text-9xl font-semibold text-espresso/10 select-none">
          404
        </p>
        
        <div className="mt-[-2rem] md:mt-[-3rem] bg-cream/80 backdrop-blur-sm px-6 py-2 rounded-2xl border border-line inline-block mb-6 shadow-sm">
          <span className="text-sm font-medium text-espresso/60 uppercase tracking-widest">
            Page introuvable
          </span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-espresso max-w-2xl leading-tight">
          Cette page a fini comme nos croissants du matin — <br className="hidden md:block" />
          <span className="text-gold">plus rien à se mettre sous la dent.</span>
        </h1>
        
        <p className="mt-6 text-espresso/55 text-base md:text-lg max-w-md">
          La page que vous cherchez n&apos;existe plus, a été déplacée ou l&apos;URL est incorrecte.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button variant="dark" size="lg" className="w-full sm:w-auto shadow-glow">
              Retour à l&apos;accueil
            </Button>
          </Link>
          <Link href="/menu">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voir le menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
