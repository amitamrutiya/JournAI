'use client';

import { SignInButton, useAuth } from '@clerk/nextjs';
import { Brain, Loader2, LogIn, Save } from 'lucide-react';
import { useState } from 'react';

import { AIAnalysisCard } from '@/components/journal/ai-analysis-card';
import { JournalEditor } from '@/components/journal/journal-editor';
import { PDFUpload } from '@/components/journal/pdf-upload';
import SaveJournalButton from '@/components/journal/save-journal-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AIAnalysis {
  mood: string;
  summary: string;
  reason: string;
}

export default function WritePage() {
  const { isSignedIn } = useAuth();
  const [journalText, setJournalText] = useState('');
  const [analysis, setAnalysis] = useState<AIAnalysis | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAnalyzeWithAI = async () => {
    if (!journalText.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: journalText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze journal');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing journal:', error);
      // TODO: Add proper error handling/toast
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveJournal = async () => {
    if (!isSignedIn || !journalText.trim() || !analysis) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/save-journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: journalText,
          mood: analysis.mood,
          summary: analysis.summary,
          reason: analysis.reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save journal');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving journal:', error);
      // TODO: Add proper error handling/toast
    } finally {
      setIsSaving(false);
    }
  };

  const handlePDFUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/pdf-extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract PDF text');
      }

      const result = await response.json();
      setJournalText(result.text);
    } catch (error) {
      console.error('Error extracting PDF:', error);
      // TODO: Add proper error handling/toast
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Write Your Journal
          </h1>
          <p className="text-muted-foreground">
            Express your thoughts and let AI help you understand your emotions
          </p>
        </div>

        {/* PDF Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📁 Upload PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PDFUpload onUpload={handlePDFUpload} />
          </CardContent>
        </Card>

        {/* Journal Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Your Journal Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <JournalEditor
              content={journalText}
              onChange={setJournalText}
              placeholder="Write your journal entry here..."
            />

            {/* Analyze Button */}
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleAnalyzeWithAI}
                disabled={!journalText.trim() || isAnalyzing}
                className="w-full max-w-xs"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    💡 Analyze with AI
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Results */}
        {analysis && (
          <AIAnalysisCard
            mood={analysis.mood}
            summary={analysis.summary}
            reason={analysis.reason}
          />
        )}

        {/* Save Section */}
        {analysis && (
          <Card>
            <CardContent className="pt-6">
              {isSignedIn ? (
                <div className="space-y-4 text-center">
                  <SaveJournalButton
                    handleSaveJournal={handleSaveJournal}
                    isSaving={isSaving}
                    saveSuccess={saveSuccess}
                  />
                  {saveSuccess && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Your journal has been saved to your account.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <p className="text-muted-foreground">
                    Login to save this journal and track your mood over time.
                  </p>
                  <SignInButton>
                    <Button>
                      <LogIn className="mr-2 h-4 w-4" />
                      🔐 Login to Save
                    </Button>
                  </SignInButton>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
