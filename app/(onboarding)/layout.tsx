import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-lg">CRM SaaS</span>
          </div>
        </div>
        <OnboardingProgress />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
