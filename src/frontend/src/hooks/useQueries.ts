import { useActor } from './useActor';

// This file is reserved for React Query hooks that interact with the backend.
// Since the backend is empty, no queries are needed yet.

export function useBackendQueries() {
  const { actor, isFetching } = useActor();
  
  // Add backend queries here when backend functionality is implemented
  
  return {
    actor,
    isFetching,
  };
}
