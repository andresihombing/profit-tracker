export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-foreground/10 sm:p-8">
        <div className="mb-6">
          <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-zinc-950 text-sm font-semibold text-white">
            P
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}
