import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import Seo from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Seo title="404" description={t("notfound.description")} path={location.pathname} />
      <div className="container grid min-h-[70svh] place-items-center pt-24">
        <div className="max-w-md text-center">
          <p className="meta-line uppercase">HTTP 404 · no matching entry</p>
          <h1 className="mt-4 font-display text-display-lg font-bold text-foreground">
            {t("notfound.title")}
          </h1>
          <p className="mt-4 text-muted-foreground">{t("notfound.description")}</p>
          <Link
            to="/"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t("notfound.home")}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
