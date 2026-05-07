import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CmsResourceForm } from "@/components/dashboard/CmsResourceForm";
import { getCmsResource } from "@/lib/cms/admin";
import { createClient } from "@/utils/supabase/server";

type Props = { params: Promise<{ resource: string; id: string }> };

export default async function EditDashboardResourcePage({ params }: Props) {
  const { resource, id } = await params;
  const config = getCmsResource(resource);

  if (!config) notFound();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from(config.table).select("*").eq("id", id).maybeSingle();

  if (error || !data) notFound();

  return <CmsResourceForm config={config} initialRow={data as Record<string, unknown> & { id?: string }} />;
}
