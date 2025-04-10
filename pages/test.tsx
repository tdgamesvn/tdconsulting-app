// pages/test.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestPage() {
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) console.error(error);
      else setProfiles(data);
    }

    fetchProfiles();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Profiles Test</h1>
      <ul>
        {profiles.map((p) => (
          <li key={p.id}>{p.full_name} – {p.role}</li>
        ))}
      </ul>
    </div>
  );
}
