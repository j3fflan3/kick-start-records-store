import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { path, type } = await request.json();
  revalidatePath(path, type);
  return NextResponse.json({
    data: { revalidated: true, path, type },
    error: null,
  });
}
