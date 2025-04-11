import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function JobListPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "OPEN")
        .in("visibility_role", ["ALL", "COLLABORATOR"]);

      if (!error) setJobs(data || []);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  if (loading) return <p>Đang tải jobs...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách công việc</h1>
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li key={job.id} className="border p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.company_name}</p>
            <p>{job.location} | {job.commission} | {job.category}</p>
            <a
              href={`/opening-positions/${job.id}`}
              className="text-blue-500 underline mt-2 inline-block"
            >
              Xem chi tiết
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
