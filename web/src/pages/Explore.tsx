import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Book, Building2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Explore() {
  const { t } = useTranslation();
  const location = useLocation();

  const tabs = [
    {
      id: "repos",
      name: t("explore.repos"),
      href: "/explore/repos",
      icon: Book,
    },
    {
      id: "users",
      name: t("explore.users"),
      href: "/explore/users",
      icon: Users,
    },
    {
      id: "organizations",
      name: t("explore.organizations"),
      href: "/explore/organizations",
      icon: Building2,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-(--color-primary) mb-2">{t("explore")}</h1>
        <p className="text-(--color-muted-foreground) text-lg">Discover repositories, users, and organizations</p>
      </div>

      <div className="border-b border-(--color-border) mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.id}
                to={tab.href}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
                  ${
                    isActive
                      ? "border-(--color-primary) text-(--color-primary)"
                      : "border-transparent text-(--color-muted-foreground) hover:text-(--color-foreground) hover:border-(--color-border)"
                  }
                `}
              >
                <tab.icon
                  className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${isActive ? "text-(--color-primary)" : "text-(--color-muted-foreground)"}
                  `}
                  aria-hidden="true"
                />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <Outlet />
    </div>
  );
}
