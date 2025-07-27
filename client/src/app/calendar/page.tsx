'use client';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

import { SignInButton, useAuth } from '@clerk/nextjs';
import { format } from 'date-fns';
import { CalendarDays, Clock, FileText, Trash2 } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteJournal, useGetUserJournals } from '@/hooks/use-journal-api';
import { MOODS } from '@/lib/utils';

interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  mood: string;
  summary?: string;
  createdAt: string;
  wordCount?: number;
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

export default function CalendarPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>(
    'month',
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format current date for API call (YYYY-MM format)
  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const selectedMonth = formatDateForAPI(currentDate);
  const myJournals = useGetUserJournals(selectedMonth);
  const deleteJournalMutation = useDeleteJournal();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Update events when journal data changes
  useEffect(() => {
    if (myJournals.data) {
      const calendarEvents = myJournals.data.map((entry: JournalEntry) => ({
        id: entry.id,
        title: `${getMoodEmoji(entry.mood)} ${entry.title || 'Journal Entry'}`,
        start: new Date(entry.createdAt),
        end: new Date(entry.createdAt),
        resource: entry,
      }));
      setEvents(calendarEvents);
    }
  }, [myJournals.data]);

  const isLoading = myJournals.isPending;
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleViewChange = (view: 'month' | 'week' | 'day') => {
    setCurrentView(view);
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
    // Data will automatically refetch due to selectedMonth change
  };

  const handleNext = () => {
    const today = new Date();
    let nextDate: Date;

    if (currentView === 'month') {
      nextDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1,
      );
    } else if (currentView === 'week') {
      nextDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }

    // Only allow navigation if next date is not in the future
    if (nextDate <= today) {
      setCurrentDate(nextDate);
    }
  };

  const handlePrevious = () => {
    let previousDate: Date;

    if (currentView === 'month') {
      previousDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1,
      );
    } else if (currentView === 'week') {
      previousDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      previousDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    }

    setCurrentDate(previousDate);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
  };

  const isNextDisabled = () => {
    const today = new Date();
    let nextDate: Date;

    if (currentView === 'month') {
      nextDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1,
      );
    } else if (currentView === 'week') {
      nextDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }

    return nextDate > today;
  };

  const handleViewFullEntry = (journalId: string) => {
    // Navigate to write page with journal ID
    router.push(`/write?edit=${journalId}`);
    setIsDialogOpen(false);
  };

  const handleWriteFirstEntry = () => {
    // Navigate to write page for new entry
    router.push('/write');
  };

  const handleDeleteJournal = async (journalId: string) => {
    if (
      globalThis.confirm(
        'Are you sure you want to delete this journal entry? This action cannot be undone.',
      )
    ) {
      try {
        await deleteJournalMutation.mutateAsync(journalId);
        // Refresh the journals list for current month
        myJournals.refetch();
        // Close the dialog
        setIsDialogOpen(false);
      } catch (error) {
        console.error('Failed to delete journal:', error);
        alert('Failed to delete journal. Please try again.');
      }
    }
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
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
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
            <Button variant="default" size="sm" onClick={handleWriteFirstEntry}>
              Create Journal
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-96 items-center justify-center">
                <div className="space-y-4 text-center">
                  <div className="bg-muted mx-auto h-8 w-48 animate-pulse rounded"></div>
                  <div className="bg-muted mx-auto h-64 w-full animate-pulse rounded"></div>
                </div>
              </div>
            ) : myJournals.isError ? (
              <div className="flex h-96 items-center justify-center">
                <div className="space-y-4 text-center">
                  <FileText className="text-muted-foreground mx-auto h-12 w-12" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Failed to load journals
                    </h3>
                    <p className="text-muted-foreground">
                      {myJournals.error?.message ||
                        'Please try refreshing the page'}
                    </p>
                  </div>
                  <Button onClick={() => myJournals.refetch()}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="h-[500px]">
                  <Calendar
                    localizer={localizer}
                    events={events || []}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={handleSelectEvent}
                    onView={view =>
                      handleViewChange(view as 'month' | 'week' | 'day')
                    }
                    onNavigate={handleNavigate}
                    date={currentDate}
                    view={currentView}
                    eventPropGetter={eventStyleGetter}
                    popup
                    views={['month', 'week', 'day']}
                    className="rbc-calendar-custom"
                    style={{ height: '100%' }}
                    showMultiDayTimes
                    step={60}
                    timeslots={1}
                    components={{
                      toolbar: (props: any) => (
                        <div className="rbc-toolbar">
                          <span className="rbc-btn-group">
                            <button
                              type="button"
                              onClick={handleToday}
                              className="rbc-button-link"
                            >
                              Today
                            </button>
                            <button
                              type="button"
                              onClick={handlePrevious}
                              className="rbc-button-link"
                            >
                              ‹
                            </button>
                            <button
                              type="button"
                              onClick={handleNext}
                              disabled={isNextDisabled()}
                              className="rbc-button-link"
                            >
                              ›
                            </button>
                          </span>
                          <span className="rbc-toolbar-label">
                            {props.label}
                          </span>
                          <span className="rbc-btn-group">
                            {props.views.map((name: string) => (
                              <button
                                key={name}
                                type="button"
                                className={
                                  props.view === name ? 'rbc-active' : ''
                                }
                                onClick={() => props.onView(name)}
                              >
                                {name.charAt(0).toUpperCase() + name.slice(1)}
                              </button>
                            ))}
                          </span>
                        </div>
                      ),
                    }}
                  />
                </div>
              </>
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
          <DialogTitle></DialogTitle>
          <DialogHeader>
            <Card className="pl-4">
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
                      {selectedEvent.resource.wordCount || 0} words
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleViewFullEntry(selectedEvent.resource.id)
                        }
                      >
                        View Full Entry
                      </Button>
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleDeleteJournal(selectedEvent.resource.id)
                        }
                        disabled={deleteJournalMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                        {deleteJournalMutation.isPending
                          ? 'Deleting...'
                          : 'Delete'}
                      </Button>
                    </div>
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
