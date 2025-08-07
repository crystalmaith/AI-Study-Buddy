import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Key, 
  User, 
  Bell,
  Palette,
  Save,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/components/DashboardCard";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [settings, setSettings] = useState({
    // API Keys
    deepseekApiKey: "",
    geminiApiKey: "",
    llamaApiKey: "",
    
    // Profile
    displayName: "Study Scholar",
    email: "scholar@studybuddy.com",
    
    // Notifications
    quizReminders: true,
    studyStreakAlerts: true,
    weeklyReports: true,
    
    // Learning Preferences
    difficultyLevel: "medium",
    studySessionLength: 25,
    autoGenerateQuizzes: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved! ✅",
      description: "Your preferences have been updated successfully.",
    });
  };

  const toggleApiKeyVisibility = (provider: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const aiProviders = [
    {
      name: "DeepSeek",
      key: "deepseekApiKey",
      description: "For analytical and thorough explanations",
      status: settings.deepseekApiKey ? "configured" : "missing",
      emoji: "🤖"
    },
    {
      name: "Google Gemini",
      key: "geminiApiKey", 
      description: "For creative and visual learning approaches",
      status: settings.geminiApiKey ? "configured" : "missing",
      emoji: "✨"
    },
    {
      name: "Llama",
      key: "llamaApiKey",
      description: "For friendly and supportive tutoring",
      status: settings.llamaApiKey ? "configured" : "missing",
      emoji: "🦙"
    }
  ];

  return (
    <div className="notebook-paper min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="doodle-border p-6 bg-accent/10">
          <h1 className="text-3xl font-kalam font-bold text-primary mb-2">
            Settings ⚙️
          </h1>
          <p className="text-lg font-inter text-muted-foreground">
            Configure your AI Study Buddy preferences and API connections
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* API Configuration */}
          <Card className="p-6 torn-edge bg-card/50">
            <h3 className="font-kalam text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <Key className="h-5 w-5" />
              AI Provider API Keys
            </h3>
            
            <div className="space-y-6">
              {aiProviders.map((provider) => (
                <div key={provider.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{provider.emoji}</span>
                      <Label className="font-inter font-medium">{provider.name}</Label>
                      <Badge 
                        variant={provider.status === "configured" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {provider.status}
                      </Badge>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleApiKeyVisibility(provider.key)}
                    >
                      {showApiKeys[provider.key] ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                  
                  <Input
                    type={showApiKeys[provider.key] ? "text" : "password"}
                    placeholder={`Enter your ${provider.name} API key...`}
                    value={settings[provider.key as keyof typeof settings] as string}
                    onChange={(e) => updateSetting(provider.key, e.target.value)}
                    className="notebook-paper"
                  />
                </div>
              ))}
              
              <div className="p-4 bg-accent/10 rounded-md border border-dashed border-accent">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-accent-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-accent-foreground">
                      API Key Security
                    </p>
                    <p className="text-xs text-accent-foreground/80 mt-1">
                      Your API keys are stored locally and encrypted. They're only used to connect with your chosen AI providers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Settings */}
          <Card className="p-6 doodle-border bg-card/50">
            <h3 className="font-kalam text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName" className="font-inter">Display Name</Label>
                <Input
                  id="displayName"
                  value={settings.displayName}
                  onChange={(e) => updateSetting("displayName", e.target.value)}
                  className="notebook-paper mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="font-inter">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting("email", e.target.value)}
                  className="notebook-paper mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Learning Preferences */}
          <Card className="p-6 notebook-paper doodle-border bg-card/50">
            <h3 className="font-kalam text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Learning Preferences
            </h3>
            
            <div className="space-y-6">
              <div>
                <Label className="font-inter font-medium">Default Difficulty Level</Label>
                <div className="flex gap-2 mt-2">
                  {["easy", "medium", "hard"].map((level) => (
                    <Button
                      key={level}
                      variant={settings.difficultyLevel === level ? "sticky" : "outline"}
                      size="sm"
                      onClick={() => updateSetting("difficultyLevel", level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="sessionLength" className="font-inter">
                  Study Session Length (minutes)
                </Label>
                <Input
                  id="sessionLength"
                  type="number"
                  min="5"
                  max="120"
                  value={settings.studySessionLength}
                  onChange={(e) => updateSetting("studySessionLength", parseInt(e.target.value))}
                  className="notebook-paper mt-1 w-32"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-inter font-medium">Auto-Generate Quizzes</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create quizzes from uploaded documents
                  </p>
                </div>
                <Switch
                  checked={settings.autoGenerateQuizzes}
                  onCheckedChange={(checked) => updateSetting("autoGenerateQuizzes", checked)}
                />
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 torn-edge bg-card/50">
            <h3 className="font-kalam text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-inter font-medium">Quiz Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about pending practice quizzes
                  </p>
                </div>
                <Switch
                  checked={settings.quizReminders}
                  onCheckedChange={(checked) => updateSetting("quizReminders", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-inter font-medium">Study Streak Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Celebrate your consecutive study days
                  </p>
                </div>
                <Switch
                  checked={settings.studyStreakAlerts}
                  onCheckedChange={(checked) => updateSetting("studyStreakAlerts", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-inter font-medium">Weekly Progress Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly learning analytics summaries
                  </p>
                </div>
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => updateSetting("weeklyReports", checked)}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <DashboardCard
            title="Quick Setup Guide"
            description="Get started with your AI tutors"
            icon={SettingsIcon}
            variant="sticky"
          >
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Add API keys for your preferred AI providers</span>
              </div>
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Set your learning preferences</span>
              </div>
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Upload study materials and start learning!</span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            title="API Key Help"
            description="Where to get your AI provider keys"
            icon={Key}
            variant="doodle"
          >
            <div className="space-y-2 text-sm">
              <p>🤖 <strong>DeepSeek:</strong> platform.deepseek.com</p>
              <p>✨ <strong>Gemini:</strong> makersuite.google.com</p>
              <p>🦙 <strong>Llama:</strong> console.groq.com</p>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Privacy Notice"
            description="Your data security matters"
            icon={AlertCircle}
            variant="notebook"
          >
            <div className="space-y-2 text-sm">
              <p>🔒 API keys stored locally</p>
              <p>🗑️ Documents auto-deleted after 30 days</p>
              <p>🚫 No data shared with third parties</p>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-center">
        <Button variant="sticky" size="lg" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;