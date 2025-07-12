import { SettingsForm } from "./SettingsForm";

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and profile settings.
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
