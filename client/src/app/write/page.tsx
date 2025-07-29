'use client';

import { SignInButton, useAuth } from '@clerk/nextjs';
import { Brain, Loader2, LogIn, Save } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { AIAnalysisCard } from '@/components/journal/ai-analysis-card';
import { JournalEditor } from '@/components/journal/journal-editor';
import { PDFUpload } from '@/components/journal/pdf-upload';
import SaveJournalButton from '@/components/journal/save-journal-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useAnalyzeJournal,
  useGetJournalById,
  usePDFExtract,
  useSaveJournal,
  useUpdateJournal,
} from '@/hooks/use-journal-api';
import { content } from '@/lib/content';

interface AIAnalysis {
  mood: string;
  summary: string;
  reason: string;
}

function WritePageContent() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editJournalId = searchParams.get('edit');

  const [journalText, setJournalText] = useState(content);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingAnalysis, setExistingAnalysis] = useState<AIAnalysis>();

  const analyzeJournalMutation = useAnalyzeJournal();
  const saveJournalMutation = useSaveJournal();
  const updateJournalMutation = useUpdateJournal();
  const pdfExtractMutation = usePDFExtract();

  // Fetch journal data if editing
  const existingJournal = useGetJournalById(editJournalId);

  // Load existing journal data when editing
  useEffect(() => {
    if (editJournalId && existingJournal.data && !isEditMode) {
      setJournalText(existingJournal.data.content || '');
      setIsEditMode(true);

      // Pre-populate analysis with existing data instead of calling API
      if (existingJournal.data.mood && existingJournal.data.summary) {
        // Create analysis data structure to match the API response
        const analysisData = {
          mood: existingJournal.data.mood,
          summary: existingJournal.data.summary,
          reason:
            existingJournal.data.reason || 'Previously analyzed journal entry',
        };

        setExistingAnalysis(analysisData);
      }
    }
  }, [editJournalId, existingJournal.data, isEditMode]);

  const handleAnalyzeWithAI = async () => {
    if (!journalText.trim()) return;

    try {
      const result = await analyzeJournalMutation.mutateAsync({
        text: journalText,
      });
      // Clear existing analysis when new analysis is completed
      // This ensures the new analysis takes priority
      if (result && isEditMode) {
        setExistingAnalysis(undefined);
      }
    } catch (error) {
      console.error('Error analyzing journal:', error);
    }
  };

  const handleSaveJournal = async () => {
    // Prioritize new analysis over existing analysis
    const analysisData = analyzeJournalMutation.data?.data || existingAnalysis;

    if (!isSignedIn || !journalText.trim() || !analysisData) {
      return;
    }

    try {
      await (isEditMode && editJournalId
        ? updateJournalMutation.mutateAsync({
            id: editJournalId,
            text: journalText,
            mood: analysisData.mood,
            summary: analysisData.summary,
            reason: analysisData.reason,
          })
        : saveJournalMutation.mutateAsync({
            text: journalText,
            mood: analysisData.mood,
            summary: analysisData.summary,
            reason: analysisData.reason,
          }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving journal:', error);
      // TODO: Add proper error handling/toast
    }
  };

  const handlePDFUpload = async (file: File) => {
    try {
      const result = await pdfExtractMutation.mutateAsync(file);
      setJournalText(result.text);
    } catch (error) {
      console.error('Error extracting PDF:', error);
      // TODO: Add proper error handling/toast
    }
  };

  // Show loading state when fetching existing journal
  if (editJournalId && existingJournal.isPending) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex h-96 items-center justify-center">
          <div className="space-y-4 text-center">
            <Loader2 className="text-muted-foreground mx-auto h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Loading journal entry...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if journal not found
  if (editJournalId && existingJournal.isError) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card>
          <CardContent className="space-y-4 pt-6 text-center">
            <div>
              <h2 className="text-xl font-semibold">Journal not found</h2>
              <p className="text-muted-foreground">
                The journal entry you&apos;re looking for doesn&apos;t exist or
                you don&apos;t have access to it.
              </p>
            </div>
            <Button onClick={() => router.push('/calendar')}>
              Back to Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? 'Edit Your Journal' : 'Write Your Journal'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? 'Update your thoughts and analysis'
              : 'Express your thoughts and let AI help you understand your emotions'}
          </p>
        </div>

        {/* PDF Upload */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📁 Upload PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PDFUpload onUpload={handlePDFUpload} />
          </CardContent>
        </Card> */}

        {/* Back to Calendar button when editing */}
        {isEditMode && (
          <div className="flex justify-start">
            <Button variant="outline" onClick={() => router.push('/calendar')}>
              ← Back to Calendar
            </Button>
          </div>
        )}

        {/* Journal Editor */}

        <CardContent>
          <JournalEditor content={journalText} onChange={setJournalText} />

          {/* Analyze Button - Only show if not in edit mode */}
          {!isEditMode && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleAnalyzeWithAI}
                disabled={
                  !journalText.trim() || analyzeJournalMutation.isPending
                }
                className="w-full max-w-xs"
              >
                {analyzeJournalMutation.isPending ? (
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
          )}

          {/* Analyze/Re-analyze Button for edit mode */}
          {isEditMode && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleAnalyzeWithAI}
                disabled={
                  !journalText.trim() || analyzeJournalMutation.isPending
                }
                variant={existingAnalysis ? 'outline' : 'default'}
                className="w-full max-w-xs"
              >
                {analyzeJournalMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {existingAnalysis ? 'Re-analyzing...' : 'Analyzing...'}
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    {existingAnalysis
                      ? '🔄 Re-analyze with AI'
                      : '💡 Analyze with AI'}
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>

        {/* AI Analysis Results */}
        {(analyzeJournalMutation.data || existingAnalysis) && (
          <AIAnalysisCard
            mood={
              analyzeJournalMutation.data?.data.mood ||
              existingAnalysis?.mood ||
              ''
            }
            summary={
              analyzeJournalMutation.data?.data.summary ||
              existingAnalysis?.summary ||
              ''
            }
            reason={
              analyzeJournalMutation.data?.data.reason ||
              existingAnalysis?.reason ||
              ''
            }
          />
        )}

        {/* Save Section */}
        {(analyzeJournalMutation.data || existingAnalysis) && (
          <Card>
            <CardContent className="pt-1">
              {isSignedIn ? (
                <div className="space-y-4 text-center">
                  <SaveJournalButton
                    handleSaveJournal={handleSaveJournal}
                    isSaving={
                      saveJournalMutation.isPending ||
                      updateJournalMutation.isPending
                    }
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

export default function WritePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex h-96 items-center justify-center">
            <div className="space-y-4 text-center">
              <Loader2 className="text-muted-foreground mx-auto h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <WritePageContent />
    </Suspense>
  );
}
