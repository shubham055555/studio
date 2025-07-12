import Link from "next/link";
import { Star } from "lucide-react";
import type { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.profilePhotoURL} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-base font-headline">
            <Link href={`/profile/${user.id}`} className="hover:underline">
              {user.name}
            </Link>
          </CardTitle>
          <CardDescription>{user.location}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Skills Offered</h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsOffered.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
            {user.skillsOffered.length > 3 && (
              <Badge variant="outline">+{user.skillsOffered.length - 3} more</Badge>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Wants to Learn</h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsWanted.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="border-accent text-accent-foreground">
                {skill}
              </Badge>
            ))}
             {user.skillsWanted.length > 3 && (
              <Badge variant="outline">+{user.skillsWanted.length - 3} more</Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Star className={cn("w-4 h-4", user.rating > 0 ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
          <span className="text-sm text-muted-foreground">{user.rating.toFixed(1)}</span>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/profile/${user.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
