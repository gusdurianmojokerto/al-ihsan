import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bigintToNumber(data: any): any {
  if (typeof data === "bigint") {
    return Number(data);
  }
  if (Array.isArray(data)) {
    return data.map(bigintToNumber);
  }
  if (data && typeof data === "object" && data.constructor === Object) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(data)) {
      result[key] = bigintToNumber(data[key]);
    }
    return result;
  }
  return data;
}

export function jsonResponse(data: unknown, init?: ResponseInit) {
  return NextResponse.json(bigintToNumber(data), init);
}
