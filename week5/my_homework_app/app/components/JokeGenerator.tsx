"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Zod schema for form validation
const jokeFormSchema = z.object({
  topic: z
    .string()
    .min(2, "Topic must be at least 2 characters")
    .max(50, "Topic must be less than 50 characters"),
  tone: z.enum(["funny", "sarcastic", "dad-joke", "clever"], {
    required_error: "Please select a tone",
  }),
  type: z.enum(["one-liner", "knock-knock", "story", "pun"], {
    required_error: "Please select a type",
  }),
  temperature: z
    .number()
    .min(0, "Temperature must be between 0 and 1")
    .max(1, "Temperature must be between 0 and 1"),
});

type JokeFormData = z.infer<typeof jokeFormSchema>;

interface JokeEvaluation {
  funnyScore: number;
  appropriateScore: number;
  isOffensive: boolean;
  badges: string[];
}

export default function JokeGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [joke, setJoke] = useState<string>("");
  const [evaluation, setEvaluation] = useState<JokeEvaluation | null>(null);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<JokeFormData>({
    resolver: zodResolver(jokeFormSchema),
    defaultValues: {
      topic: "",
      tone: "funny",
      type: "one-liner",
      temperature: 0.7,
    },
  });

  const temperature = watch("temperature");

  const onSubmit = async (data: JokeFormData) => {
    setIsLoading(true);
    setError("");
    setJoke("");
    setEvaluation(null);

    try {
      const response = await fetch("/api/generate-joke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to generate joke");
      }

      setJoke(responseData.joke);
      setEvaluation(responseData.evaluation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate joke");
    } finally {
      setIsLoading(false);
    }
  };

  const renderScoreMeter = (score: number, label: string) => (
    <div className="flex items-center space-x-2 relative group">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">
        {label}:
      </span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${
            score >= 7
              ? "bg-gradient-to-r from-green-400 to-green-500"
              : score >= 4
              ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
              : "bg-gradient-to-r from-red-400 to-red-500"
          }`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
        {score}/10
      </span>
      {/* Tooltip */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap">
        {score >= 7 ? "Excellent" : score >= 4 ? "Good" : "Needs Improvement"}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Topic Input */}
          <div className="relative">
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Topic
              <span className="ml-1 text-blue-500">*</span>
            </label>
            <input
              type="text"
              id="topic"
              {...register("topic")}
              className={`mt-1 block w-full rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                errors.topic
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              placeholder="Enter a topic for your joke"
            />
            {errors.topic && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
                {errors.topic.message}
              </p>
            )}
          </div>

          {/* Tone Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="tone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Tone
                <span className="ml-1 text-blue-500">*</span>
              </label>
              <select
                id="tone"
                {...register("tone")}
                className={`mt-1 block w-full rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  errors.tone
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              >
                <option value="funny">Funny</option>
                <option value="sarcastic">Sarcastic</option>
                <option value="dad-joke">Dad Joke</option>
                <option value="clever">Clever</option>
              </select>
              {errors.tone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
                  {errors.tone.message}
                </p>
              )}
            </div>

            {/* Joke Type Selection */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Type of Joke
                <span className="ml-1 text-blue-500">*</span>
              </label>
              <select
                id="type"
                {...register("type")}
                className={`mt-1 block w-full rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  errors.type
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              >
                <option value="one-liner">One-liner</option>
                <option value="knock-knock">Knock-knock</option>
                <option value="story">Story</option>
                <option value="pun">Pun</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          {/* Creativity Level Slider */}
          <div>
            <label
              htmlFor="temperature"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Creativity Level (Temperature)
            </label>
            <input
              type="range"
              id="temperature"
              min="0"
              max="1"
              step="0.1"
              {...register("temperature", { valueAsNumber: true })}
              className="mt-1 block w-full accent-blue-500 cursor-pointer"
            />
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
              <span
                className={`transition-colors duration-200 ${
                  temperature < 0.4 ? "text-blue-500 font-medium" : ""
                }`}
              >
                Conservative
              </span>
              <span
                className={`transition-colors duration-200 ${
                  temperature >= 0.4 && temperature < 0.7
                    ? "text-blue-500 font-medium"
                    : ""
                }`}
              >
                Balanced
              </span>
              <span
                className={`transition-colors duration-200 ${
                  temperature >= 0.7 ? "text-blue-500 font-medium" : ""
                }`}
              >
                Creative
              </span>
            </div>
            {errors.temperature && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
                {errors.temperature.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Generating...</span>
              </div>
            ) : (
              "Generate Joke"
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-800 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Display Generated Joke with Evaluation */}
      {joke && (
        <div className="mt-8 space-y-6 animate-fadeIn">
          {/* Joke Content */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <svg
                className="h-6 w-6 text-blue-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated Joke
              </h3>
            </div>
            <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
              {joke}
            </p>
          </div>

          {/* Joke Evaluation */}
          {evaluation && (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
              <div className="flex items-center mb-4">
                <svg
                  className="h-6 w-6 text-blue-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Joke Evaluation
                </h3>
              </div>

              {/* Score Meters */}
              <div className="space-y-4">
                {renderScoreMeter(evaluation.funnyScore, "Humor")}
                {renderScoreMeter(evaluation.appropriateScore, "Appropriate")}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {evaluation.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700 shadow-sm transition-transform duration-200 hover:scale-105"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Offensive Warning */}
              {evaluation.isOffensive && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-800 flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>
                    This joke may be considered offensive by some audiences.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
