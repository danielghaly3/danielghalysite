import { notFound } from "next/navigation";
import { CmsResourceForm } from "@/components/dashboard/CmsResourceForm";
import { getCmsResource } from "@/lib/cms/admin";

type Props = { params: Promise<{ resource: string }> };

export default async function NewDashboardResourcePage({ params }: Props) {
  const { resource } = await params;
  const config = getCmsResource(resource);

  if (!config) notFound();

  return <CmsResourceForm config={config} />;
}
