"use server";
import { openai } from "@/utils/open_ai/utils";

export async function getChatGPTResponse(userPrompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      store: true,
      messages: [
        {
          role: "system",
          content: `You are a smart project and task planner. You assist users with their projects and tasks.  
            If you generate a task, start with "Add Task". If you generate a project, start with "Add Project".  
            Tasks and projects **must** be in **JSON format** like this:  
            {  
              "title": "Project or Task Name",  
              "description": "Brief Description",  
              "planned_end_date": "YYYY-MM-DD",  
              "priority": "high" | "medium" | "low"  
            }`,
        },
        { role: "user", content: userPrompt },
      ],
    });

    const result = response.choices[0]?.message?.content;

    if (!result) throw new Error("Empty response from OpenAI");

    return result;
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error);
    return { error: "Failed to get response from ChatGPT" };
  }
}
