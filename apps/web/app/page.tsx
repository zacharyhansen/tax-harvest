import { ThemeProvider } from '@repo/ui/providers/theme-provider'

export default function LandingPage() {
  return (
    <ThemeProvider>
      {/* Redirect to sign up page */}
      <meta httpEquiv="refresh" content="0;url=/auth/signup" />
    </ThemeProvider>
  )
}
