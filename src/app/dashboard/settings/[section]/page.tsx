import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { SettingsModuleForm } from "@/components/dashboard/SettingsModuleForm";
import { getSettingsModule, type SettingRow } from "@/lib/cms/settings-modules";
import { createClient } from "@/utils/supabase/server";

type Props = { params: Promise<{ section: string }> };

export const dynamic = "force-dynamic";

export default async function DashboardSettingsSectionPage({ params }: Props) {
  const { section } = await params;
  const settingsModule = getSettingsModule(section);

  if (!settingsModule) notFound();

  const { Icon: _Icon, ...clientModule } = settingsModule;
  void _Icon;

  const supabase = createClient(await cookies());
  const keys = settingsModule.fields.map((field) => field.key);
  const { data } = await supabase
    .from("site_settings")
    .select("key,value,updated_at")
    .in("key", keys);

  return <SettingsModuleForm module={clientModule} rows={(data ?? []) as SettingRow[]} />;
}
