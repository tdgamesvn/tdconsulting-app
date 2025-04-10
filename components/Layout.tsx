// components/Layout.tsx
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b bg-white">
        <nav className="flex justify-between">
          <div className="font-bold text-lg">TD Consulting</div>
          <div className="space-x-4">
            <Link href="/">Home</Link>
            <Link href="/opening-positions">Jobs</Link>
            {user ? (
              <>
                <Link href="/my-pipelines">My Pipelines</Link>
                <Link href="/logout">Logout</Link>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/signup">Signup</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1 p-6 bg-gray-50">{children}</main>

      <footer className="py-4 text-center text-sm border-t bg-white">
        © 2025 TD Consulting
      </footer>
    </div>
  );
}
