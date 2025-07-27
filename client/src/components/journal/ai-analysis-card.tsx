'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOODS } from '@/lib/utils';

interface AIAnalysisCardProps {
  mood: string;
  summary: string;
  reason: string;
}

const getMoodEmoji = (mood: string): string => {
  const moodLower = mood.toLowerCase();
  return MOODS[moodLower as keyof typeof MOODS]?.emoji || '😐';
};

export function AIAnalysisCard({ mood, summary, reason }: AIAnalysisCardProps) {
  console.log('AI Analysis Card Props:', { mood, summary, reason });
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
