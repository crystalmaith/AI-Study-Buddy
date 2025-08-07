import { useState } from "react";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download,
  Eye,
  Star,
  Clock,
  FileText,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/components/DashboardCard";

interface StudyDocument {
  id: string;
  name: string;
  type: "pdf" | "docx" | "txt";
  size: string;
  uploadDate: Date;
  lastAccessed: Date;
  isStarred: boolean;
  summary: string;
  tags: string[];
  aiProcessed: boolean;
}

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "pdf" | "docx" | "txt">("all");

  const documents: StudyDocument[] = [
    {
      id: "1",
      name: "Biology Chapter 3 - Cell Structure.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: new Date("2024-01-15"),
      lastAccessed: new Date("2024-01-20"),
      isStarred: true,
      summary: "Comprehensive guide to cell organelles, membrane structure, and cellular processes",
      tags: ["biology", "cells", "organelles"],
      aiProcessed: true
    },
    {
      id: "2", 
      name: "Chemistry Notes - Organic Compounds.docx",
      type: "docx",
      size: "1.8 MB",
      uploadDate: new Date("2024-01-12"),
      lastAccessed: new Date("2024-01-18"),
      isStarred: false,
      summary: "Study notes on functional groups, reaction mechanisms, and organic synthesis",
      tags: ["chemistry", "organic", "reactions"],
      aiProcessed: true
    },
    {
      id: "3",
      name: "Physics Formulas Reference.txt",
      type: "txt",
      size: "45 KB",
      uploadDate: new Date("2024-01-10"),
      lastAccessed: new Date("2024-01-16"),
      isStarred: true,
      summary: "Complete collection of physics formulas for mechanics, thermodynamics, and electromagnetism",
      tags: ["physics", "formulas", "reference"],
      aiProcessed: false
    },
    {
      id: "4",
      name: "History Timeline - World War II.pdf",
      type: "pdf", 
      size: "3.2 MB",
      uploadDate: new Date("2024-01-08"),
      lastAccessed: new Date("2024-01-14"),
      isStarred: false,
      summary: "Detailed timeline of major events, battles, and political developments during WWII",
      tags: ["history", "wwii", "timeline"],
      aiProcessed: true
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return "📄";
      case "docx": return "📝";
      case "txt": return "📋";
      default: return "📄";
    }
  };

  const toggleStar = (id: string) => {
    // In a real app, this would update the backend
    console.log("Toggle star for document:", id);
  };

  return (
    <div className="notebook-paper min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="doodle-border p-6 bg-accent/10">
          <h1 className="text-3xl font-kalam font-bold text-primary mb-2">
            Study Library 📚
          </h1>
          <p className="text-lg font-inter text-muted-foreground">
            Access and manage all your uploaded study materials and AI-generated content
          </p>
        </div>
      </div>

      {/* Stats and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <DashboardCard
            title={documents.length.toString()}
            description="Total Documents"
            icon={BookOpen}
            variant="sticky"
          />
        </div>
        
        <div className="lg:col-span-3">
          <Card className="p-4 notebook-paper doodle-border">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents, content, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 notebook-paper"
                />
              </div>
              
              {/* Filter */}
              <div className="flex gap-2">
                {["all", "pdf", "docx", "txt"].map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? "sticky" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(type as typeof filterType)}
                  >
                    {type.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="p-6 bg-card/50 hover:bg-card/80 transition-all duration-300 group torn-edge">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getFileIcon(doc.type)}</span>
                <div className="flex-1">
                  <h3 className="font-inter font-bold text-foreground group-hover:text-primary transition-colors">
                    {doc.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {doc.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{doc.size}</span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleStar(doc.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Star className={`h-4 w-4 ${doc.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 font-inter">
              {doc.summary}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {doc.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* AI Processing Status */}
            {doc.aiProcessed && (
              <div className="flex items-center gap-1 mb-4">
                <span className="text-green-500">✨</span>
                <span className="text-xs text-green-600 font-medium">AI Processed</span>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Uploaded {doc.uploadDate.toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="pencil" size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <DashboardCard
          title="No documents found"
          description="Try adjusting your search terms or upload some study materials"
          icon={BookOpen}
          variant="doodle"
        >
          <Button variant="sticky" onClick={() => setSearchTerm("")}>
            Clear Search
          </Button>
        </DashboardCard>
      )}
    </div>
  );
};

export default Library;