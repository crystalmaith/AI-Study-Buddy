import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Upload as UploadIcon, 
  FileText, 
  File, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/components/DashboardCard";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "completed" | "error";
  progress: number;
}

const UPLOADS_STORAGE_KEY = "studybuddy:uploads";

type StoredUpload = { id: string; name: string; size: number; type: string };

function readStoredUploads(): StoredUpload[] {
  try {
    const raw = localStorage.getItem(UPLOADS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredUpload[]) : [];
  } catch {
    return [];
  }
}

function writeStoredUploads(list: StoredUpload[]) {
  try {
    localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // no-op
  }
}

function addStoredUpload(file: StoredUpload) {
  const list = readStoredUploads();
  if (!list.find((f) => f.id === file.id)) {
    writeStoredUploads([...list, file]);
  }
}

function removeStoredUpload(id: string) {
  const list = readStoredUploads();
  writeStoredUploads(list.filter((f) => f.id !== id));
}

const Upload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = f.progress + Math.random() * 20;
          if (newProgress >= 100) {
            clearInterval(interval);
            // Persist completed file to localStorage for Quiz page
            addStoredUpload({ id: f.id, name: f.name, size: f.size, type: f.type });
            return { ...f, progress: 100, status: "completed" };
          }
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 500);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    removeStoredUpload(id);
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('text')) return '📋';
    return '📄';
  };

  return (
    <div className="notebook-paper min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="doodle-border p-6 bg-accent/10">
          <h1 className="text-3xl font-kalam font-bold text-primary mb-2">
            Upload Study Materials 📤
          </h1>
          <p className="text-lg font-inter text-muted-foreground">
            Drop your PDFs, DOCX, and TXT files here to create personalized AI tutoring experiences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <Card
            {...getRootProps()}
            className={`
              p-12 text-center cursor-pointer transition-all duration-300
              ${isDragActive 
                ? "border-4 border-dashed border-primary bg-accent/20 scale-105" 
                : "border-4 border-dashed border-border hover:border-primary/50 hover:bg-muted/20"
              }
              torn-edge
            `}
          >
            <input {...getInputProps()} />
            
            <UploadIcon className={`
              h-16 w-16 mx-auto mb-6 sketch-icon
              ${isDragActive ? "text-primary animate-bounce" : "text-muted-foreground"}
            `} />
            
            <h3 className="text-2xl font-kalam font-bold mb-4">
              {isDragActive ? "Drop your files here! 🎯" : "Drag & drop your study materials"}
            </h3>
            
            <p className="text-muted-foreground mb-6 font-inter">
              or <span className="text-primary font-medium">click to browse</span> your files
            </p>
            
            <div className="flex justify-center gap-4 mb-6">
              <Badge variant="outline">📄 PDF</Badge>
              <Badge variant="outline">📝 DOCX</Badge>
              <Badge variant="outline">📋 TXT</Badge>
            </div>
            
            <Button variant="sticky" size="lg">
              Choose Files
            </Button>
          </Card>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-kalam font-bold text-primary mb-4">
                Uploaded Files ({files.length})
              </h3>
              
              <div className="space-y-4">
                {files.map((file) => (
                  <Card key={file.id} className="p-4 bg-card/50">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{getFileIcon(file.type)}</span>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-inter font-medium truncate max-w-md">
                            {file.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)}
                            </span>
                            {file.status === "completed" && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            {file.status === "error" && (
                              <AlertCircle className="h-5 w-5 text-destructive" />
                            )}
                            {file.status === "uploading" && (
                              <Loader2 className="h-5 w-5 text-primary animate-spin" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file.id)}
                              className="h-6 w-6"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {file.status === "uploading" && (
                          <Progress value={file.progress} className="h-2" />
                        )}
                        
                        {file.status === "completed" && (
                          <p className="text-sm text-green-600 font-medium">
                            ✅ Ready for AI tutoring!
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <DashboardCard
            title="File Requirements"
            description="Supported formats and guidelines"
            icon={FileText}
            variant="sticky"
          >
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span>📄</span>
                <span>PDF documents (max 10MB)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📝</span>
                <span>Word documents (.docx)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📋</span>
                <span>Plain text files (.txt)</span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            title="How It Works"
            description="Your AI tutoring process"
            icon={UploadIcon}
            variant="notebook"
          >
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Upload your study materials</span>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>AI processes and analyzes content</span>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Get personalized tutoring & quizzes</span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Privacy & Security"
            description="Your data is safe with us"
            icon={CheckCircle}
            variant="doodle"
          >
            <div className="space-y-2 text-sm">
              <p>🔒 End-to-end encryption</p>
              <p>🗑️ Auto-delete after 30 days</p>
              <p>🚫 No data sharing with third parties</p>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Upload;