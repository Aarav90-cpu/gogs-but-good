import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

import { LoaderResponseError } from "@/lib/loader-error";
import { usePageTitle } from "@/lib/page-title";
import { Card } from "@/components/ui/card";

export function ServerError({ error }: { error: unknown }) {
  const { t } = useTranslation();
  usePageTitle(t("status.internal_server_error"));

  // Prefer the structured `error` field from the webapi JSON response; fall
  // back to the raw body when the upstream returned non-JSON (e.g. a proxy
  // error page); fall back again to the generic message when nothing useful
  // was carried over.
  let detail = t("status.internal_server_error");
  if (error instanceof LoaderResponseError) {
    if (error.errorField) {
      detail = error.errorField;
    } else if (error.body) {
      detail = error.body;
    }
  } else if (error instanceof Error && error.message) {
    detail = error.message;
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full max-w-lg text-center">
        <Card className="p-8 flex flex-col items-center">
          <div className="bg-(--color-destructive)/10 p-5 rounded-full mb-6">
            <AlertTriangle className="w-12 h-12 text-(--color-destructive)" />
          </div>
          <h1 className="text-4xl font-extrabold text-(--color-foreground) tracking-tight mb-3">500</h1>
          <p className="text-lg text-(--color-muted-foreground) mb-6">
            {t("status.internal_server_error")}
          </p>
          <div className="bg-(--color-surface) rounded-xl p-4 w-full mb-8 border border-(--color-border) text-left overflow-auto break-all">
            <code className="text-sm text-(--color-foreground)">{detail}</code>
          </div>
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
