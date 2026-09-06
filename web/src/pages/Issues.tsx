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
    <div className="container mx-auto px-4 py-8 font-mono">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-500 mb-2">&gt; {isPulls ? t("pull_requests") : t("issues")}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <div className="w-full md:w-64 space-y-6">
          <Card>
            <div className="flex flex-col">
              <Link
                to={baseHref}
                search={{ type: "your_repositories", state, repo, page: 1 }}
                className={`px-4 py-3 border-b border-dashed border-(--color-muted-foreground)/30 ${type === "your_repositories" ? "bg-(--color-foreground) text-(--color-background)" : "hover:bg-(--color-muted-foreground)/10"}`}
              >
                {t("home.issues.in_your_repos")}
              </Link>
              <Link
                to={baseHref}
                search={{ type: "assign", state, repo, page: 1 }}
                className={`px-4 py-3 border-b border-dashed border-(--color-muted-foreground)/30 ${type === "assign" ? "bg-(--color-foreground) text-(--color-background)" : "hover:bg-(--color-muted-foreground)/10"}`}
              >
                {t("home.issues.filter_assignees")}
              </Link>
              <Link
                to={baseHref}
                search={{ type: "create", state, repo, page: 1 }}
                className={`px-4 py-3 ${type === "create" ? "bg-(--color-foreground) text-(--color-background)" : "hover:bg-(--color-muted-foreground)/10"}`}
              >
                {t("home.issues.filter_type")}
              </Link>
            </div>
          </Card>

          <Card>
            <div className="px-4 py-2 border-b border-dashed border-(--color-muted-foreground)/30 font-bold bg-(--color-muted-foreground)/5">
              Repositories
            </div>
            <div className="flex flex-col max-h-96 overflow-y-auto">
              <Link
                to={baseHref}
                search={{ type, state, repo: 0, page: 1 }}
                className={`px-4 py-2 text-sm ${repo === "0" ? "text-green-500 font-bold" : "hover:bg-(--color-muted-foreground)/10"}`}
              >
                All Repositories
              </Link>
              {data?.repos?.map((r) => (
                <Link
                  key={r.id}
                  to={baseHref}
                  search={{ type, state, repo: r.id, page: 1 }}
                  className={`px-4 py-2 text-sm ${repo === r.id.toString() ? "text-green-500 font-bold" : "hover:bg-(--color-muted-foreground)/10"}`}
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
              className={`flex items-center gap-2 ${state === "open" ? "text-green-500 font-bold border-b border-green-500" : "text-(--color-muted-foreground) hover:text-(--color-foreground)"}`}
            >
              <CircleDot className="w-4 h-4" />
              {data?.issueStats?.openCount || 0} Open
            </Link>
            <Link
              to={baseHref}
              search={{ type, state: "closed", repo, page: 1 }}
              className={`flex items-center gap-2 ${state === "closed" ? "text-red-500 font-bold border-b border-red-500" : "text-(--color-muted-foreground) hover:text-(--color-foreground)"}`}
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
                    className="p-4 border-b border-dashed border-(--color-muted-foreground)/30 hover:bg-(--color-muted-foreground)/5 flex gap-4 last:border-b-0"
                  >
                    <div className="pt-1">
                      {issue.isClosed ? (
                        <CheckCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CircleDot className="w-5 h-5 text-green-500" />
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
                      <div className="text-sm text-(--color-muted-foreground) mt-1">
                        <Link to={`/${issue.repoFullName}`} className="hover:underline text-green-400">
                          {issue.repoFullName}
                        </Link>{" "}
                        #{issue.index} opened by{" "}
                        <Link to={`/${issue.poster}`} className="hover:underline text-green-400">
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
