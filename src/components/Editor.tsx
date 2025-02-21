
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EditorProps {
  onContentChange: (content: string) => void;
  content: string;
  suggestions: string[];
  isLoading: boolean;
  onAcceptSuggestion: (index: number) => void;
  onRejectSuggestion: (index: number) => void;
}

export function Editor({
  onContentChange,
  content,
  suggestions,
  isLoading,
  onAcceptSuggestion,
  onRejectSuggestion,
}: EditorProps) {
  return (
    <div className="flex flex-col h-full">
      <textarea
        className="flex-1 p-6 text-lg leading-relaxed outline-none resize-none bg-editor-bg text-editor-text"
        placeholder="Paste your text here..."
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
      />
      {suggestions.length > 0 && (
        <div className="border-t border-gray-200 p-4 space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-lg text-editor-text">Suggestions</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 bg-editor-subtle rounded-lg flex items-start justify-between gap-4 animate-slideIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="text-editor-text flex-1">{suggestion}</p>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAcceptSuggestion(index)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRejectSuggestion(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {isLoading && (
        <div className="flex items-center justify-center p-4 border-t border-gray-200 animate-fadeIn">
          <Loader2 className="h-6 w-6 animate-spin text-editor-accent" />
        </div>
      )}
    </div>
  );
}
