import { Box } from '@mui/material';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import type { Navigation } from '@toolpad/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IoPulse, IoPeople } from 'react-icons/io5';
import PatientsPage from './pages/patients';
import { darkTheme, lightTheme } from './theme';

const queryClient = new QueryClient();

const NAVIGATION: Navigation = [
  {
    segment: 'patients',
    title: 'Patients',
    icon: <IoPeople size={28} />,
  },
];

const BRANDING = {
  title: 'Patient Tracker',
  logo: (
    <Box
      component="span"
      sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', mt: 0.5 }}
    >
      <IoPulse size={32} />
    </Box>
  ),
};

// Static router for single-page app — keeps the nav item highlighted as active.
const ROUTER = {
  pathname: '/patients',
  searchParams: new URLSearchParams(),
  navigate: (_path: string | URL) => {},
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider
        navigation={NAVIGATION}
        branding={BRANDING}
        router={ROUTER}
        theme={{ light: lightTheme, dark: darkTheme }}
      >
        <DashboardLayout defaultSidebarCollapsed sidebarExpandedWidth={250}>
          <PatientsPage />
        </DashboardLayout>
      </AppProvider>
    </QueryClientProvider>
  );
}
