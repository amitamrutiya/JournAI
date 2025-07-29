export const QUERY_CONFIG = {
  // Default stale time for all queries (5 minutes)
  staleTime: 1000 * 60 * 5,

  // Default garbage collection time for all queries (30 minutes)
  gcTime: 1000 * 60 * 30,

  // Retry configuration
  retry: 3,

  // Refetch on window focus
  refetchOnWindowFocus: false,
} as const;

export const QUERY_KEYS = {
  userJournals: ['user-journals'] as const,
  journalById: (id: string) => ['journal', id] as const,
  journalInsights: ['journal-insights'] as const,
} as const;
