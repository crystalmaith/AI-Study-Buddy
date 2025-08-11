import { useState } from "react";
import { 
  Brain, 
  Send, 
  Sparkles, 
  Zap, 
  Heart,
  BookOpen,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/components/DashboardCard";
import { useApiKeys } from "@/hooks/useApiKeys";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const AiTutors = () => {
  const [activeAI, setActiveAI] = useState<"deepseek" | "gemini" | "llama">("deepseek");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI tutor. Upload a document or ask me anything about your studies!",
      sender: "ai",
      timestamp: new Date(),
    }
  ]);

  const { keys } = useApiKeys();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const keyByAI = { deepseek: 'deepseekApiKey', gemini: 'geminiApiKey', llama: 'llamaApiKey' } as const;
  const requiredKey = keyByAI[activeAI];
  const hasKey = Boolean(keys[requiredKey]);

  const aiPersonalities = {
    deepseek: {
      name: "DeepSeek Scholar",
      icon: Brain,
      emoji: "🤖",
      personality: "Analytical & Thorough",
      description: "Methodical approach with deep explanations and step-by-step reasoning",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    gemini: {
      name: "Gemini Guide", 
      icon: Sparkles,
      emoji: "✨",
      personality: "Creative & Intuitive",
      description: "Visual learner-focused with creative analogies and multimedia thinking",
      color: "text-purple-600",
      bgColor: "bg-purple-50", 
      borderColor: "border-purple-200"
    },
    llama: {
      name: "Llama Tutor",
      icon: Heart,
      emoji: "🦙", 
      personality: "Friendly & Supportive",
      description: "Encouraging and patient with a focus on building confidence",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    }
  };

  const currentAI = aiPersonalities[activeAI];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setMessage("");

    // DeepSeek live response when key is present
    if (activeAI === "deepseek" && hasKey && keys.deepseekApiKey) {
      try {
        setIsLoading(true);
        const systemPrompt =
          "You are DeepSeek Scholar, an analytical and thorough AI tutor. Provide step-by-step, clear explanations and cite formulas when helpful. Keep responses concise and focused on learning outcomes.";

        const history = [...messages, newUserMessage].map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.content,
        }));

        const response = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${keys.deepseekApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ role: "system", content: systemPrompt }, ...history],
            temperature: 0.3,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`DeepSeek error ${response.status}: ${errText}`);
        }

        const data: any = await response.json();
        const content =
          data?.choices?.[0]?.message?.content ??
          "Sorry, I couldn't generate a response.";

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      } catch (err: any) {
        console.error("DeepSeek call failed:", err);
        toast?.({
          title: "DeepSeek error",
          description:
            err?.message ?? "Unable to get a response. Please check your API key.",
          variant: "destructive",
        });
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            content:
              "I ran into an issue reaching the AI service. Please verify your DeepSeek API key and try again.",
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Fallback: simulated response for other AIs (until wired)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `As ${currentAI.name}, I'd be happy to help you with that! This would be where I provide a detailed response based on my ${currentAI.personality.toLowerCase()} approach.`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="notebook-paper min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="doodle-border p-6 bg-accent/10">
          <h1 className="text-3xl font-kalam font-bold text-primary mb-2">
            AI Study Tutors 🤖
          </h1>
          <p className="text-lg font-inter text-muted-foreground">
            Choose your AI tutor and start learning! Each has a unique teaching style.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* AI Selection Panel */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-kalam text-xl font-bold text-primary mb-4">Choose Your Tutor</h2>
          
          {Object.entries(aiPersonalities).map(([key, ai]) => {
            const isActive = activeAI === key;
            return (
              <Card
                key={key}
                className={`
                  p-4 cursor-pointer transition-all duration-300 
                  ${isActive ? "sticky-note bg-accent" : "bg-card hover:bg-muted/50"}
                  ${isActive ? "shadow-sticky" : "shadow-notebook hover:shadow-xl"}
                  ${isActive ? "rotate-0" : "hover:rotate-1"}
                `}
                onClick={() => setActiveAI(key as typeof activeAI)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{ai.emoji}</span>
                  <div>
                    <h3 className={`font-kalam font-bold ${isActive ? "text-accent-foreground" : "text-foreground"}`}>
                      {ai.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {ai.personality}
                    </Badge>
                  </div>
                </div>
                <p className={`text-sm ${isActive ? "text-accent-foreground/80" : "text-muted-foreground"}`}>
                  {ai.description}
                </p>
              </Card>
            );
          })}

          {/* Quick Actions */}
          <DashboardCard
            title="Quick Start"
            description="Jump into a quick quiz or ask a question"
            icon={BookOpen}
            variant="doodle"
          >
            <Button asChild variant="pencil" size="sm" className="w-full">
              <Link to="/quiz">Open Quiz Generator</Link>
            </Button>
          </DashboardCard>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Chat Header */}
          <div className="doodle-border p-4 bg-card mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentAI.emoji}</span>
              <div>
                <h2 className="font-kalam text-xl font-bold text-primary">
                  {currentAI.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {currentAI.description}
                </p>
              </div>
            </div>
          </div>

          {!hasKey && (
            <div className="mb-4 p-4 bg-accent/10 rounded-md border border-dashed border-accent">
              <p className="text-sm font-inter text-accent-foreground">
                Missing API key for {currentAI.name}. Please add it in Settings to enable real responses.
              </p>
              <div className="mt-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/settings">Open Settings</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 bg-card/50 rounded-doodle p-4 mb-4 overflow-y-auto border-2 border-border">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      max-w-[80%] p-3 rounded-2xl
                      ${msg.sender === "user" 
                        ? "bg-primary text-primary-foreground ml-4" 
                        : "chat-bubble mr-4"
                      }
                    `}
                  >
                    {msg.sender === "ai" && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{currentAI.emoji}</span>
                        <span className="font-kalam font-medium text-sm">
                          {currentAI.name}
                        </span>
                      </div>
                    )}
                    <p className="text-sm font-inter">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="flex gap-3">
            <Textarea
              placeholder={`Ask ${currentAI.name} anything about your studies...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 min-h-[60px] resize-none notebook-paper border-2 border-dashed border-primary/30"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              variant="sticky"
              size="lg"
              className="self-end"
              disabled={!message.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Helpful Tips */}
          <div className="mt-4 p-3 bg-accent/10 rounded-md border border-dashed border-accent">
            <p className="text-sm font-kalam text-muted-foreground">
              💡 <strong>Tip:</strong> Try asking about specific topics, upload study materials, 
              or request practice questions. Each AI has a unique teaching style!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiTutors;