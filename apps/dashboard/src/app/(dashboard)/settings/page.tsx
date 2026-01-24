import { getUserProfile } from "@/lib/queries";
import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SettingsPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-start p-6 gap-6 w-full">
      <div className="w-full max-w-2xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-calistoga">
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your personal information used in the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileSettingsForm profile={profile} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
