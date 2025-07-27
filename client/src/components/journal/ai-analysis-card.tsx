'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AIAnalysisCardProps {
  mood: string;
  summary: string;
  reason: string;
}

const getMoodEmoji = (mood: string): string => {
  const moodLower = mood.toLowerCase();
  if (moodLower.includes('happy') || moodLower.includes('joy')) return '😊';
  if (moodLower.includes('sad') || moodLower.includes('down')) return '😢';
  if (moodLower.includes('angry') || moodLower.includes('mad')) return '😠';
  if (moodLower.includes('anxious') || moodLower.includes('worry')) return '😰';
  if (moodLower.includes('excited') || moodLower.includes('energetic'))
    return '🤩';
  if (moodLower.includes('calm') || moodLower.includes('peaceful')) return '😌';
  if (moodLower.includes('frustrated')) return '😤';
  if (moodLower.includes('content')) return '😊';
  if (moodLower.includes('confused')) return '😕';
  if (moodLower.includes('grateful')) return '🙏';
  return '🎭'; // Default emoji for mood
};

export function AIAnalysisCard({ mood, summary, reason }: AIAnalysisCardProps) {
  const moodEmoji = getMoodEmoji(mood);

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 dark:border-blue-800 dark:from-blue-950/20 dark:to-purple-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🤖 AI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mood */}
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
            🎭 Detected Mood
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{moodEmoji}</span>
            <Badge variant="secondary" className="px-3 py-1 text-lg">
              {mood}
            </Badge>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
            📝 Summary
          </h3>
          <p className="rounded-lg border bg-white/50 p-3 text-sm leading-relaxed dark:bg-black/20">
            {summary}
          </p>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
            🔍 Analysis Reasoning
          </h3>
          <p className="rounded-lg border bg-white/50 p-3 text-sm leading-relaxed dark:bg-black/20">
            {reason}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
