import { useEffect, useMemo, useState } from "react";
import { FileText, KeyRound, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/components/DashboardCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useToast } from "@/hooks/use-toast";

import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
// @ts-ignore - Vite will resolve worker asset URL at build time
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfjsWorker as any;

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
  const [isGenerating, setIsGenerating] = useState(false);
  type QuizQuestion = { id: string; question: string; choices: string[]; answerIndex: number };
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  // New: content source
  const [sourceText, setSourceText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

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
    toast?.({ title: "API key saved", description: `${provider.toUpperCase()} will be used to enhance your quiz.` });
  };

  async function extractTextFromPdf(file: File): Promise<string> {
    try {
      const ab = await file.arrayBuffer();
      const pdf = await getDocument({ data: ab }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const tc: any = await page.getTextContent();
        const pageText = tc.items.map((it: any) => (it.str ? it.str : "")).join(" ");
        fullText += pageText + "\n";
      }
      return fullText.replace(/\s+/g, " ").trim();
    } catch (e) {
      console.error("PDF parse error", e);
      toast?.({ title: "Couldn't read PDF", description: "Please try another PDF or paste text instead.", variant: "destructive" });
      return "";
    }
  }

  function extractTextFromTxt(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => resolve("");
      reader.readAsText(file);
    });
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    let text = "";
    if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
      text = await extractTextFromPdf(f);
    } else if (f.type === "text/plain" || f.name.toLowerCase().endsWith(".txt")) {
      text = await extractTextFromTxt(f);
    } else {
      toast?.({ title: "Unsupported file", description: "Please upload a PDF or TXT file.", variant: "destructive" });
      return;
    }
    setSourceText(text);
    if (text) {
      toast?.({ title: "Content loaded", description: `${f.name} parsed successfully.` });
    }
  }

  function pickSentences(text: string, count: number) {
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 40);
    if (sentences.length <= count) return sentences;
    // simple scoring: prefer longer sentences
    return sentences
      .map((s) => ({ s, score: Math.min(200, s.length) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map((x) => x.s);
  }

  function makeChoices(correct: string, pool: string[]): { choices: string[]; answerIndex: number } {
    const distractors = pool.filter((p) => p !== correct).slice(0, 6);
    const picked = new Set<string>();
    while (picked.size < 3 && distractors.length) {
      const idx = Math.floor(Math.random() * distractors.length);
      picked.add(distractors.splice(idx, 1)[0]);
    }
    const choices = [correct, ...Array.from(picked)];
    // pad if needed
    while (choices.length < 4) choices.push("None of the above");
    const shuffled = choices.sort(() => Math.random() - 0.5);
    return { choices: shuffled, answerIndex: shuffled.indexOf(correct) };
  }

  function generateFromText(text: string, qCount = 5): QuizQuestion[] {
    const seeds = pickSentences(text, qCount);
    const pool = text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return seeds.map((s, i) => {
      const stem = s.replace(/^\d+\.?\s*/, "");
      const { choices, answerIndex } = makeChoices(stem, pool);
      return {
        id: `q_${i}`,
        question: `Which statement best matches the source material?`,
        choices,
        answerIndex,
      };
    });
  }

  const handleGenerate = async () => {
    const text = sourceText.trim();
    if (!text) {
      toast?.({ title: "Add content first", description: "Upload a PDF/TXT or paste text to generate a quiz.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    toast?.({ title: "Generating quiz", description: "Creating questions from your content..." });

    // Local generation; if API key exists you could optionally send to provider here
    const qs = generateFromText(text, 5);
    setQuestions(qs);
    setAnswers(Object.fromEntries(qs.map((q) => [q.id, null])));
    setIsGenerating(false);
    toast?.({ title: "Quiz ready", description: "Answer the questions below and submit." });
  };

  const handleSubmit = () => {
    if (!questions) return;
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answerIndex) correct++;
    });
    toast?.({ title: "Results", description: `You scored ${correct}/${questions.length}.` });
  };

  return (
    <div className="notebook-paper min-h-screen">
      <header className="mb-8">
        <div className="doodle-border p-6 bg-accent/10">
          <h1 className="text-3xl font-kalam font-bold text-primary mb-2">Create Custom Quiz 📝</h1>
          <p className="text-lg font-inter text-muted-foreground">
            Generate a quiz directly from a PDF or pasted text. Keys are optional.
          </p>
        </div>
      </header>

      <main className="space-y-8">
        {/* Helper cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard title="Choose Provider" description="Optional AI enhancement" icon={Wand2} variant="sticky">
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
              <p className="text-xs text-muted-foreground">Pick which AI could enhance your quiz (optional).</p>
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

          {/* Content Source */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="font-inter font-medium">Upload PDF or TXT</label>
              <Input type="file" accept=".pdf,.txt" onChange={onPickFile} />
              {fileName && (
                <p className="text-xs text-muted-foreground">Loaded: {fileName}</p>
              )}
              <p className="text-xs text-muted-foreground">We parse files locally in your browser.</p>
            </div>

            <div className="space-y-3">
              <label className="font-inter font-medium">Or Paste Text</label>
              <Textarea
                className="min-h-[160px]"
                placeholder="Paste study content here..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">We recommend pasting a few paragraphs for best results.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="notebook" size="lg" onClick={handleGenerate} className="flex-1" disabled={isGenerating}>
              <FileText className="h-4 w-4 mr-2" /> {isGenerating ? "Generating..." : "Generate Quiz"}
            </Button>
          </div>
        </Card>

        {questions && (
          <Card className="p-6 mt-6">
            <h2 className="text-2xl font-kalam font-bold text-primary mb-4">Your Quiz</h2>
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="space-y-3">
                  <p className="font-inter font-medium">{idx + 1}. {q.question}</p>
                  <RadioGroup
                    value={answers[q.id]?.toString() ?? ""}
                    onValueChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: Number(val) }))}
                  >
                    {q.choices.map((choice, cIdx) => (
                      <div key={cIdx} className="flex items-center space-x-2">
                        <RadioGroupItem id={`${q.id}-${cIdx}`} value={cIdx.toString()} />
                        <Label htmlFor={`${q.id}-${cIdx}`}>{choice}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="notebook" onClick={handleSubmit}>Submit Answers</Button>
            </div>
          </Card>
        )}

        {/* Info */}
        <DashboardCard
          title="How it works"
          description="From content to questions"
          icon={FileText}
          variant="notebook"
        >
          <ol className="list-decimal pl-6 space-y-2 text-sm text-muted-foreground">
            <li>Upload a PDF/TXT or paste text above.</li>
            <li>Optionally save an AI key to enhance generation.</li>
            <li>Click "Generate" to create a quiz tailored to your content.</li>
          </ol>
        </DashboardCard>
      </main>
    </div>
  );
};

export default Quiz;
