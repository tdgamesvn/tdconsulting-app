// components/AuthGuard.tsx
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Nếu chưa login, chuyển hướng
    }
  }, [user, loading, router]);

  if (loading || !user) return <p className="p-4">Loading...</p>;

  return <>{children}</>;
}
