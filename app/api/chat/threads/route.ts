import { apiHandler } from "@/lib/api/api_handler";
import { getThreadsUseCase } from "@/lib/container/runtime";

export async function GET() {
  return apiHandler(() =>
    getThreadsUseCase.execute(),
  );
}