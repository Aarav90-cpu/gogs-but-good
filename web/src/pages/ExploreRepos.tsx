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
    <div className="space-y-4">
      <Card>
        <div className="p-4 border-b border-(--color-border) flex justify-between items-center bg-(--color-surface) rounded-t-[inherit]">
          <form className="flex gap-2 w-full max-w-lg items-center bg-(--color-background) border border-(--color-border) rounded-full px-4 py-1.5 focus-within:ring-2 ring-(--color-ring)">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder={t("explore.search")}
              className="bg-transparent border-none outline-none flex-1 text-sm text-(--color-foreground)"
            />
            <button type="submit" className="text-(--color-primary) hover:text-(--color-primary-foreground) hover:bg-(--color-primary) px-3 py-1 rounded-full transition-colors text-sm font-medium">
              Search
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
                  className="border border-(--color-border) rounded-xl p-5 hover:shadow-md hover:border-(--color-primary)/50 transition-all bg-(--color-card)"
                >
                  <div className="flex justify-between items-start">
                    <Link to={`/${repo.ownerName}/${repo.name}`} className="font-bold hover:underline text-(--color-primary) text-lg break-all">
                      {repo.fullName}
                    </Link>
                    <span className="text-(--color-muted-foreground) text-sm shrink-0 ml-4 bg-(--color-secondary) px-2 py-1 rounded-md font-medium">{repo.numStars} ★</span>
                  </div>
                  {repo.description && (
                    <div className="text-sm mt-2 opacity-80 text-(--color-foreground)">{repo.description}</div>
                  )}
                  <div className="text-xs text-(--color-muted-foreground) mt-4 flex gap-2 font-medium">
                    {repo.isMirror && <span className="bg-(--color-secondary) px-1.5 py-0.5 rounded text-(--color-secondary-foreground)">Mirror</span>}
                    {repo.isFork && <span className="bg-(--color-secondary) px-1.5 py-0.5 rounded text-(--color-secondary-foreground)">Fork</span>}
                    <span className="flex items-center ml-auto">Updated {new Date(repo.updatedUnix * 1000).toLocaleDateString()}</span>
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
