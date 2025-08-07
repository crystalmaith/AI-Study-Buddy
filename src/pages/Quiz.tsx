import { useState } from "react";
import { 
  FileText, 
  Play, 
  Clock, 
  Target,
  BookOpen,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DashboardCard } from "@/components/DashboardCard";

interface Question {
  id: string;
  type: "multiple_choice" | "short_answer";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

interface QuizTemplate {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  estimatedTime: number;
  difficulty: "easy" | "medium" | "hard";
  topics: string[];
  source: string;
}

const Quiz = () => {
  const [currentView, setCurrentView] = useState<"templates" | "quiz" | "results">("templates");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const quizTemplates: QuizTemplate[] = [
    {
      id: "1",
      title: "Cell Biology Fundamentals",
      description: "Test your knowledge of cell structure, organelles, and basic cellular processes",
      questionCount: 10,
      estimatedTime: 15,
      difficulty: "medium",
      topics: ["cell structure", "organelles", "membrane transport"],
      source: "Biology Chapter 3.pdf"
    },
    {
      id: "2", 
      title: "Organic Chemistry Basics",
      description: "Practice questions on functional groups, nomenclature, and basic reactions",
      questionCount: 8,
      estimatedTime: 12,
      difficulty: "easy",
      topics: ["functional groups", "nomenclature", "reactions"],
      source: "Chemistry Notes - Organic Compounds.docx"
    },
    {
      id: "3",
      title: "Physics Formulas Application",
      description: "Apply physics formulas to solve problems in mechanics and thermodynamics",
      questionCount: 12,
      estimatedTime: 20,
      difficulty: "hard",
      topics: ["mechanics", "thermodynamics", "formulas"],
      source: "Physics Formulas Reference.txt"
    }
  ];

  const sampleQuestions: Question[] = [
    {
      id: "1",
      type: "multiple_choice",
      question: "Which organelle is responsible for protein synthesis in eukaryotic cells?",
      options: ["Mitochondria", "Ribosomes", "Golgi apparatus", "Nucleus"],
      correctAnswer: "Ribosomes",
      explanation: "Ribosomes are the cellular structures responsible for protein synthesis, translating mRNA into proteins.",
      difficulty: "medium",
      topic: "cell structure"
    },
    {
      id: "2",
      type: "multiple_choice",
      question: "What is the primary function of the cell membrane?",
      options: [
        "Energy production",
        "DNA storage", 
        "Selective permeability",
        "Protein synthesis"
      ],
      correctAnswer: "Selective permeability",
      explanation: "The cell membrane controls what enters and exits the cell, maintaining selective permeability.",
      difficulty: "easy",
      topic: "membrane transport"
    }
  ];

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const selectedTemplate = quizTemplates.find(t => t.id === selectedTemplateId);

  const startQuiz = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setCurrentView("quiz");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    sampleQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: sampleQuestions.length, percentage: Math.round((correct / sampleQuestions.length) * 100) };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-50 border-green-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "hard": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (currentView === "quiz") {
    const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100;
    
    return (
      <div className="notebook-paper min-h-screen">
        {/* Quiz Header */}
        <div className="mb-6">
          <div className="doodle-border p-6 bg-accent/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-kalam font-bold text-primary mb-1">
                  Cell Biology Fundamentals 🧬
                </h1>
                <p className="text-muted-foreground font-inter">
                  Question {currentQuestionIndex + 1} of {sampleQuestions.length}
                </p>
              </div>
              <Button variant="outline" onClick={() => setCurrentView("templates")}>
                Exit Quiz
              </Button>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="p-4 mb-6 notebook-paper">
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1" />
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
        </Card>

        {/* Question */}
        <Card className="p-8 torn-edge bg-card/50">
          <div className="mb-6">
            <Badge className={`mb-4 ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
            </Badge>
            <h2 className="text-xl font-inter font-bold mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
            <RadioGroup
              value={selectedAnswers[currentQuestion.id] || ""}
              onValueChange={handleAnswerSelect}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-inter">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            <Button 
              variant="sticky"
              onClick={nextQuestion}
              disabled={!selectedAnswers[currentQuestion.id]}
            >
              {currentQuestionIndex === sampleQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    
    return (
      <div className="notebook-paper min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="mb-8">
            <div className="doodle-border p-6 bg-accent/10 text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-primary animate-float" />
              <h1 className="text-3xl font-kalam font-bold text-primary mb-2">
                Quiz Complete! 🎉
              </h1>
              <p className="text-xl font-inter text-foreground">
                You scored {score.correct} out of {score.total} ({score.percentage}%)
              </p>
            </div>
          </div>

          {/* Score Card */}
          <DashboardCard
            title={`${score.percentage}%`}
            description="Your Score"
            icon={Target}
            variant="sticky"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{score.correct}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{score.total - score.correct}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{score.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </DashboardCard>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button variant="sticky" onClick={() => startQuiz("1")} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button variant="outline" onClick={() => setCurrentView("templates")} className="flex-1">
              Choose New Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notebook-paper min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="doodle-border p-6 bg-accent/10">
          <h1 className="text-3xl font-kalam font-bold text-primary mb-2">
            Quiz Generator 📝
          </h1>
          <p className="text-lg font-inter text-muted-foreground">
            Test your knowledge with AI-generated quizzes from your study materials
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="3"
          description="Available Quizzes"
          icon={FileText}
          variant="sticky"
        />
        <DashboardCard
          title="8"
          description="Quizzes Completed"
          icon={CheckCircle}
          variant="sticky"
        />
        <DashboardCard
          title="85%"
          description="Average Score"
          icon={Target}
          variant="sticky"
        />
      </div>

      {/* Quiz Templates */}
      <div className="space-y-6">
        <h2 className="text-xl font-kalam font-bold text-primary">Available Quizzes</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quizTemplates.map((template) => (
            <Card key={template.id} className="p-6 torn-edge bg-card/50 hover:bg-card/80 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-inter font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                    {template.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 font-inter">
                    {template.description}
                  </p>
                </div>
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              </div>

              {/* Quiz Info */}
              <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{template.questionCount} questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>~{template.estimatedTime} min</span>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1 mb-4">
                {template.topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>

              {/* Source */}
              <div className="flex items-center gap-2 mb-4 p-2 bg-muted/20 rounded-md">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-inter">
                  Generated from: {template.source}
                </span>
              </div>

              {/* Action */}
              <Button 
                variant="sticky" 
                className="w-full"
                onClick={() => startQuiz(template.id)}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Quiz
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Custom Quiz */}
      <DashboardCard
        title="Create Custom Quiz"
        description="Generate a new quiz from your uploaded documents"
        icon={FileText}
        variant="doodle"
      >
        <Button variant="notebook" size="lg">
          <FileText className="h-4 w-4 mr-2" />
          Generate New Quiz
        </Button>
      </DashboardCard>
    </div>
  );
};

export default Quiz;