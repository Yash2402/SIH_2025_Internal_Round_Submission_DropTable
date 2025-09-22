import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import InstitutionOnboardingForm from "./_components/institution-onboarding-form";

export default async function InstitutionOnboardingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  return <InstitutionOnboardingForm />;
}

