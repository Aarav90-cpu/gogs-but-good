import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { subUrl } from "@/lib/url";

interface ExploreRepo {
  id: number;
  ownerName: string;
  name: string;
  fullName: string;
  numStars: number;
  isFork: boolean;
  isPrivate: boolean;
  isMirror: boolean;
  description: string;
  updatedUnix: number;
}

interface ExploreReposData {
  repos: ExploreRepo[];
  total: number;
  page: number;
}

export default function ExploreRepos() {
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(window.location.search);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [data, setData] = useState<ExploreReposData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(subUrl(`/api/web/explore/repos?q=${encodeURIComponent(q)}&page=${page}`))
      .then((r) => r.json())
      .then((d) => {
        if (active) {
          setData(d as ExploreReposData);
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
  }, [q, page]);

  return (
    <div className="space-y-4 font-mono">
      <Card>
        <div className="p-4 border-b border-dashed border-(--color-muted-foreground)/50 flex justify-between items-center bg-(--color-muted-foreground)/5">
          <form className="flex gap-2">
            <span className="text-(--color-muted-foreground)">&gt;</span>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder={t("explore.search")}
              className="bg-transparent border-none outline-none flex-1 text-sm"
            />
            <button type="submit" className="text-green-500 hover:underline text-sm">
              [ SEARCH ]
            </button>
          </form>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="text-(--color-muted-foreground)">Loading...</div>
          ) : data?.repos?.length === 0 ? (
            <div className="text-(--color-muted-foreground)">No repositories found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.repos?.map((repo) => (
                <div
                  key={repo.id}
                  className="border border-dashed border-(--color-muted-foreground)/30 p-4 hover:border-green-500/50 transition-colors"
                >
                  <div className="flex justify-between">
                    <Link to={`/${repo.ownerName}/${repo.name}`} className="font-bold hover:underline text-green-400">
                      {repo.fullName}
                    </Link>
                    <span className="text-(--color-muted-foreground) text-sm">{repo.numStars} ★</span>
                  </div>
                  {repo.description && (
                    <div className="text-sm mt-2 opacity-80 text-(--color-foreground)">{repo.description}</div>
                  )}
                  <div className="text-xs text-(--color-muted-foreground) mt-4 flex gap-2">
                    {repo.isMirror && <span>[MIRROR]</span>}
                    {repo.isFork && <span>[FORK]</span>}
                    <span>Updated {new Date(repo.updatedUnix * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
