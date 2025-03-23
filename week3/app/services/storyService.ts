import { Character } from "../types/character";

export class StoryService {
  private static instance: StoryService;
  private characters: Character[] = [];

  private constructor() {}

  static getInstance(): StoryService {
    if (!StoryService.instance) {
      StoryService.instance = new StoryService();
    }
    return StoryService.instance;
  }

  setCharacters(characters: Character[]) {
    this.characters = characters;
  }

  private async generateWithModel(prompt: string, model: string) {
    const characterContext = this.characters
      .map(
        (char) =>
          `Character: ${char.name}\nDescription: ${char.description}\nPersonality: ${char.personality}`
      )
      .join("\n\n");

    const fullPrompt = `Given these characters:\n\n${characterContext}\n\nGenerate a story based on this prompt: ${prompt}\n\nInclude all characters in meaningful roles.`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        //"http://127.0.0.1:5000",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "system",
                content:
                  "You are a creative storyteller who creates engaging stories with well-defined character roles.",
              },
              {
                role: "user",
                content: fullPrompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error generating story with ${model}: ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      const story = data.choices[0].message.content;

      // Generate character roles summary
      const rolesPrompt = `Based on this story:\n\n${story}\n\nSummarize the role of each character in the story.`;
      const rolesResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "system",
                content:
                  "You are an expert at analyzing character roles in stories.",
              },
              {
                role: "user",
                content: rolesPrompt,
              },
            ],
            temperature: 0.3,
            max_tokens: 500,
          }),
        }
      );

      if (!rolesResponse.ok) {
        const errorData = await rolesResponse.json();
        throw new Error(
          `Error generating character roles with ${model}: ${
            errorData.error?.message || rolesResponse.statusText
          }`
        );
      }

      const rolesData = await rolesResponse.json();
      const rolesSummary = rolesData.choices[0].message.content;

      return {
        story,
        characterRoles: this.parseCharacterRoles(rolesSummary),
      };
    } catch (error) {
      console.error(`Error in generateWithModel for ${model}:`, error);
      throw error;
    }
  }

  private parseCharacterRoles(rolesSummary: string): { [key: string]: string } {
    const roles: { [key: string]: string } = {};
    const lines = rolesSummary.split("\n");

    lines.forEach((line) => {
      const character = this.characters.find((char) =>
        line.toLowerCase().includes(char.name.toLowerCase())
      );
      if (character) {
        roles[character.id] = line.trim();
      }
    });

    return roles;
  }

  async generateStory(prompt: string) {
    return this.generateWithModel(prompt, "gpt-4o-mini");
  }

  async compareModels(prompt: string) {
    const models = ["gpt-4o-mini", "gpt-4"];
    const results: {
      [modelName: string]: {
        story: string;
        characterRoles: { [key: string]: string };
      };
    } = {};

    for (const model of models) {
      try {
        results[model] = await this.generateWithModel(prompt, model);
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        results[model] = {
          story: `Error generating story with ${model}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          characterRoles: {},
        };
      }
    }

    return results;
  }
}
