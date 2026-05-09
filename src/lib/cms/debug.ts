type SupabaseLikeError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

export function logCmsMutationError({
  action,
  table,
  payload,
  error
}: {
  action: string;
  table: string;
  payload: unknown;
  error: SupabaseLikeError;
}) {
  if (process.env.NODE_ENV !== "development") return;

  console.error("[CMS Supabase mutation failed]", {
    action,
    table,
    payload,
    error: {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    }
  });
}
