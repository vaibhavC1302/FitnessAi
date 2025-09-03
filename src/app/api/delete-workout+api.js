import { adminClient } from "../../lib/sanity/client";

export async function POST(request) {
  console.log("backend deleting workout");
  const { workoutId } = await request.json();
  try {
    await adminClient.delete(workoutId);
    console.log("workout deleted successfully");
    return Response.json({
      success: true,
      message: "Workout deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting workout", error);
    return Response.json(
      { error: "Failed to delete workout" },
      { status: 500 }
    );
  }
}
