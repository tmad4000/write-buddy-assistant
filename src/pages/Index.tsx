
import { useState } from "react";
import { Editor } from "@/components/Editor";
import { AISidebar } from "@/components/AISidebar";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { toast } = useToast();

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
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
    // Simulate AI response for now
    setTimeout(() => {
      const fakeSuggestions = [
        "Changed passive voice to active voice in paragraph 2.",
        "Removed redundant phrases to improve conciseness.",
        "Suggested clearer terminology for technical concepts.",
      ];
      setSuggestions(fakeSuggestions);
      setIsLoading(false);
    }, 1500);
  };

  const handleAcceptSuggestion = (index: number) => {
    setSuggestions((prev) => prev.filter((_, i) => i !== index));
    toast({
      title: "Suggestion accepted",
      description: "The change has been applied to your text.",
    });
  };

  const handleRejectSuggestion = (index: number) => {
    setSuggestions((prev) => prev.filter((_, i) => i !== index));
    toast({
      description: "Suggestion removed",
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
