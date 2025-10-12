import { handlers } from "@/auth";
export const runtime = "nodejs"; // instead of "edge"

export const { GET, POST } = handlers;
