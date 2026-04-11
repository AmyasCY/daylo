import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase, mongoose } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const connection = await connectToDatabase();

    return successResponse({
      database: connection.connection.name,
      host: connection.connection.host,
      readyState: mongoose.connection.readyState,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database connection error";

    return errorResponse("DB_CONNECTION_ERROR", message, { status: 500 });
  }
}
