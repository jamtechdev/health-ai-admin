import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      applinks: {
        details: [
          {
            appIDs: ["D6862T369U.com.emc26ventures.tovapulse"],
            components: [{ "/": "*" }],
          },
        ],
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
