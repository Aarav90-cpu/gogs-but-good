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
        <h1 className="text-3xl font-bold text-green-500 mb-2 font-mono">&gt; {t("explore")}</h1>
        <p className="text-zinc-400 font-mono">Discover repositories, users, and organizations</p>
      </div>

      <div className="border-b border-green-500/30 mb-8 border-dashed">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.id}
                to={tab.href}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center font-mono
                  ${
                    isActive
                      ? "border-green-500 text-green-500"
                      : "border-transparent text-zinc-400 hover:text-green-400 hover:border-green-400/50"
                  }
                `}
              >
                <tab.icon
                  className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${isActive ? "text-green-500" : "text-zinc-500"}
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
