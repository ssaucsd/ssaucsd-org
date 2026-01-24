import { UserInfoForm } from "@/components/UserInfoForm";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <UserInfoForm />
      </div>
    </div>
  );
}
