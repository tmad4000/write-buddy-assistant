
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Wand2 } from "lucide-react";

interface AISidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onSuggestionRequest: (prompt: string) => void;
  isLoading: boolean;
}

const commonSuggestions = [
  "Make it shorter",
  "Make it more professional",
  "Fix grammar and spelling",
  "Improve clarity",
  "Make it more engaging",
];

export function AISidebar({
  isExpanded,
  onToggle,
  onSuggestionRequest,
  isLoading,
}: AISidebarProps) {
  return (
    <div
      className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
        isExpanded ? "w-80" : "w-12"
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-3 top-4 h-6 w-6 rounded-full border shadow-sm"
        onClick={onToggle}
      >
        {isExpanded ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
      
      {isExpanded && (
        <div className="p-4 space-y-4 animate-fadeIn">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-editor-accent" />
            AI Suggestions
          </h2>
          <div className="space-y-2">
            {commonSuggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                className="w-full justify-start text-left"
                disabled={isLoading}
                onClick={() => onSuggestionRequest(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
