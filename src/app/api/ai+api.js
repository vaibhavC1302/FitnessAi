import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  console.log("expo api hit");
  const { exerciseName } = await request.json();

  if (!exerciseName) {
    return Response.json(
      { error: "Exercise name is required" },
      { status: 404 }
    );
  }

  console.log("API exercise name ------------>", exerciseName);

  const prompt = `
        As a fitness coach, provide concise instructions for ${exerciseName}.
        Use markdown formatting 
Use following format :
    ## Equipment
    ## Instructions  
    ### Tips
    ### Safety

Keep each section brief. Use 1-2 sentences per point. No introductions or conclusions.
    `;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    console.log("AI RESPONSE -----> ", response.choices[0].message);
    return Response.json({ message: response?.choices[0]?.message?.content });
  } catch (error) {
    console.error("Error fetching ai guidance", error);
    return Response.json(
      {
        error: "Error fetching ai guidance",
      },
      {
        status: 500,
      }
    );
  }
}
