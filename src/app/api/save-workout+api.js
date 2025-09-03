import { adminClient } from "../../lib/sanity/client";

export async function POST(request) {
  const { workoutData } = await request.json();
  console.log("this is data that we are trying to save", workoutData);

  try {
    const result = await adminClient.create(workoutData);
    console.log("workout saved successfully through the backend");
    return Response.json({
      success: true,
      workoutId: result._id,
      message: "Workout saved successfully",
    });
  } catch (error) {
    console.error("Error saving workout", error);
    return Response.json({ error: "Failed to save workout" }, { status: 500 });
  }
}
