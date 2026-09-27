import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { usePageTitle } from "@/lib/page-title";
import { subUrl } from "@/lib/url";

export function Landing() {
  const { t } = useTranslation();
  usePageTitle();
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full max-w-3xl text-center">
        <div className="mb-10 flex justify-center">
          <img
            src={subUrl("/img/banner.png")}
            alt="Gogs"
            width="500"
            height="189"
            className="mx-auto block h-auto w-full max-w-[450px]"
          />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-(--color-foreground) mb-6">
          A painless self-hosted Git service
        </h1>
        <p className="text-lg sm:text-xl text-(--color-muted-foreground) mb-12 max-w-2xl mx-auto">
          {t("app_desc")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/user/sign-in"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-(--color-primary) px-8 py-3.5 text-base font-semibold text-(--color-primary-foreground) hover:bg-(--color-primary)/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring) transition-all shadow-md hover:shadow-lg"
          >
            {t("sign_in")}
          </Link>
          <Link
            to="/user/sign-up"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-(--color-secondary) px-8 py-3.5 text-base font-semibold text-(--color-secondary-foreground) hover:bg-(--color-secondary)/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring) transition-all"
          >
            {t("register")}
          </Link>
        </div>
        <div className="mt-12 flex justify-center gap-8 text-sm text-(--color-muted-foreground) font-medium">
          <Link to="/explore/repos" className="hover:text-(--color-primary) transition-colors">
            {t("explore")}
          </Link>
          <a href="https://gogs.io" target="_blank" rel="noopener noreferrer" className="hover:text-(--color-primary) transition-colors">
            {t("help")}
          </a>
        </div>
      </div>
    </main>
  );
}
