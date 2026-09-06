import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/lib/page-title";

interface FeedAction {
  id: number;
  opType: number;
  actUserId: number;
  actUserName: string;
  actAvatar: string;
  repoId: number;
  repoUserName: string;
  repoName: string;
  refName: string;
  isPrivate: boolean;
  content: string;
  createdUnix: number;
}

interface DashboardRepo {
  id: number;
  ownerName: string;
  name: string;
  fullName: string;
  numStars: number;
  isFork: boolean;
  isPrivate: boolean;
  isMirror: boolean;
}

interface DashboardOrg {
  id: number;
  name: string;
  numRepos: number;
}

interface DashboardData {
  feeds: FeedAction[];
  repos: DashboardRepo[];
  collaborativeRepos: DashboardRepo[];
  mirrors: DashboardRepo[];
  orgs: DashboardOrg[];
}

export function Dashboard({ data }: { data: DashboardData }) {
  const { t } = useTranslation();
  usePageTitle(t("dashboard"));

  const [activeTab, setActiveTab] = useState<"repos" | "orgs" | "mirrors">("repos");

  return (
    <main className="flex flex-1 justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-6xl flex gap-6 flex-col md:flex-row">
        {/* Left Column: Feeds */}
        <div className="flex-1 space-y-4">
          <Card>
            <div className="px-4 py-3 border-b border-dashed border-(--color-muted-foreground)/50">
              <span className="text-(--color-muted-foreground)">$ </span>
              <span>tail -f /var/log/activity.log</span>
            </div>
            <div className="p-4 space-y-4">
              {data.feeds.length === 0 ? (
                <div className="text-(--color-muted-foreground)">No recent activity found.</div>
              ) : (
                data.feeds.map((feed) => (
                  <div key={feed.id} className="flex gap-3 text-sm">
                    <img
                      src={feed.actAvatar}
                      alt=""
                      className="w-8 h-8 rounded-none border border-(--color-muted-foreground)/30"
                    />
                    <div>
                      <div>
                        <Link to={`/${feed.actUserName}`} className="font-bold hover:underline">
                          {feed.actUserName}
                        </Link>{" "}
                        <span className="text-(--color-muted-foreground)">performed action</span>{" "}
                        <Link to={`/${feed.repoUserName}/${feed.repoName}`} className="font-bold hover:underline">
                          {feed.repoUserName}/{feed.repoName}
                        </Link>
                      </div>
                      {feed.content && <div className="mt-1 opacity-80">{feed.content}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Repos & Orgs */}
        <div className="w-full md:w-80 space-y-4">
          <Card>
            <div className="flex border-b border-dashed border-(--color-muted-foreground)/50">
              <button
                className={`flex-1 py-2 text-center text-sm ${activeTab === "repos" ? "bg-(--color-foreground) text-(--color-background)" : "hover:bg-(--color-muted-foreground)/10"}`}
                onClick={() => setActiveTab("repos")}
              >
                {t("repository")}
              </button>
              <button
                className={`flex-1 py-2 text-center text-sm border-l border-dashed border-(--color-muted-foreground)/50 ${activeTab === "orgs" ? "bg-(--color-foreground) text-(--color-background)" : "hover:bg-(--color-muted-foreground)/10"}`}
                onClick={() => setActiveTab("orgs")}
              >
                {t("organization")}
              </button>
              <button
                className={`flex-1 py-2 text-center text-sm border-l border-dashed border-(--color-muted-foreground)/50 ${activeTab === "mirrors" ? "bg-(--color-foreground) text-(--color-background)" : "hover:bg-(--color-muted-foreground)/10"}`}
                onClick={() => setActiveTab("mirrors")}
              >
                {t("mirror")}
              </button>
            </div>

            <div className="p-4">
              {activeTab === "repos" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-dashed border-(--color-muted-foreground)/30 pb-2">
                    <span className="font-bold">
                      {t("home.my_repos")} ({data.repos.length})
                    </span>
                    <Button variant="outline" size="sm" asChild className="h-6 px-2 text-xs">
                      <Link to="/repo/create">+</Link>
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {data.repos.map((repo) => (
                      <li key={repo.id} className="flex justify-between text-sm">
                        <Link
                          to={`/${repo.ownerName}/${repo.name}`}
                          className="hover:underline flex items-center gap-2"
                        >
                          <span className="text-(--color-muted-foreground)">{repo.isPrivate ? "[P]" : "[ ]"}</span>
                          {repo.name}
                        </Link>
                        <span className="text-(--color-muted-foreground)">{repo.numStars} ★</span>
                      </li>
                    ))}
                  </ul>

                  {data.collaborativeRepos.length > 0 && (
                    <>
                      <div className="font-bold border-b border-dashed border-(--color-muted-foreground)/30 pb-2 pt-4">
                        {t("home.collaborative_repos")}
                      </div>
                      <ul className="space-y-2">
                        {data.collaborativeRepos.map((repo) => (
                          <li key={repo.id} className="flex justify-between text-sm">
                            <Link
                              to={`/${repo.ownerName}/${repo.name}`}
                              className="hover:underline flex items-center gap-2"
                            >
                              <span className="text-(--color-muted-foreground)">{repo.isPrivate ? "[P]" : "[ ]"}</span>
                              {repo.ownerName}/{repo.name}
                            </Link>
                            <span className="text-(--color-muted-foreground)">{repo.numStars} ★</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {activeTab === "orgs" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-dashed border-(--color-muted-foreground)/30 pb-2">
                    <span className="font-bold">
                      {t("home.my_orgs")} ({data.orgs.length})
                    </span>
                    <Button variant="outline" size="sm" asChild className="h-6 px-2 text-xs">
                      <Link to="/org/create">+</Link>
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {data.orgs.map((org) => (
                      <li key={org.id} className="flex justify-between text-sm">
                        <Link to={`/${org.name}`} className="hover:underline flex items-center gap-2">
                          <span className="text-(--color-muted-foreground)">[O]</span>
                          {org.name}
                        </Link>
                        <span className="text-(--color-muted-foreground)">{org.numRepos} R</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "mirrors" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-dashed border-(--color-muted-foreground)/30 pb-2">
                    <span className="font-bold">
                      {t("home.my_mirrors")} ({data.mirrors.length})
                    </span>
                    <Button variant="outline" size="sm" asChild className="h-6 px-2 text-xs">
                      <Link to="/repo/migrate?mirror=1">+</Link>
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {data.mirrors.map((repo) => (
                      <li key={repo.id} className="flex justify-between text-sm">
                        <Link
                          to={`/${repo.ownerName}/${repo.name}`}
                          className="hover:underline flex items-center gap-2"
                        >
                          <span className="text-(--color-muted-foreground)">[M]</span>
                          {repo.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
