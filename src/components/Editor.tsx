import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Change {
  id: string;
  type: 'deletion' | 'addition';
  content: string;
  startIndex: number;
  endIndex: number;
}

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
  const [changes] = useState<Change[]>([
    {
      id: '1',
      type: 'deletion',
      content: 'very ',
      startIndex: 20,
      endIndex: 25,
    },
    {
      id: '2',
      type: 'addition',
      content: 'extremely ',
      startIndex: 20,
      endIndex: 20,
    }
  ]);

  const renderTextWithChanges = () => {
    if (!content) return '';

    let result = [];
    let currentIndex = 0;

    const sortedChanges = [...changes].sort((a, b) => a.startIndex - b.startIndex);

    for (const change of sortedChanges) {
      if (currentIndex < change.startIndex) {
        result.push(
          <span key={`text-${currentIndex}`}>
            {content.slice(currentIndex, change.startIndex)}
          </span>
        );
      }

      if (change.type === 'deletion') {
        result.push(
          <span 
            key={change.id} 
            className="text-red-600 line-through hover:bg-red-50 group relative"
          >
            {content.slice(change.startIndex, change.endIndex)}
            <div className="absolute hidden group-hover:flex gap-1 -top-6 left-0 bg-white shadow-lg rounded-md p-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAcceptSuggestion(0)}
                className="h-6 text-xs"
              >
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRejectSuggestion(0)}
                className="h-6 text-xs"
              >
                Reject
              </Button>
            </div>
          </span>
        );
      } else {
        result.push(
          <span 
            key={change.id} 
            className="text-green-600 underline hover:bg-green-50 group relative"
          >
            {change.content}
            <div className="absolute hidden group-hover:flex gap-1 -top-6 left-0 bg-white shadow-lg rounded-md p-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAcceptSuggestion(0)}
                className="h-6 text-xs"
              >
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRejectSuggestion(0)}
                className="h-6 text-xs"
              >
                Reject
              </Button>
            </div>
          </span>
        );
      }

      currentIndex = change.type === 'deletion' ? change.endIndex : change.startIndex;
    }

    if (currentIndex < content.length) {
      result.push(
        <span key={`text-${currentIndex}`}>
          {content.slice(currentIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        className="flex-1 p-6 text-lg leading-relaxed bg-editor-bg text-editor-text"
      >
        {content ? (
          <div className="whitespace-pre-wrap">
            {renderTextWithChanges()}
          </div>
        ) : (
          <div className="text-gray-400">
            Paste your text here...
          </div>
        )}
      </div>
      {isLoading && (
        <div className="flex items-center justify-center p-4 border-t border-gray-200 animate-fadeIn">
          <Loader2 className="h-6 w-6 animate-spin text-editor-accent" />
        </div>
      )}
    </div>
  );
}
