import { Link } from "@tanstack/react-router";
import { Calendar, Link as LinkIcon, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { subUrl } from "@/lib/url";

interface ExploreOrg {
  id: number;
  name: string;
  fullName: string;
  avatarUrl: string;
  location: string;
  website: string;
  createdUnix: number;
}

interface ExploreOrgsData {
  users: ExploreOrg[];
  total: number;
  page: number;
}

export default function ExploreOrgs() {
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(window.location.search);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [data, setData] = useState<ExploreOrgsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(subUrl(`/api/web/explore/orgs?q=${encodeURIComponent(q)}&page=${page}`))
      .then((r) => r.json())
      .then((d) => {
        if (active) {
          setData(d as ExploreOrgsData);
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
          ) : data?.users?.length === 0 ? (
            <div className="text-(--color-muted-foreground)">No organizations found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.users?.map((org) => (
                <div
                  key={org.id}
                  className="border border-dashed border-(--color-muted-foreground)/30 p-4 hover:border-green-500/50 transition-colors flex items-start gap-4"
                >
                  <img src={org.avatarUrl} alt="" className="w-16 h-16 border border-(--color-muted-foreground)/30" />
                  <div className="flex flex-col">
                    <Link to={`/${org.name}`} className="font-bold hover:underline text-green-400 text-lg">
                      {org.name}
                    </Link>
                    {org.fullName && <span className="text-(--color-muted-foreground) text-sm">{org.fullName}</span>}

                    <div className="text-xs text-(--color-muted-foreground) mt-2 space-y-1">
                      {org.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {org.location}
                        </div>
                      )}
                      {org.website && (
                        <div className="flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" />
                          <a href={org.website} target="_blank" rel="noreferrer" className="hover:underline">
                            {org.website}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(org.createdUnix * 1000).toLocaleDateString()}
                      </div>
                    </div>
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
