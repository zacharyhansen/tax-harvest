import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Select a settings category from the sidebar to manage your preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
