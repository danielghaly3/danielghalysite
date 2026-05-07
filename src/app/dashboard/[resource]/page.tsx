import { notFound } from "next/navigation";
import { CmsResourceManager } from "@/components/dashboard/CmsResourceManager";
import { cmsResources, getCmsResource } from "@/lib/cms/admin";

type Props = { params: Promise<{ resource: string }> };

export function generateStaticParams() {
  return cmsResources.map((resource) => ({ resource: resource.id }));
}

export default async function DashboardResourcePage({ params }: Props) {
  const { resource } = await params;
  const config = getCmsResource(resource);

  if (!config) notFound();

  return <CmsResourceManager config={config} />;
}
