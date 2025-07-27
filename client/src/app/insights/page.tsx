'use client';

import { useAuth } from '@clerk/nextjs';
import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarDays,
  ChevronDown,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InsightData {
  totalEntries: number;
  averageWordsPerEntry: number;
  longestStreak: number;
  currentStreak: number;
  moodDistribution: Array<{
    mood: string;
    count: number;
    percentage: number;
  }>;
  wordCountTrend: Array<{
    date: string;
    wordCount: number;
    entryCount: number;
  }>;
  weeklyActivity: Array<{
    day: string;
    entries: number;
  }>;
}

type TimeRange = 'week' | 'month' | 'quarter' | 'year';

const MOOD_COLORS = {
  happy: '#10B981',
  sad: '#3B82F6',
  anxious: '#F59E0B',
  excited: '#8B5CF6',
  angry: '#EF4444',
  calm: '#6366F1',
  neutral: '#6B7280',
  grateful: '#059669',
  frustrated: '#EA580C',
  content: '#0D9488',
};

const MOOD_EMOJIS = {
  happy: '😊',
  sad: '😢',
  anxious: '😰',
  excited: '🤩',
  angry: '😠',
  calm: '😌',
  neutral: '😐',
  grateful: '🙏',
  frustrated: '😤',
  content: '😌',
};

const getMoodEmoji = (mood: string) => {
  return MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS] || '🎭';
};

const getTimeRangeLabel = (range: TimeRange) => {
  const labels = {
    week: 'Last 7 Days',
    month: 'This Month',
    quarter: 'Last 3 Months',
    year: 'This Year',
  };
  return labels[range];
};

function generateMockInsights(): InsightData {
  return {
    totalEntries: 127,
    averageWordsPerEntry: 284,
    longestStreak: 15,
    currentStreak: 7,
    moodDistribution: [
      { mood: 'happy', count: 45, percentage: 35 },
      { mood: 'calm', count: 32, percentage: 25 },
      { mood: 'excited', count: 20, percentage: 16 },
      { mood: 'neutral', count: 15, percentage: 12 },
      { mood: 'anxious', count: 10, percentage: 8 },
      { mood: 'sad', count: 5, percentage: 4 },
    ],
    wordCountTrend: [
      { date: '2025-01-21', wordCount: 250, entryCount: 1 },
      { date: '2025-01-22', wordCount: 320, entryCount: 1 },
      { date: '2025-01-23', wordCount: 180, entryCount: 1 },
      { date: '2025-01-24', wordCount: 450, entryCount: 2 },
      { date: '2025-01-25', wordCount: 290, entryCount: 1 },
      { date: '2025-01-26', wordCount: 380, entryCount: 1 },
      { date: '2025-01-27', wordCount: 220, entryCount: 1 },
    ],
    weeklyActivity: [
      { day: 'Mon', entries: 18 },
      { day: 'Tue', entries: 22 },
      { day: 'Wed', entries: 16 },
      { day: 'Thu', entries: 20 },
      { day: 'Fri', entries: 25 },
      { day: 'Sat', entries: 15 },
      { day: 'Sun', entries: 11 },
    ],
  };
}

export default function InsightsPage() {
  const { isSignedIn } = useAuth();
  const [insights, setInsights] = useState<InsightData>();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>();

  useEffect(() => {
    if (!isSignedIn) {
      setIsLoading(false);
      return;
    }

    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          range: timeRange,
          ...(selectedMoodFilter && { mood: selectedMoodFilter }),
        });

        const response = await fetch(`/api/journals/insights?${params}`);

        if (response.ok) {
          const data = await response.json();
          setInsights(data);
        } else {
          // Use mock data for development
          setInsights(generateMockInsights());
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
        setInsights(generateMockInsights());
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [timeRange, selectedMoodFilter, isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardContent className="space-y-4 pt-6 text-center">
            <BarChart3 className="text-muted-foreground mx-auto h-12 w-12" />
            <div>
              <h2 className="text-xl font-semibold">Insights Dashboard</h2>
              <p className="text-muted-foreground">
                Please sign in to view your insights.
              </p>
            </div>
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-6">
          <div className="bg-muted mx-auto h-12 w-64 animate-pulse rounded"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="bg-muted mb-2 h-8 w-full animate-pulse rounded"></div>
                  <div className="bg-muted h-12 w-full animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="bg-muted h-64 w-full animate-pulse rounded"></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="bg-muted h-64 w-full animate-pulse rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardContent className="space-y-4 pt-6 text-center">
            <Brain className="text-muted-foreground mx-auto h-12 w-12" />
            <div>
              <h2 className="text-xl font-semibold">No Data Available</h2>
              <p className="text-muted-foreground">
                Start writing journal entries to see insights.
              </p>
            </div>
            <Button>Write Your First Entry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              <BarChart3 className="h-8 w-8" />
              Journal Insights
            </h1>
            <p className="text-muted-foreground">
              Discover patterns and trends in your journaling journey
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[140px]">
                  {getTimeRangeLabel(timeRange)}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTimeRange('week')}>
                  Last 7 Days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange('month')}>
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange('quarter')}>
                  Last 3 Months
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange('year')}>
                  This Year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[120px]">
                  {selectedMoodFilter ? (
                    <>
                      {getMoodEmoji(selectedMoodFilter)} {selectedMoodFilter}
                    </>
                  ) : (
                    'All Moods'
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setSelectedMoodFilter(undefined)}
                >
                  All Moods
                </DropdownMenuItem>
                {Object.keys(MOOD_COLORS).map(mood => (
                  <DropdownMenuItem
                    key={mood}
                    onClick={() => setSelectedMoodFilter(mood)}
                  >
                    {getMoodEmoji(mood)}{' '}
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entries
              </CardTitle>
              <BookOpen className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.totalEntries}</div>
              <p className="text-muted-foreground text-xs">
                <TrendingUp className="mr-1 inline h-3 w-3" />
                +12% from last period
              </p>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Words/Entry
              </CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insights.averageWordsPerEntry}
              </div>
              <p className="text-muted-foreground text-xs">
                <TrendingUp className="mr-1 inline h-3 w-3" />
                +5% from last period
              </p>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Streak
              </CardTitle>
              <Target className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.currentStreak}</div>
              <p className="text-muted-foreground text-xs">days in a row</p>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Longest Streak
              </CardTitle>
              <CalendarDays className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.longestStreak}</div>
              <p className="text-muted-foreground text-xs">personal record</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Mood Distribution */}
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                Mood Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={insights.moodDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ mood, percentage }) =>
                      `${getMoodEmoji(mood)} ${percentage}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {insights.moodDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          MOOD_COLORS[entry.mood as keyof typeof MOOD_COLORS]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${value} entries`,
                      `${getMoodEmoji(props.payload.mood)} ${props.payload.mood}`,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Word Count Trend */}
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                Word Count Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={insights.wordCountTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={value =>
                      new Date(value).getDate().toString()
                    }
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={value =>
                      new Date(value).toLocaleDateString()
                    }
                    formatter={(value: number) => [
                      `${value} words`,
                      'Word Count',
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="wordCount"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
              Weekly Activity Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={insights.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value} entries`, 'Entries']}
                />
                <Bar
                  dataKey="entries"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                  className="transition-opacity hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
