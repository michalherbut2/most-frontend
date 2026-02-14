"use client";

import React, { useState } from "react";
// import { gamesApi } from "../api/gamesApi";
import { CreateBetRequest } from "../types";
import { useCreateBet } from "../api/queries";

interface CreateBetFormProps {
  onSuccess: () => void;
}

export const CreateBetForm: React.FC<CreateBetFormProps> = ({ onSuccess }) => {
  const [topic, setTopic] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [bettingDeadline, setBettingDeadline] = useState("");
  const [resolutionDate, setResolutionDate] = useState("");

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const { mutate: createBet, isPending: isSubmitting } = useCreateBet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (topic.trim().length < 10) {
      alert("Topic must be at least 10 characters");
      return;
    }

    const validOptions = options.filter(o => o.trim());
    if (validOptions.length < 2) {
      alert("Must have at least 2 options");
      return;
    }

    if (!bettingDeadline || !resolutionDate) {
      alert("Please set both deadlines");
      return;
    }

    const request: CreateBetRequest = {
      topic: topic.trim(),
      options: validOptions.map(o => o.trim()),
      bettingDeadline,
      resolutionDate,
    };

    try {
      createBet(request);
      // Reset form
      setTopic("");
      setOptions(["", ""]);
      setBettingDeadline("");
      setResolutionDate("");
      onSuccess();
      alert("Bet created successfully!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create bet");
    }
  };

  // Get minimum datetime for inputs (now + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create New Bet
        </h2>
        <p className="text-sm text-gray-600">
          Create a bet for others to participate in. You&apos;ll be able to resolve
          it once the outcome is known.
        </p>
      </div>

      {/* Topic */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Bet Topic / Question
        </label>
        <textarea
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g., Will it rain in Warsaw tomorrow? Who will win the Champions League?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          rows={3}
          maxLength={500}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {topic.length}/500 characters
        </p>
      </div>

      {/* Options */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Betting Options
        </label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={e => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 10 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-2 text-purple-600 hover:text-purple-800 text-sm font-semibold"
          >
            + Add Option
          </button>
        )}
      </div>

      {/* Deadlines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Betting Deadline
          </label>
          <input
            type="datetime-local"
            value={bettingDeadline}
            onChange={e => setBettingDeadline(e.target.value)}
            min={getMinDateTime()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">When betting closes</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Expected Resolution
          </label>
          <input
            type="datetime-local"
            value={resolutionDate}
            onChange={e => setResolutionDate(e.target.value)}
            min={bettingDeadline || getMinDateTime()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">When outcome is known</p>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        {isSubmitting ? "Creating..." : "Create Bet"}
      </button>
    </form>
  );
};
