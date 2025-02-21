
import { useState } from "react";
import { Editor } from "@/components/Editor";
import { AISidebar } from "@/components/AISidebar";
import { useToast } from "@/components/ui/use-toast";

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

const Index = () => {
  const [content, setContent] = useState("This is a very important document that needs some improvements.");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [modifications, setModifications] = useState<TextModification[]>([]);
  const { toast } = useToast();

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const generateChanges = (text: string, prompt: string): Change[] => {
    // This is where we'll integrate with the AI API
    // For now, let's create some example changes
    const changes: Change[] = [];
    
    if (prompt === "Make it shorter") {
      // Find words to remove
      const words = text.split(" ");
      let currentIndex = 0;
      words.forEach((word, i) => {
        if (word.length > 4 && Math.random() > 0.7) {
          changes.push({
            id: `del-${i}`,
            type: 'deletion',
            content: word + ' ',
            startIndex: currentIndex,
            endIndex: currentIndex + word.length + 1,
          });
        }
        currentIndex += word.length + 1;
      });
    }
    
    return changes;
  };

  const applyChanges = (originalText: string, changes: Change[]): string => {
    let result = originalText;
    // Apply changes in reverse order to maintain correct indices
    const sortedChanges = [...changes].sort((a, b) => b.startIndex - a.startIndex);
    
    for (const change of sortedChanges) {
      if (change.type === 'deletion') {
        result = result.slice(0, change.startIndex) + result.slice(change.endIndex);
      } else {
        result = result.slice(0, change.startIndex) + change.content + result.slice(change.startIndex);
      }
    }
    
    return result;
  };

  const handleSuggestionRequest = async (prompt: string) => {
    if (!content.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please paste some text before requesting suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // This is where we'll make the API call to the AI service
      // For now, we'll generate some example changes
      const changes = generateChanges(content, prompt);
      const modifiedText = applyChanges(content, changes);
      
      setModifications(prev => [...prev, {
        originalText: content,
        modifiedText,
        changes,
      }]);
      
      setSuggestions([prompt]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestion = (index: number, changes: Change[]) => {
    const newContent = applyChanges(content, changes);
    setContent(newContent);
    setSuggestions((prev) => prev.filter((_, i) => i !== index));
    setModifications([]);
    
    toast({
      title: "Changes accepted",
      description: "The modifications have been applied to your text.",
    });
  };

  const handleRejectSuggestion = (index: number) => {
    setSuggestions((prev) => prev.filter((_, i) => i !== index));
    setModifications([]);
    toast({
      description: "Changes rejected",
    });
  };

  return (
    <div className="min-h-screen bg-editor-bg flex">
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarExpanded ? "mr-80" : "mr-12"
        }`}
      >
        <Editor
          content={content}
          onContentChange={handleContentChange}
          suggestions={suggestions}
          isLoading={isLoading}
          onAcceptSuggestion={handleAcceptSuggestion}
          onRejectSuggestion={handleRejectSuggestion}
          modifications={modifications}
        />
      </main>
      <AISidebar
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        onSuggestionRequest={handleSuggestionRequest}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Index;
