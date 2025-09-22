import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import StudentOnboardingForm from "./_components/student-onboarding-form";

export default async function StudentOnboardingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  return <StudentOnboardingForm />;
}

