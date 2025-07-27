'use client';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

import { format } from 'date-fns';
import { CalendarDays, Clock, FileText } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { MOODS } from '@/lib/utils';

interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  mood: string;
  summary?: string;
  createdAt: string;
  wordCount: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: JournalEntry;
}

const localizer = momentLocalizer(moment);

const getMoodEmoji = (mood: string) => {
  return MOODS[mood as keyof typeof MOODS]?.emoji || '📝';
};

function generateMockEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const moods = Object.keys(MOODS);

  // Generate events for the last 30 days
  for (let index = 0; index < 30; index++) {
    const date = new Date();
    date.setDate(date.getDate() - index);

    // 70% chance of having an entry on any given day
    if (Math.random() > 0.3) {
      const mood = moods[Math.floor(Math.random() * moods.length)];
      const entry: JournalEntry = {
        id: `mock-entry-${index}`,
        title: `Day ${30 - index} Reflection`,
        content: `This is a mock journal entry for ${format(
          date,
          'MMMM do',
        )}. It represents the thoughts and feelings of that day.`,
        mood,
        summary: `A brief reflection on the events and emotions of ${format(
          date,
          'MMMM do',
        )}.`,
        createdAt: date.toISOString(),
        wordCount: Math.floor(Math.random() * 400) + 100,
      };

      events.push({
        id: entry.id,
        title: `${getMoodEmoji(mood)} ${entry.title}`,
        start: date,
        end: date,
        resource: entry,
      });
    }
  }

  return events;
}

export default function CalendarPage() {
  // Temporarily remove auth check to show calendar with mock data
  // const { isSignedIn } = useAuth();
  const isSignedIn = true; // Force signed in for development
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>(
    'month',
  );

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        // Always use mock data for development since API may not exist yet
        console.log('Loading mock data for calendar...');
        const mockEvents = generateMockEvents();
        console.log('Generated mock events:', mockEvents.length);
        setEvents(mockEvents);

        // Uncomment below when API is ready
        /*
        if (isSignedIn) {
          const response = await fetch('/api/journals');
          if (response.ok) {
            const entries = await response.json();
            const calendarEvents = entries.map((entry: JournalEntry) => ({
              id: entry.id,
              title: `${getMoodEmoji(entry.mood)} ${
                entry.title || 'Journal Entry'
              }`,
              start: new Date(entry.createdAt),
              end: new Date(entry.createdAt),
              resource: entry,
            }));
            setEvents(calendarEvents);
          } else {
            setEvents(generateMockEvents());
          }
        }
        */
      } catch (error) {
        console.error('Error fetching entries:', error);
        setEvents(generateMockEvents());
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleViewChange = (view: 'month' | 'week' | 'day') => {
    setCurrentView(view);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const mood = event.resource.mood;
    const backgroundColor =
      MOODS[mood as keyof typeof MOODS]?.color || MOODS.neutral.color;

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        border: 'none',
        color: 'white',
        fontSize: '12px',
        padding: '2px 5px',
      },
    };
  };

  if (!isSignedIn) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardContent className="space-y-4 pt-6 text-center">
            <CalendarDays className="text-muted-foreground mx-auto h-12 w-12" />
            <div>
              <h2 className="text-xl font-semibold">Journal Calendar</h2>
              <p className="text-muted-foreground">
                Please sign in to view your journal calendar.
              </p>
            </div>
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="flex items-center justify-center gap-2 text-3xl font-bold tracking-tight">
            <CalendarDays className="h-8 w-8" />
            Journal Calendar
          </h1>
          <p className="text-muted-foreground">
            View your journal entries in a calendar layout
          </p>
        </div>

        {/* Calendar */}
        <Card className="min-h-[600px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-primary h-3 w-3 rounded-full"></div>
              Your Journal Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-96 items-center justify-center">
                <div className="space-y-4 text-center">
                  <div className="bg-muted mx-auto h-8 w-48 animate-pulse rounded"></div>
                  <div className="bg-muted mx-auto h-64 w-full animate-pulse rounded"></div>
                </div>
              </div>
            ) : (
              <div className="h-[500px]">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectEvent={handleSelectEvent}
                  onView={view =>
                    handleViewChange(view as 'month' | 'week' | 'day')
                  }
                  defaultDate={new Date()}
                  view={currentView}
                  eventPropGetter={eventStyleGetter}
                  popup
                  views={['month', 'week', 'day']}
                  className="rbc-calendar-custom"
                  style={{ height: '100%' }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-primary h-3 w-3 rounded-full"></div>
              Mood Legend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 md:grid-cols-5">
              {Object.entries(MOODS).map(([mood, { emoji }]) => (
                <div key={mood} className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{
                      backgroundColor:
                        MOODS[mood as keyof typeof MOODS]?.color ||
                        MOODS.neutral.color,
                    }}
                  ></div>
                  <span>
                    {emoji} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entry Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <Card>
              Journal Entry -{' '}
              {selectedEvent && format(selectedEvent.start, 'MMMM d, yyyy')}
            </Card>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <Card className="border-l-primary/50 border-l-4">
                <CardContent className="space-y-3 pt-4">
                  {/* Entry Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {getMoodEmoji(selectedEvent.resource.mood)}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`rounded-full px-3 py-1`}
                        style={{
                          backgroundColor:
                            MOODS[
                              selectedEvent.resource.mood as keyof typeof MOODS
                            ].color + '20',
                        }}
                      >
                        {selectedEvent.resource.mood}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {format(selectedEvent.start, 'h:mm a')}
                    </div>
                  </div>

                  {/* Entry Title */}
                  {selectedEvent.resource.title && (
                    <h3 className="text-lg font-semibold">
                      {selectedEvent.resource.title}
                    </h3>
                  )}

                  {/* Entry Content */}
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {selectedEvent.resource.summary ||
                        selectedEvent.resource.content.slice(0, 200) + '...'}
                    </p>
                  </div>

                  {/* Entry Footer */}
                  <div className="border-border/50 flex items-center justify-between border-t pt-2">
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <FileText className="h-3 w-3" />
                      {selectedEvent.resource.wordCount} words
                    </div>
                    <Button size="sm" variant="outline">
                      View Full Entry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
