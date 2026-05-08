import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { SectionEditorForm } from "@/components/dashboard/SectionEditorForm";
import { getSectionEditorSchema, type SectionEditorPage } from "@/lib/cms/section-editor";
import { createClient } from "@/utils/supabase/server";

type Props = { params: Promise<{ page: string; section: string }> };

function isSectionEditorPage(value: string): value is SectionEditorPage {
  return value === "home" || value === "projects";
}

export default async function DashboardSectionEditorPage({ params }: Props) {
  const { page, section } = await params;
  if (!isSectionEditorPage(page)) notFound();

  const schema = getSectionEditorSchema(page, section);
  if (!schema) notFound();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const sectionPromise = supabase
    .from("page_sections")
    .select("*")
    .eq("page", page)
    .eq("section_key", section)
    .maybeSingle();

  const repeaterPromise = schema.repeater
    ? supabase
        .from(schema.repeater.table)
        .select("*")
        .order("order_index", { ascending: true })
    : Promise.resolve({ data: null });

  const [sectionRes, repeaterRes] = await Promise.all([sectionPromise, repeaterPromise]);
  const initialRow = (sectionRes.data ?? null) as Record<string, unknown> | null;
  const repeaterItems = ((repeaterRes.data as unknown as Record<string, unknown>[] | null) ?? []) as
    (Record<string, unknown> & { id?: string })[];

  return (
    <SectionEditorForm
      page={page}
      schema={schema}
      initialRow={initialRow}
      repeaterItems={repeaterItems}
    />
  );
}
