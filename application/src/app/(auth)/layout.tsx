/**
 * Authentication Layout Component
 *
 * This layout wraps all authentication-related pages (login and register) in the (auth) group.
 * The parentheses in (auth) indicate a route group in Next.js that doesn't affect the URL structure.
 *
 * Features:
 * - Centered container layout for auth forms
 * - Responsive design with max-width constraint
 * - Maintains consistent spacing from header (80px)
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components (login or register forms)
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container relative flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      {/* 
        Container with max-width for auth forms
        - max-w-md limits width to maintain readable form size
        - w-full allows responsive scaling up to max-width
      */}
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
