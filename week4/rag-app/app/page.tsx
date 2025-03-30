"use client";

import Header from "@/app/components/header";
import { useState } from "react";
import ChatSection from "./components/chat-section";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [charactersData, setCharactersData] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      console.log("Selected file:", selectedFile);
      setFile(selectedFile);
    } else {
      console.error("No file selected");
    }
  };

  const handleExtractCharacters = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/chat/extract", {
        method: "POST",
        body: formData,
      });

      console.log("Request sent to /api/chat/extract");

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        return;
      }

      const data = await response.json();
      console.log("Extracted Characters:", data);

      // Assuming data is an array of character objects
      if (Array.isArray(data) && data.length > 0) {
        const formattedData = data
          .map(
            (character) =>
              `Name: ${character.name}\nDescription: ${character.description}\nPersonality: ${character.personality}\n`,
          )
          .join("\n"); // Join with new lines for better readability

        setCharactersData(formattedData); // Set the formatted string to the state
        console.log("Characters data state updated:", formattedData);
      } else {
        console.warn("No characters found in the response:", data);
        setCharactersData("No characters extracted."); // Provide a default message
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <main className="h-screen w-screen flex justify-center items-center background-gradient">
      <div className="space-y-2 lg:space-y-10 w-[90%] lg:w-[60rem]">
        <Header />
        <div className="h-[65vh] flex">
          <ChatSection />
        </div>
        <div className="flex flex-col items-center">
          <input type="file" onChange={handleFileChange} className="mb-2" />
          <button
            onClick={handleExtractCharacters}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Extract Characters
          </button>
          <div className="mt-4 w-full overflow-x-auto">
            <textarea
              rows={10}
              cols={50}
              value={charactersData}
              readOnly
              className="border border-gray-300 p-2"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
