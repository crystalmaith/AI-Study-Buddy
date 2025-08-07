import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Brain, 
  Upload, 
  BookOpen, 
  FileText, 
  BarChart3, 
  Clock,
  Star,
  TrendingUp,
  Zap
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  });

  const quickStats = [
    { label: "Documents Uploaded", value: "12", icon: Upload },
    { label: "AI Conversations", value: "34", icon: Brain },
    { label: "Quizzes Completed", value: "8", icon: FileText },
    { label: "Study Hours", value: "45", icon: Clock },
  ];

  const recentActivity = [
    "Uploaded 'Biology Chapter 3.pdf'",
    "Completed quiz on Cell Structure",
    "Chatted with DeepSeek Scholar about photosynthesis",
    "Generated quiz from Chemistry notes"
  ];

  return (
    <div className="min-h-screen notebook-paper">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="doodle-border p-6 bg-accent/10">
          <h1 className="text-4xl font-kalam font-bold text-primary mb-2">
            {greeting}, Scholar! 📚
          </h1>
          <p className="text-lg font-inter text-muted-foreground">
            Ready to supercharge your learning with AI-powered study tools?
          </p>
          
          {/* Decorative doodles */}
          <div className="flex justify-end mt-4">
            <span className="text-2xl animate-float">✨</span>
            <span className="text-2xl animate-wiggle ml-2">🎯</span>
            <span className="text-2xl animate-float ml-2" style={{ animationDelay: '0.5s' }}>🚀</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <DashboardCard
            key={stat.label}
            title={stat.value}
            description={stat.label}
            icon={stat.icon}
            variant="sticky"
          />
        ))}
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <DashboardCard
          title="Start Learning with AI"
          description="Chat with your personal AI tutors - each with unique teaching styles and expertise"
          icon={Brain}
          variant="notebook"
          onClick={() => navigate("/ai-tutors")}
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="sticky" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              DeepSeek Scholar
            </Button>
            <Button variant="pencil" size="sm">
              ✨ Gemini Guide
            </Button>
            <Button variant="outline" size="sm">
              🦙 Llama Tutor
            </Button>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Upload Study Materials"
          description="Drag and drop your PDFs, DOCX, and TXT files to create personalized learning experiences"
          icon={Upload}
          variant="doodle"
          onClick={() => navigate("/upload")}
        >
          <Button variant="notebook" size="lg" className="w-full">
            Upload Documents
          </Button>
        </DashboardCard>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Study Library"
          description="Access all your uploaded documents and generated study materials"
          icon={BookOpen}
          onClick={() => navigate("/library")}
        >
          <Button variant="ghost" size="sm" className="w-full">
            Browse Library
          </Button>
        </DashboardCard>

        <DashboardCard
          title="Generate Quiz"
          description="Create practice questions from your study materials"
          icon={FileText}
          onClick={() => navigate("/quiz")}
        >
          <Button variant="ghost" size="sm" className="w-full">
            Create Quiz
          </Button>
        </DashboardCard>

        <DashboardCard
          title="Track Progress"
          description="View your learning analytics and study insights"
          icon={BarChart3}
          onClick={() => navigate("/progress")}
        >
          <Button variant="ghost" size="sm" className="w-full">
            View Progress
          </Button>
        </DashboardCard>
      </div>

      {/* Recent Activity */}
      <DashboardCard
        title="Recent Activity"
        description="Your latest study sessions and achievements"
        icon={TrendingUp}
        variant="notebook"
      >
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-md">
              <Star className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-inter">{activity}</span>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default Index;
