"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CMS_UPDATE_EVENT, parseCmsUpdateEvent } from "@/lib/cms/client-sync";

function affectsPath(paths: string[], pathname: string) {
  return paths.some((path) => {
    if (path === pathname) return true;
    if (path === "/projects" && pathname.startsWith("/projects/")) return true;
    if (path === "/blog" && pathname.startsWith("/blog/")) return true;
    return false;
  });
}

export function CmsLiveRefresh() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function onCmsUpdate(event: Event) {
      const payload = parseCmsUpdateEvent(event);
      if (!payload || !affectsPath(payload.paths, pathname)) return;
      router.refresh();
    }

    window.addEventListener(CMS_UPDATE_EVENT, onCmsUpdate);
    window.addEventListener("storage", onCmsUpdate);
    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, onCmsUpdate);
      window.removeEventListener("storage", onCmsUpdate);
    };
  }, [pathname, router]);

  return null;
}
