import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Dashboard } from './pages/Dashboard';
import { SubjectPage } from './pages/SubjectPage';
import { Customize } from './pages/Customize';
import { CalendarDashboard } from './pages/CalendarDashboard';
import { Notes } from './pages/Notes';
import { Tests } from './pages/Tests';
import { Layout } from './components/Layout';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

// Stable component definitions to avoid hook order issues
function MathPage() {
  return <SubjectPage subjectId="mathematics" />;
}

function PhysicsPage() {
  return <SubjectPage subjectId="physics" />;
}

function ChemistryPage() {
  return <SubjectPage subjectId="chemistry" />;
}

function DynamicSubjectPage() {
  const { subjectId } = subjectRoute.useParams();
  return <SubjectPage subjectId={subjectId} />;
}

// Legacy routes for backward compatibility
const mathRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/math',
  component: MathPage,
});

const physicsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/physics',
  component: PhysicsPage,
});

const chemistryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chemistry',
  component: ChemistryPage,
});

// Dynamic subject route
const subjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subject/$subjectId',
  component: DynamicSubjectPage,
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
  mathRoute,
  physicsRoute,
  chemistryRoute,
  subjectRoute,
  calendarRoute,
  notesRoute,
  testsRoute,
  customizeRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
