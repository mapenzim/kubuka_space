import { NextResponse } from "next/server";
import {
  ApiErrorResponse,
  ApiResponse,
} from "./response";

export async function apiHandler<T>(
  action: () => Promise<T>,
) {
  try {
    const data = await action();

    const response: ApiResponse<T> = {
      success: true,
      data,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);

    const response: ApiErrorResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    };

    return NextResponse.json(
      response,
      {
        status: 500,
      },
    );
  }
}