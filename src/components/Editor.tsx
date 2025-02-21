
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Undo } from "lucide-react";

interface Change {
  id: string;
  type: 'deletion' | 'addition';
  content: string;
  startIndex: number;
  endIndex: number;
}

interface TextModification {
  originalText: string;
  modifiedText: string;
  changes: Change[];
}

interface EditorProps {
  onContentChange: (content: string) => void;
  content: string;
  suggestions: string[];
  isLoading: boolean;
  onAcceptSuggestion: (index: number, changes: Change[]) => void;
  onRejectSuggestion: (index: number) => void;
  modifications: TextModification[];
}

export function Editor({
  onContentChange,
  content,
  suggestions,
  isLoading,
  onAcceptSuggestion,
  onRejectSuggestion,
  modifications,
}: EditorProps) {
  const [selectedModification, setSelectedModification] = useState<TextModification | null>(null);

  const handleContentEdit = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(event.target.value);
  };

  const renderTextWithChanges = () => {
    if (!selectedModification) {
      return null;
    }

    const changes = selectedModification.changes;
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
                onClick={() => selectedModification && onAcceptSuggestion(0, selectedModification.changes)}
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
                onClick={() => selectedModification && onAcceptSuggestion(0, selectedModification.changes)}
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
      <div className="border-b border-gray-200 p-2 flex justify-between items-center">
        <div className="flex gap-2">
          {modifications.map((mod, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setSelectedModification(mod)}
            >
              <Undo className="h-4 w-4" />
              Change {index + 1}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 text-lg leading-relaxed bg-editor-bg text-editor-text">
        {selectedModification ? (
          <div className="whitespace-pre-wrap">
            {renderTextWithChanges()}
          </div>
        ) : (
          <textarea
            value={content}
            onChange={handleContentEdit}
            className="w-full h-full min-h-[200px] bg-transparent outline-none resize-none"
            placeholder="Paste your text here..."
          />
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
