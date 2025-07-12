import { MOCK_REQUESTS, MOCK_LOGGED_IN_USER } from "@/lib/mock-data";
import { DashboardClient } from "./DashboardClient";

export default function DashboardPage() {
  const loggedInUserId = MOCK_LOGGED_IN_USER.id;

  const incomingRequests = MOCK_REQUESTS.filter(
    (req) => req.to === loggedInUserId
  );
  const sentRequests = MOCK_REQUESTS.filter(
    (req) => req.from === loggedInUserId
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your skill swap requests.
        </p>
      </div>
      <DashboardClient
        incomingRequests={incomingRequests}
        sentRequests={sentRequests}
      />
    </div>
  );
}
