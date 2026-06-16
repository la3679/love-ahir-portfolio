import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuroraBackground from "@/components/AuroraBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative grid min-h-screen place-items-center px-6">
      <AuroraBackground />
      <div className="text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-aurora-cyan">
          Error 404
        </p>
        <h1 className="mt-4 font-display text-7xl font-bold text-gradient md:text-9xl">
          Lost in space
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The page you're looking for drifted out of orbit. Let's get you back
          to solid ground.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-6 py-3 text-sm font-semibold text-background shadow-glow transition-transform hover:scale-[1.03]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
