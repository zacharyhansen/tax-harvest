import { ThemeProvider } from '@repo/ui/providers/theme-provider';

export default function LandingPage() {
  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      Root page
    </ThemeProvider>
  );
}
