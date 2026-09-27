import { Link, useLocation } from "@tanstack/react-router";
import { CheckCircle, CircleDot, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { subUrl } from "@/lib/url";

interface DashboardIssue {
  id: number;
  index: number;
  poster: string;
  posterAvatar: string;
  title: string;
  repoId: number;
  repoName: string;
  repoFullName: string;
  isClosed: boolean;
  createdUnix: number;
  updatedUnix: number;
  numComments: number;
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

interface IssueStats {
  openCount: number;
  closedCount: number;
}

interface IssuesData {
  issues: DashboardIssue[];
  repos: DashboardRepo[];
  issueStats: IssueStats;
  total: number;
  page: number;
}

export default function Issues() {
  const { t } = useTranslation();
  const location = useLocation();
  const isPulls = location.pathname.includes("/pulls");

  // We'll parse from window.location.search for simplicity in this generic component.
  const searchParams = new URLSearchParams(window.location.search);
  const type = searchParams.get("type") || "your_repositories";
  const state = searchParams.get("state") || "open";
  const repo = searchParams.get("repo") || "0";
  const page = searchParams.get("page") || "1";

  const [data, setData] = useState<IssuesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(
      subUrl(`/${isPulls ? "api/web/pulls" : "api/web/issues"}?type=${type}&state=${state}&repo=${repo}&page=${page}`),
    )
      .then((r) => r.json())
      .then((d) => {
        if (active) {
          setData(d as IssuesData);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (active) {
          console.error(e);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [isPulls, type, state, repo, page]);

  const baseHref = isPulls ? "/pulls" : "/issues";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-(--color-primary) mb-2">{isPulls ? t("pull_requests") : t("issues")}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <div className="w-full md:w-64 space-y-6">
          <Card>
            <div className="flex flex-col p-2 gap-1">
              <Link
                to={baseHref}
                search={{ type: "your_repositories", state, repo, page: 1 }}
                className={`px-4 py-3 rounded-xl transition-colors font-medium ${type === "your_repositories" ? "bg-(--color-secondary) text-(--color-secondary-foreground)" : "text-(--color-muted-foreground) hover:bg-(--color-secondary)/50 hover:text-(--color-foreground)"}`}
              >
                {t("home.issues.in_your_repos")}
              </Link>
              <Link
                to={baseHref}
                search={{ type: "assign", state, repo, page: 1 }}
                className={`px-4 py-3 rounded-xl transition-colors font-medium ${type === "assign" ? "bg-(--color-secondary) text-(--color-secondary-foreground)" : "text-(--color-muted-foreground) hover:bg-(--color-secondary)/50 hover:text-(--color-foreground)"}`}
              >
                {t("home.issues.filter_assignees")}
              </Link>
              <Link
                to={baseHref}
                search={{ type: "create", state, repo, page: 1 }}
                className={`px-4 py-3 rounded-xl transition-colors font-medium ${type === "create" ? "bg-(--color-secondary) text-(--color-secondary-foreground)" : "text-(--color-muted-foreground) hover:bg-(--color-secondary)/50 hover:text-(--color-foreground)"}`}
              >
                {t("home.issues.filter_type")}
              </Link>
            </div>
          </Card>

          <Card>
            <div className="px-6 py-4 border-b border-(--color-border) font-bold text-lg bg-(--color-surface) rounded-t-[inherit]">
              Repositories
            </div>
            <div className="flex flex-col p-2 gap-1 max-h-96 overflow-y-auto">
              <Link
                to={baseHref}
                search={{ type, state, repo: 0, page: 1 }}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${repo === "0" ? "bg-(--color-secondary) text-(--color-secondary-foreground)" : "text-(--color-muted-foreground) hover:bg-(--color-secondary)/50 hover:text-(--color-foreground)"}`}
              >
                All Repositories
              </Link>
              {data?.repos?.map((r) => (
                <Link
                  key={r.id}
                  to={baseHref}
                  search={{ type, state, repo: r.id, page: 1 }}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${repo === r.id.toString() ? "bg-(--color-secondary) text-(--color-secondary-foreground)" : "text-(--color-muted-foreground) hover:bg-(--color-secondary)/50 hover:text-(--color-foreground)"}`}
                >
                  {r.fullName}
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-4">
          <div className="flex gap-4 mb-4">
            <Link
              to={baseHref}
              search={{ type, state: "open", repo, page: 1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${state === "open" ? "bg-(--color-primary) text-(--color-primary-foreground) shadow-sm" : "bg-(--color-secondary)/50 text-(--color-secondary-foreground) hover:bg-(--color-secondary)"}`}
            >
              <CircleDot className="w-4 h-4" />
              {data?.issueStats?.openCount || 0} Open
            </Link>
            <Link
              to={baseHref}
              search={{ type, state: "closed", repo, page: 1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${state === "closed" ? "bg-(--color-primary) text-(--color-primary-foreground) shadow-sm" : "bg-(--color-secondary)/50 text-(--color-secondary-foreground) hover:bg-(--color-secondary)"}`}
            >
              <CheckCircle className="w-4 h-4" />
              {data?.issueStats?.closedCount || 0} Closed
            </Link>
          </div>

          <Card>
            <div className="flex flex-col">
              {loading ? (
                <div className="p-4 text-(--color-muted-foreground)">Loading...</div>
              ) : data?.issues?.length === 0 ? (
                <div className="p-4 text-(--color-muted-foreground)">
                  No {isPulls ? "pull requests" : "issues"} found.
                </div>
              ) : (
                data?.issues?.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-5 border-b border-(--color-border) hover:bg-(--color-secondary)/20 transition-colors flex gap-4 last:border-b-0"
                  >
                    <div className="pt-1">
                      {issue.isClosed ? (
                        <CheckCircle className="w-5 h-5 text-(--color-destructive)" />
                      ) : (
                        <CircleDot className="w-5 h-5 text-(--color-success)" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/${issue.repoFullName}/issues/${issue.index}`}
                          className="font-bold text-lg hover:underline text-(--color-foreground)"
                        >
                          {issue.title}
                        </Link>
                      </div>
                      <div className="text-sm text-(--color-muted-foreground) mt-2">
                        <Link to={`/${issue.repoFullName}`} className="hover:underline text-(--color-primary) font-medium">
                          {issue.repoFullName}
                        </Link>{" "}
                        #{issue.index} opened by{" "}
                        <Link to={`/${issue.poster}`} className="hover:underline font-medium text-(--color-foreground)">
                          {issue.poster}
                        </Link>{" "}
                        {new Date(issue.createdUnix * 1000).toLocaleDateString()}
                      </div>
                    </div>
                    {issue.numComments > 0 && (
                      <div className="flex items-center gap-1 text-(--color-muted-foreground) text-sm">
                        <MessageSquare className="w-4 h-4" />
                        {issue.numComments}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
