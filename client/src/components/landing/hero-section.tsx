import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MOODS } from '@/lib/utils';

const getMoodEmojiForDay = (day: number): string => {
  return (
    MOODS[
      Object.keys(MOODS)[day % Object.keys(MOODS).length] as keyof typeof MOODS
    ]?.emoji || '😐'
  );
};

const getCalendarDayClasses = (isToday: boolean, hasEntry: boolean): string => {
  if (isToday) {
    return 'bg-chart-4 text-chart-4-foreground ring-chart-4/50 ring-2';
  }
  if (hasEntry) {
    return 'bg-muted/50 hover:bg-muted';
  }
  return 'hover:bg-accent';
};

export function HeroSection() {
  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="bg-background relative py-16 md:py-24"
    >
      {/* Background Pattern */}
      <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent" />

      <div className="relative container mx-auto px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div data-testid="hero-content" className="space-y-8">
            <div className="space-y-6">
              <div className="bg-secondary text-secondary-foreground inline-flex items-center rounded-full border px-3 py-1 text-sm">
                <span className="mr-2">✨</span>
                <span>AI-Powered Journaling</span>
              </div>

              <h1
                data-testid="hero-title"
                className="text-foreground text-5xl leading-[1.1] font-bold tracking-tight md:text-6xl lg:text-7xl xl:text-6xl"
              >
                Reflect Better.{' '}
                <span className="relative">
                  <span className="from-primary via-chart-1 to-chart-2 bg-gradient-to-r bg-clip-text text-transparent">
                    Feel Deeper.
                  </span>
                  <div className="from-primary via-chart-1 to-chart-2 absolute -bottom-1 left-0 h-1 w-full bg-gradient-to-r opacity-20"></div>
                </span>{' '}
                Let AI Understand You.
              </h1>

              <p
                data-testid="hero-description"
                className="text-muted-foreground max-w-xl text-xl md:text-2xl lg:text-2xl"
              >
                JournAI helps you journal daily, detect your mood, and track
                your emotional journey with AI insights.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/write">
                <Button
                  data-testid="start-journaling-button"
                  size="lg"
                  className="group bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg transition-all hover:scale-105"
                >
                  📝 Start Journaling
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  data-testid="how-it-works-button"
                  variant="outline"
                  size="lg"
                  className="border-border text-foreground hover:bg-accent hover:text-accent-foreground px-8 py-3 text-lg transition-all hover:scale-105"
                >
                  📚 How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="flex justify-center lg:justify-end">
            <Card className="bg-card w-full max-w-lg border p-6 shadow-xl">
              <div className="space-y-5">
                {/* Mock Journal Entry */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-chart-4 h-3 w-3 rounded-full"></div>
                    <span className="text-muted-foreground text-base">
                      Today&apos;s Entry
                    </span>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-card-foreground text-base">
                      Had a wonderful day exploring the city. Felt energized and
                      creative...
                    </p>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary h-3 w-3 animate-pulse rounded-full"></div>
                    <span className="text-muted-foreground text-base">
                      AI Analysis
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😊</span>
                      <span className="text-chart-4 text-base font-medium">
                        Positive Mood Detected
                      </span>
                    </div>
                    <p className="text-muted-foreground text-base">
                      Your energy and creativity shine through today&apos;s
                      entry.
                    </p>
                  </div>
                </div>

                {/* Mood Calendar Preview */}
                <div className="space-y-10">
                  <div className="bg-card rounded-md border p-4 shadow-sm">
                    {/* Calendar Header */}
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-card-foreground text-base font-medium">
                        July 2025
                      </h3>
                      <div className="flex gap-1">
                        <button className="hover:bg-accent h-6 w-6 rounded">
                          ←
                        </button>
                        <button className="hover:bg-accent h-6 w-6 rounded">
                          →
                        </button>
                      </div>
                    </div>

                    {/* Day Labels */}
                    <div className="mb-2 grid grid-cols-7 gap-1">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div
                          key={`day-${day}-${Math.random()}`}
                          className="text-muted-foreground flex h-8 w-8 items-center justify-center text-xs font-medium"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Empty cells for start of month */}
                      {Array.from({ length: 2 }, (_, index) => (
                        <div key={`empty-${index}`} className="h-8 w-8" />
                      ))}

                      {/* Days with mood emojis */}
                      {Array.from({ length: 29 }, (_, index) => {
                        const day = index + 1;
                        const isToday = day === 25; // Current date
                        const hasEntry = day <= 25; // Show emojis for past days

                        return (
                          <div
                            key={day}
                            className={`flex h-8 w-8 items-center justify-center rounded-sm text-xs transition-all hover:scale-110 ${getCalendarDayClasses(isToday, hasEntry)}`}
                          >
                            {hasEntry ? (
                              <span className="text-xl">
                                {getMoodEmojiForDay(day)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                {day}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
