"use server";

import { headers } from "next/headers";

export async function detectCountry(): Promise<string> {
  if (process.env.NODE_ENV === "development") {
    return "IN";
  }

  const headersList = await headers();
  const country = headersList.get('x-vercel-ip-country') || headersList.get('cf-ipcountry') || 'US';
  return country;
}
