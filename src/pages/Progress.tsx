import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Brain,
  BookOpen,
  Award,
  Calendar
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/components/DashboardCard";

const Progress = () => {
  const studyStats = [
    {
      label: "Total Study Time",
      value: "45.5 hours",
      change: "+8.2 hours this week",
      icon: Clock,
      trend: "up"
    },
    {
      label: "Documents Processed",
      value: "12",
      change: "+3 this week",
      icon: BookOpen,
      trend: "up"
    },
    {
      label: "AI Conversations",
      value: "34",
      change: "+12 this week",
      icon: Brain,
      trend: "up"
    },
    {
      label: "Quiz Average",
      value: "85%",
      change: "+5% improvement",
      icon: Target,
      trend: "up"
    }
  ];

  const weeklyProgress = [
    { day: "Mon", studyTime: 6.5, quizzes: 2, accuracy: 85 },
    { day: "Tue", studyTime: 4.2, quizzes: 1, accuracy: 78 },
    { day: "Wed", studyTime: 7.8, quizzes: 3, accuracy: 92 },
    { day: "Thu", studyTime: 5.1, quizzes: 2, accuracy: 88 },
    { day: "Fri", studyTime: 8.3, quizzes: 4, accuracy: 95 },
    { day: "Sat", studyTime: 3.2, quizzes: 1, accuracy: 82 },
    { day: "Sun", studyTime: 6.7, quizzes: 2, accuracy: 90 }
  ];

  const subjects = [
    { name: "Biology", progress: 85, color: "bg-green-500" },
    { name: "Chemistry", progress: 72, color: "bg-blue-500" },
    { name: "Physics", progress: 68, color: "bg-purple-500" },
    { name: "History", progress: 91, color: "bg-orange-500" }
  ];

  const achievements = [
    {
      title: "First Quiz Master",
      description: "Complete your first quiz with 90%+ score",
      earned: true,
      date: "Jan 15, 2024"
    },
    {
      title: "Study Streak",
      description: "Study for 7 consecutive days",
      earned: true,
      date: "Jan 18, 2024"
    },
    {
      title: "Document Explorer",
      description: "Upload 10 study documents",
      earned: true,
      date: "Jan 20, 2024"
    },
    {
      title: "AI Conversationalist",
      description: "Have 50 conversations with AI tutors",
      earned: false,
      date: null
    }
  ];

  const maxStudyTime = Math.max(...weeklyProgress.map(d => d.studyTime));

  return (
    <div className="notebook-paper min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="doodle-border p-6 bg-accent/10">
          <h1 className="text-3xl font-kalam font-bold text-primary mb-2">
            Learning Progress 📊
          </h1>
          <p className="text-lg font-inter text-muted-foreground">
            Track your study habits, quiz performance, and learning achievements
          </p>
        </div>
      </div>

      {/* Study Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {studyStats.map((stat, index) => (
          <DashboardCard
            key={stat.label}
            title={stat.value}
            description={stat.label}
            icon={stat.icon}
            variant="sticky"
          >
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                {stat.change}
              </span>
            </div>
          </DashboardCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Study Chart */}
        <Card className="p-6 torn-edge bg-card/50">
          <h3 className="font-kalam text-xl font-bold text-primary mb-6">
            Weekly Study Activity 📈
          </h3>
          
          <div className="space-y-4">
            {weeklyProgress.map((day, index) => (
              <div key={day.day} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-muted-foreground">
                  {day.day}
                </div>
                
                {/* Study Time Bar */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Study Time</span>
                    <span className="text-xs font-medium">{day.studyTime}h</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(day.studyTime / maxStudyTime) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Quiz Performance */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {day.quizzes} quiz{day.quizzes !== 1 ? 'es' : ''}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${day.accuracy >= 90 ? 'bg-green-100 text-green-800' : 
                      day.accuracy >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {day.accuracy}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Subject Progress */}
        <Card className="p-6 doodle-border bg-card/50">
          <h3 className="font-kalam text-xl font-bold text-primary mb-6">
            Subject Mastery 📚
          </h3>
          
          <div className="space-y-6">
            {subjects.map((subject, index) => (
              <div key={subject.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-inter font-medium">{subject.name}</span>
                  <span className="text-sm font-bold">{subject.progress}%</span>
                </div>
                <ProgressBar value={subject.progress} className="h-3" />
                
                {/* Subject insights */}
                <div className="mt-2 text-xs text-muted-foreground">
                  {subject.progress >= 90 && "🏆 Excellent mastery!"}
                  {subject.progress >= 75 && subject.progress < 90 && "📈 Good progress"}
                  {subject.progress >= 60 && subject.progress < 75 && "📖 Keep studying"}
                  {subject.progress < 60 && "💪 Needs more focus"}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="p-6 notebook-paper doodle-border">
        <h3 className="font-kalam text-xl font-bold text-primary mb-6">
          Achievements 🏆
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div 
              key={achievement.title}
              className={`
                p-4 rounded-doodle border-2 transition-all duration-300
                ${achievement.earned 
                  ? "bg-accent/20 border-accent shadow-sticky" 
                  : "bg-muted/10 border-dashed border-muted-foreground/30"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  p-2 rounded-full 
                  ${achievement.earned ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}
                `}>
                  <Award className="h-4 w-4" />
                </div>
                
                <div className="flex-1">
                  <h4 className={`
                    font-inter font-bold mb-1
                    ${achievement.earned ? "text-foreground" : "text-muted-foreground"}
                  `}>
                    {achievement.title}
                  </h4>
                  <p className={`
                    text-sm mb-2
                    ${achievement.earned ? "text-muted-foreground" : "text-muted-foreground/70"}
                  `}>
                    {achievement.description}
                  </p>
                  
                  {achievement.earned && achievement.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Earned {achievement.date}
                      </span>
                    </div>
                  )}
                  
                  {!achievement.earned && (
                    <Badge variant="outline" className="text-xs">
                      In Progress
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Study Goals */}
      <DashboardCard
        title="This Week's Goals"
        description="Stay motivated with your learning targets"
        icon={Target}
        variant="doodle"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-inter">Study 40 hours</span>
            <span className="text-sm font-bold">32/40 hours</span>
          </div>
          <ProgressBar value={80} className="h-2" />
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-inter">Complete 10 quizzes</span>
            <span className="text-sm font-bold">7/10 quizzes</span>
          </div>
          <ProgressBar value={70} className="h-2" />
        </div>
      </DashboardCard>
    </div>
  );
};

export default Progress;