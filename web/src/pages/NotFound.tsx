import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

import { usePageTitle } from "@/lib/page-title";
import { Card } from "@/components/ui/card";

export function NotFound() {
  const { t } = useTranslation();
  usePageTitle(t("status.page_not_found"));
  
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full max-w-md text-center">
        <Card className="p-8 flex flex-col items-center">
          <div className="bg-(--color-destructive)/10 p-5 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-(--color-destructive)" />
          </div>
          <h1 className="text-4xl font-extrabold text-(--color-foreground) tracking-tight mb-3">404</h1>
          <p className="text-lg text-(--color-muted-foreground) mb-8">
            {t("status.page_not_found")}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-(--color-primary) px-8 py-3 text-sm font-semibold text-(--color-primary-foreground) hover:bg-(--color-primary)/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring) transition-all shadow-md hover:shadow-lg"
          >
            {t("home")}
          </Link>
        </Card>
      </div>
    </main>
  );
}

