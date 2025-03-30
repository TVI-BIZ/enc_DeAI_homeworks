import axios from "axios"; // Import axios for making HTTP requests
import { promises as fs } from "fs"; // Import fs to read files
import { NextResponse } from "next/server";
import os from "os"; // Import os to get the temporary directory
import path from "path"; // Import path to handle file paths

/**
 * This API is to extract characters from the uploaded file
 */
export async function POST(request: Request) {
  const formData = await request.formData(); // Use formData to get the uploaded file
  const file = formData.get("file") as File; // Get the file from formData

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  try {
    // Use a temporary directory to save the file
    const tempDir = path.join(os.tmpdir(), file.name); // Use the OS temp directory
    const buffer = await file.arrayBuffer(); // Get the file as an ArrayBuffer
    await fs.writeFile(tempDir, Buffer.from(buffer)); // Write the file to the temporary directory

    // Process the file content with your LLM
    const characters = await processWithLLM(tempDir); // Process the content

    // Clean up: Delete the file after processing if needed
    await fs.unlink(tempDir); // Remove the file after processing

    return NextResponse.json(characters, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to extract characters: ${error.message}` },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        { error: "Failed to extract characters: Unknown error" },
        { status: 500 },
      );
    }
  }
}

// Example function to process the file content with your LLM
async function processWithLLM(
  filePath: string,
): Promise<{ name: string; description: string; personality: string }[]> {
  // Read the file content
  const content = await fs.readFile(filePath, "utf-8");

  try {
    // Call the OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // or "gpt-4" if you have access
        messages: [
          {
            role: "user",
            content: `Extract character names, descriptions, and personalities from the following text:\n\n${content}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ***`, // Replace with your actual OpenAI API key
          "Content-Type": "application/json",
        },
      },
    );

    // Check if the response is OK
    if (response.status !== 200) {
      console.error("Error response:", response.data); // Log the raw response data
      throw new Error("Failed to get a valid response from the LLM.");
    }

    // Assuming the LLM returns a structured response
    const charactersData = response.data.choices[0].message.content; // Get the raw characters data
    console.log("Characters data received:", charactersData); // Log the characters data

    // Split the charactersData into structured objects
    const characters = charactersData.split("\n").map((line: string) => {
      const parts = line.split(":");
      return {
        name: parts[0]?.trim() || "Not extracted",
        description: parts[1]?.trim() || "Not extracted",
        personality: parts[2]?.trim() || "Not extracted",
      };
    });

    return characters; // Return the array of character objects
  } catch (error: unknown) {
    console.error("Error calling OpenAI API:", error); // Log the error
    if (error instanceof Error) {
      throw new Error("Failed to process with LLM: " + error.message); // Use error.message if it's an instance of Error
    } else {
      throw new Error("Failed to process with LLM: Unknown error"); // Handle unknown error types
    }
  }
}

// Example function to extract characters from text
function extractCharactersFromText(text: string): string[] {
  // Implement your character extraction logic here
  return text.split(""); // Split text into individual characters (this is just a placeholder)
}
