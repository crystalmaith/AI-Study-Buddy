import { useEffect, useMemo, useState } from "react";
import { FileText, KeyRound, Upload as UploadIcon, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/components/DashboardCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Quiz = () => {
  // SEO: title
  useEffect(() => {
    document.title = "Create Custom Quiz | StudyBuddy";
  }, []);

  const { keys, setApiKey } = useApiKeys();
  const { toast } = useToast();

  type Provider = "deepseek" | "gemini" | "llama";
  const [provider, setProvider] = useState<Provider>("deepseek");
  const keyByProvider = useMemo(
    () => ({ deepseek: "deepseekApiKey", gemini: "geminiApiKey", llama: "llamaApiKey" } as const),
    []
  );

  const currentKeyName = keyByProvider[provider];
  const [tempKey, setTempKey] = useState("");

  useEffect(() => {
    // preload existing key when provider changes
    setTempKey((keys as any)[currentKeyName] ?? "");
  }, [provider, currentKeyName, keys]);

  const handleSaveKey = () => {
    if (!tempKey.trim()) {
      toast?.({ title: "API key required", description: "Please paste a valid API key.", variant: "destructive" });
      return;
    }
    setApiKey(currentKeyName as any, tempKey.trim());
    toast?.({ title: "API key saved", description: `${provider.toUpperCase()} will be used to generate your quiz.` });
  };

  const handleGenerate = () => {
    // Since uploads live on the Upload page state, guide users to upload first.
    if (!tempKey.trim()) {
      toast?.({ title: "Missing API key", description: "Save your API key first to continue.", variant: "destructive" });
      return;
    }
    toast?.({
      title: "Generating quiz",
      description: "We will generate a quiz from your uploaded documents.",
    });
    // TODO: Wire actual generation using uploaded docs and chosen provider
  };

  return (
    <div className="notebook-paper min-h-screen">
      <header className="mb-8">
        <div className="doodle-border p-6 bg-accent/10">
          <h1 className="text-3xl font-kalam font-bold text-primary mb-2">Create Custom Quiz 📝</h1>
          <p className="text-lg font-inter text-muted-foreground">
            Generate an AI-powered quiz from your uploaded study materials.
          </p>
        </div>
      </header>

      <main className="space-y-8">
        {/* Helper cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Upload Files" description="Add PDFs, DOCX, or TXT" icon={UploadIcon} variant="sticky">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">No files uploaded yet?</span>
              <Button asChild variant="outline" size="sm">
                <Link to="/upload">Go to Uploads</Link>
              </Button>
            </div>
          </DashboardCard>

          <DashboardCard title="Choose Provider" description="Select your AI" icon={Wand2} variant="sticky">
            <Badge variant="secondary">DeepSeek / Gemini / Llama</Badge>
          </DashboardCard>

          <DashboardCard title="Privacy" description="Keys stored locally" icon={KeyRound} variant="doodle">
            <p className="text-sm text-muted-foreground">API keys are saved in your browser only.</p>
          </DashboardCard>
        </div>

        {/* Create Custom Quiz form */}
        <Card className="p-6 torn-edge bg-card/50">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="font-inter font-medium">AI Provider</label>
              <Select value={provider} onValueChange={(v) => setProvider(v as Provider)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deepseek">DeepSeek</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="llama">Llama</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Pick which AI will generate your quiz.</p>
            </div>

            <div className="space-y-3">
              <label className="font-inter font-medium">{provider.toUpperCase()} API Key</label>
              <div className="flex gap-2">
                <Input
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder={`Paste your ${provider.toUpperCase()} API key`}
                  type="password"
                />
                <Button variant="sticky" onClick={handleSaveKey}>Save</Button>
              </div>
              <p className="text-xs text-muted-foreground">Your key stays in this browser. You can change it anytime.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="notebook" size="lg" onClick={handleGenerate} className="flex-1">
              <FileText className="h-4 w-4 mr-2" /> Generate Quiz from Uploaded Documents
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1">
              <Link to="/upload">
                <UploadIcon className="h-4 w-4 mr-2" /> Upload More Documents
              </Link>
            </Button>
          </div>
        </Card>

        {/* Info */}
        <DashboardCard
          title="How it works"
          description="From docs to questions"
          icon={FileText}
          variant="notebook"
        >
          <ol className="list-decimal pl-6 space-y-2 text-sm text-muted-foreground">
            <li>Upload your study files on the Upload page.</li>
            <li>Select an AI provider and save your API key here.</li>
            <li>Click "Generate" to create a quiz tailored to your materials.</li>
          </ol>
        </DashboardCard>
      </main>
    </div>
  );
};

export default Quiz;
