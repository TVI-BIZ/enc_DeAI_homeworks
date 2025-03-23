"use client";

import { useState, useEffect } from "react";
import { Character } from "../types/character";

interface CharacterTableProps {
  characters: Character[];
  onAdd: (character: Omit<Character, "id">) => void;
  onEdit: (character: Character) => void;
  onDelete: (id: string) => void;
}

export default function CharacterTable({
  characters,
  onAdd,
  onEdit,
  onDelete,
}: CharacterTableProps) {
  const [mounted, setMounted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Character, "id">>({
    name: "",
    description: "",
    personality: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onEdit({ ...formData, id: editingId });
      setEditingId(null);
    } else {
      onAdd(formData);
    }
    setFormData({ name: "", description: "", personality: "" });
    setIsAdding(false);
  };

  const handleEdit = (character: Character) => {
    setFormData({
      name: character.name,
      description: character.description,
      personality: character.personality,
    });
    setEditingId(character.id);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Characters</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Character
        </button>
      </div>

      {(isAdding || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded bg-white"
        >
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Personality
              </label>
              <textarea
                value={formData.personality}
                onChange={(e) =>
                  setFormData({ ...formData, personality: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {editingId ? "Save" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ name: "", description: "", personality: "" });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {characters.map((character) => (
          <div
            key={character.id}
            className="p-4 border rounded bg-white flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-bold">{character.name}</h3>
              <p className="text-gray-600 mt-1">{character.description}</p>
              <p className="text-gray-600 mt-1">
                <strong>Personality:</strong> {character.personality}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(character)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(character.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
