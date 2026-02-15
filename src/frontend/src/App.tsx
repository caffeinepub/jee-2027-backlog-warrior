import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Dashboard } from './pages/Dashboard';
import { SubjectPage } from './pages/SubjectPage';
import { Customize } from './pages/Customize';
import { CalendarDashboard } from './pages/CalendarDashboard';
import { Notes } from './pages/Notes';
import { Tests } from './pages/Tests';
import { Layout } from './components/Layout';
import { AppErrorBoundary } from './components/AppErrorBoundary';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

// Dynamic subject route
const subjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subject/$subjectId',
  component: SubjectPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: CalendarDashboard,
});

const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notes',
  component: Notes,
});

const testsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tests',
  component: Tests,
});

const customizeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customize',
  component: Customize,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  subjectRoute,
  calendarRoute,
  notesRoute,
  testsRoute,
  customizeRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AppErrorBoundary router={router}>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  );
}
