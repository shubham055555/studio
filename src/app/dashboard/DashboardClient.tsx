"use client";

import type { SkillRequest } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface DashboardClientProps {
  incomingRequests: SkillRequest[];
  sentRequests: SkillRequest[];
}

const statusConfig = {
    Pending: { icon: Clock, color: "bg-yellow-500", text: "text-yellow-500" },
    Accepted: { icon: Check, color: "bg-green-500", text: "text-green-500" },
    Rejected: { icon: X, color: "bg-red-500", text: "text-red-500" },
};

function RequestCard({ request, type }: { request: SkillRequest, type: 'incoming' | 'sent' }) {
    const StatusIcon = statusConfig[request.status].icon;
    const userToShow = type === 'incoming' ? { name: request.fromName, photo: request.fromProfilePhotoURL } : { name: request.toName, photo: undefined };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Avatar className="h-10 w-10 border">
                    <AvatarImage src={userToShow.photo} />
                    <AvatarFallback>{userToShow.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-sm font-medium">{userToShow.name}</CardTitle>
                    <CardDescription className="text-xs">{formatDistanceToNow(request.timestamp, { addSuffix: true })}</CardDescription>
                </div>
                <Badge variant="outline" className={cn("flex items-center gap-1.5 capitalize", statusConfig[request.status].text)}>
                    <StatusIcon className={cn("h-3 w-3", statusConfig[request.status].text, `fill-current`)} />
                    {request.status}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-center gap-2 text-sm">
                    <Badge variant="secondary">{type === 'incoming' ? request.fromSkill : request.toSkill}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge>{type === 'incoming' ? request.toSkill : request.fromSkill}</Badge>
                </div>
                {request.message && (
                    <p className="text-sm text-muted-foreground bg-slate-100 p-3 rounded-md border">{request.message}</p>
                )}
            </CardContent>
            {type === 'incoming' && request.status === 'Pending' && (
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm"><X className="mr-1 h-4 w-4" />Reject</Button>
                    <Button size="sm"><Check className="mr-1 h-4 w-4" />Accept</Button>
                </CardFooter>
            )}
            {type === 'incoming' && request.status === 'Accepted' && (
                 <CardFooter className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">Leave Feedback</Button>
                </CardFooter>
            )}
        </Card>
    );
}

export function DashboardClient({
  incomingRequests,
  sentRequests,
}: DashboardClientProps) {
  return (
    <Tabs defaultValue="incoming">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="incoming">Incoming Requests ({incomingRequests.length})</TabsTrigger>
        <TabsTrigger value="sent">Sent Requests ({sentRequests.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="incoming">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {incomingRequests.length > 0 ? (
                incomingRequests.map((req) => <RequestCard key={req.id} request={req} type="incoming" />)
            ) : (
                <p className="text-muted-foreground col-span-full text-center py-8">No incoming requests.</p>
            )}
        </div>
      </TabsContent>
      <TabsContent value="sent">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {sentRequests.length > 0 ? (
                sentRequests.map((req) => <RequestCard key={req.id} request={req} type="sent" />)
             ): (
                <p className="text-muted-foreground col-span-full text-center py-8">You haven't sent any requests yet.</p>
             )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
