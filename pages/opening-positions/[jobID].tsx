import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AddCandidateModal from "@/components/AddCandidateModal"; // ✅ Import modal

export default function JobDetailPage() {
  const router = useRouter();
  const { jobID } = router.query;
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    if (!jobID) return;

    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobID as string) // ✅ ép kiểu về string
        .single();

      if (!error) setJob(data);
    };

    fetchJob();
  }, [jobID]);

  if (!job) return <p>Đang tải chi tiết công việc...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="text-gray-500">
        {job.company_name} – {job.location}
      </p>
      <p>{job.description}</p>

      <a
        href={
          supabase.storage
            .from("job_descriptions")
            .getPublicUrl(job.jd_storage_path).data.publicUrl
        }
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline mt-4 block"
      >
        📄 Tải JD
      </a>

      {/* ✅ Nút Upload ứng viên */}
      <AddCandidateModal jobId={job.id} />
    </div>
  );
}
