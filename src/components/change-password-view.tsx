
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function ChangePasswordView() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Password Updated",
            description: "Your password has been changed successfully."
        });
        router.back();
    }
    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Change Your Password</CardTitle>
                    <CardDescription>Enter your current and new password below.</CardDescription>
                </CardHeader>
                <CardContent>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" />
                        </div>
                        <Button type="submit" className="w-full">Update Password</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
