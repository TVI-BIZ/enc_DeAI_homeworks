"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CharacterTable from "./components/CharacterTable";
import { Character } from "./types/character";
import { StoryService } from "./services/storyService";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [characterRoles, setCharacterRoles] = useState<{
    [key: string]: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [modelComparison, setModelComparison] = useState<{
    [modelName: string]: {
      story: string;
      characterRoles: { [key: string]: string };
    };
  } | null>(null);

  const storyService = StoryService.getInstance();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddCharacter = (character: Omit<Character, "id">) => {
    const newCharacter = { ...character, id: uuidv4() };
    const updatedCharacters = [...characters, newCharacter];
    setCharacters(updatedCharacters);
    storyService.setCharacters(updatedCharacters);
  };

  const handleEditCharacter = (character: Character) => {
    const updatedCharacters = characters.map((c: Character) =>
      c.id === character.id ? character : c
    );
    setCharacters(updatedCharacters);
    storyService.setCharacters(updatedCharacters);
  };

  const handleDeleteCharacter = (id: string) => {
    const updatedCharacters = characters.filter((c: Character) => c.id !== id);
    setCharacters(updatedCharacters);
    storyService.setCharacters(updatedCharacters);
  };

  const handleGenerateStory = async () => {
    setIsLoading(true);
    try {
      const response = await storyService.generateStory(prompt);
      setStory(response.story);
      setCharacterRoles(response.characterRoles);
    } catch (error) {
      console.error("Error generating story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareModels = async () => {
    setIsLoading(true);
    try {
      const comparison = await storyService.compareModels(prompt);
      setModelComparison(comparison);
    } catch (error) {
      console.error("Error comparing models:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Story Generator2</h1>

      <CharacterTable
        characters={characters}
        onAdd={handleAddCharacter}
        onEdit={handleEditCharacter}
        onDelete={handleDeleteCharacter}
      />

      <div className="max-w-4xl mx-auto mt-8">
        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your story prompt..."
            className="w-full p-4 border rounded min-h-[100px]"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleGenerateStory}
            disabled={isLoading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isLoading ? "Generating..." : "Generate Story"}
          </button>
          <button
            onClick={handleCompareModels}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "Comparing..." : "Compare Models"}
          </button>
        </div>
      </div>

      {story && (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Story</h2>
          <div className="p-4 border rounded bg-white">
            <p className="whitespace-pre-wrap">{story}</p>
          </div>
        </div>
      )}

      {Object.keys(characterRoles).length > 0 && (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">Character Roles</h2>
          <div className="p-4 border rounded bg-white">
            {Object.entries(characterRoles).map(([id, role]) => {
              const character = characters.find((c) => c.id === id);
              return (
                <div key={id} className="mb-2">
                  <strong>{character?.name}:</strong> {role}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {modelComparison && (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">Model Comparison</h2>
          {Object.entries(modelComparison).map(([modelName, result]) => (
            <div key={modelName} className="mb-8 p-4 border rounded bg-white">
              <h3 className="text-xl font-bold mb-2">{modelName}</h3>
              <p className="whitespace-pre-wrap mb-4">{result.story}</p>
              <h4 className="font-bold mb-2">Character Roles:</h4>
              {Object.entries(result.characterRoles).map(([id, role]) => {
                const character = characters.find((c) => c.id === id);
                return (
                  <div key={id} className="mb-1">
                    <strong>{character?.name}:</strong> {role}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
