export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }} />
      </div>
      <div className="relative w-full max-w-md px-4">{children}</div>
    </div>
  );
}
