import { MOCK_USERS } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Star, Calendar, MessageSquare, Heart } from "lucide-react";

export default function UserProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const user = MOCK_USERS.find((u) => u.id === params.userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card>
        <CardHeader className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={user.profilePhotoURL} alt={user.name} />
              <AvatarFallback className="text-3xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
              <div className="flex items-center text-muted-foreground gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold">{user.rating.toFixed(1)}</span>
                  <span>(12 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{user.availability}</span>
                </div>
              </div>
              <div className="pt-2">
                <Button>
                    <MessageSquare className="mr-2 h-4 w-4" /> Request Skill Swap
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid gap-6">
            <div>
                <h2 className="text-xl font-bold font-headline flex items-center mb-3">
                    <Heart className="mr-2 h-5 w-5 text-primary"/>
                    Skills Offered
                </h2>
                <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.map(skill => (
                        <Badge key={skill} className="text-sm py-1 px-3" variant="default" style={{backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))'}}>{skill}</Badge>
                    ))}
                </div>
            </div>
             <div>
                <h2 className="text-xl font-bold font-headline flex items-center mb-3">
                    <Star className="mr-2 h-5 w-5 text-accent"/>
                    Wants to Learn
                </h2>
                <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.map(skill => (
                        <Badge key={skill} variant="outline" className="text-sm py-1 px-3 border-accent text-accent-foreground">{skill}</Badge>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
