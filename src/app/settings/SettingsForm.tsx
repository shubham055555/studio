"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_LOGGED_IN_USER } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Loader2, Wand2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { suggestSkills } from "@/ai/flows/suggest-skills";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  location: z.string().optional(),
  availability: z.string().optional(),
  skillsOffered: z.array(z.string()).min(1, "Please offer at least one skill."),
  skillsWanted: z.array(z.string()).min(1, "Please list at least one skill you want to learn."),
  profile: z.enum(["Public", "Private"]),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const SkillInput = ({ field, placeholder, onAdd }: { field: any, placeholder: string, onAdd: (skill: string) => void }) => {
    const [skill, setSkill] = useState("");
    return (
        <div>
            <div className="flex gap-2">
                <Input
                    placeholder={placeholder}
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && skill) {
                            e.preventDefault();
                            onAdd(skill);
                            setSkill("");
                        }
                    }}
                />
                <Button type="button" variant="outline" onClick={() => { if(skill) { onAdd(skill); setSkill("") } }}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((s: string, index: number) => (
                    <Badge key={index} variant="secondary">
                        {s}
                        <button type="button" onClick={() => field.onChange(field.value.filter((_: any, i: number) => i !== index))} className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                           <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    );
}

export function SettingsForm() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...MOCK_LOGGED_IN_USER,
    },
    mode: "onChange",
  });

  const { fields: skillsOfferedFields, append: appendSkillOffered } = useFieldArray({ control: form.control, name: "skillsOffered" });
  const { fields: skillsWantedFields, append: appendSkillWanted } = useFieldArray({ control: form.control, name: "skillsWanted" });


  function onSubmit(data: ProfileFormValues) {
    toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
    });
    console.log(data);
  }

  const handleGenerateSkills = async () => {
    if (!aiPrompt) {
        toast({ variant: "destructive", title: "Prompt is empty", description: "Please describe your background to get suggestions." });
        return;
    }
    setIsGenerating(true);
    setSuggestedSkills([]);
    try {
        const result = await suggestSkills({ prompt: aiPrompt });
        setSuggestedSkills(result.skills);
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not generate skills. Please try again." });
    } finally {
        setIsGenerating(false);
    }
  };
  
  const addSuggestedSkill = (skill: string) => {
    if (!form.getValues('skillsOffered').includes(skill)) {
        appendSkillOffered(skill);
    }
    setSuggestedSkills(prev => prev.filter(s => s !== skill));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Public Profile</CardTitle>
            <CardDescription>This information will be displayed on your public profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={MOCK_LOGGED_IN_USER.profilePhotoURL} />
                    <AvatarFallback>{MOCK_LOGGED_IN_USER.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline">Change Photo</Button>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country" {...field} />
                  </FormControl>
                   <FormDescription>Optional, but helps find local swaps.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>What skills can you offer, and what do you want to learn?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="skillsOffered"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Skills Offered</FormLabel>
                    <SkillInput field={field} placeholder="e.g. React" onAdd={(skill) => appendSkillOffered(skill)} />
                    <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4 rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold">Get Skill Suggestions with AI</h3>
                </div>
                <Textarea placeholder="Describe your background, hobbies, and profession..." value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
                <Button type="button" onClick={handleGenerateSkills} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Suggestions
                </Button>
                {suggestedSkills.length > 0 && <p className="text-sm text-muted-foreground">Click a skill to add it to your offerings:</p>}
                <div className="flex flex-wrap gap-2">
                    {suggestedSkills.map((skill, i) => <Badge key={i} variant="default" className="cursor-pointer" onClick={() => addSuggestedSkill(skill)}>{skill}</Badge>)}
                </div>
            </div>

            <FormField
              control={form.control}
              name="skillsWanted"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Skills Wanted</FormLabel>
                    <SkillInput field={field} placeholder="e.g. Python" onAdd={(skill) => appendSkillWanted(skill)} />
                    <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Availability & Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Availability</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Weekends, evenings" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                control={form.control}
                name="profile"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>Profile Visibility</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="Public" />
                            </FormControl>
                            <FormLabel className="font-normal">Public - Visible to everyone</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="Private" />
                            </FormControl>
                            <FormLabel className="font-normal">Private - Only visible to you</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
        </Card>
        
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
