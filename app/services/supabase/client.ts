import { createBrowserClient } from "@supabase/ssr";

const options = {
  db: {
    schema: process.env.NEXT_PUBLIC_SCHEMA,
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {},
};

export const supabaseOptions = options;

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    supabaseOptions,
  )
}

export function statusTextOK(statusText: string) {
  return statusText == "OK";
}

export function statusOk(status: number) {
  return status / 100 == 2;
}

export function statusOkNoError(status: number, error: object) {
  return statusOk(status) && !error;
}

export function dataOk(status: number, data?: object) {
  return (
    statusOk(status) && data != null && data instanceof Array && data.length > 0
  );
}

export function created(status: number) {
  return status == 201;
}

export function updated(status: number) {
  return status == 204;
}