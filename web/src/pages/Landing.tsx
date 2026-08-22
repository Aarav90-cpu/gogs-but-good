import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/lib/page-title";
import { subUrl } from "@/lib/url";

export function Landing() {
  const { t } = useTranslation();
  usePageTitle();
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full max-w-2xl">
        <Card>
          <div className="px-4 py-4 sm:px-5 sm:py-5 whitespace-pre-wrap">
            <span className="text-(--color-muted-foreground)">$ </span>
            <span>cat /etc/motd</span>
            {"\n"}
            <img
              src={subUrl("/img/banner.png")}
              alt="Gogs"
              width="1000"
              height="378"
              className="mx-auto block h-auto w-full max-w-[450px] [image-rendering:pixelated]"
            />
            <span className="-mt-1 block text-center text-base text-(--color-foreground) sm:text-lg">
              {t("app_desc")}
            </span>
            {"\n"}
            <span className="text-(--color-muted-foreground)">$ </span>
            <span>gogs help</span>
            {"\n"}
            <CmdLink href="/user/sign-in" cmd="sign-in" desc={t("sign_in")} spa />
            {"\n"}
            <CmdLink href="/user/sign-up" cmd="sign-up" desc={t("register")} spa />
            {"\n"}
            <CmdLink href="/explore/repos" cmd="explore" desc={t("explore")} />
            {"\n"}
            <CmdLink href="https://gogs.io" cmd="help" desc={t("help")} external />
            {"\n"}
            {"\n"}
            <span className="text-(--color-muted-foreground)">$ </span>
            <span className="inline-block w-2 animate-pulse bg-(--color-foreground) align-baseline"> </span>
          </div>
        </Card>
      </div>
    </main>
  );
}

function CmdLink({
  href,
  cmd,
  desc,
  external,
  spa,
}: {
  href: string;
  cmd: string;
  desc: string;
  external?: boolean;
  spa?: boolean;
}) {
  const className =
    "group inline-flex items-baseline gap-2 rounded-sm hover:text-(--color-foreground) hover:[animation:flame-flicker_2.4s_ease-in-out_infinite]";
  const inner = (
    <>
      <span className="inline-block w-16 text-(--color-foreground) sm:w-20">{cmd}</span>
      <span className="text-(--color-muted-foreground) group-hover:text-(--color-foreground)/80">— {desc}</span>
      <span className="text-(--color-muted-foreground) group-hover:text-(--color-foreground)">→</span>
    </>
  );
  if (spa) {
    return (
      <Link to={href} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      href={external ? href : subUrl(href)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {inner}
    </a>
  );
}
