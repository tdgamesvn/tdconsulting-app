import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.signOut().then(() => {
      router.push("/login");
    });
  }, []);

  return <p className="p-4">Đang đăng xuất...</p>;
}
