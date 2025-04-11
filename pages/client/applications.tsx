import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type Application = {
  id: number;
  status: string;
  candidates: {
    full_name: string;
    email: string;
    phone: string;
  };
  jobs: {
    title: string;
    company_name: string;
    client_id: string;
  };
};

export default function ClientApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select(`
        id, status,
        candidates ( full_name, email, phone ),
        jobs ( title, company_name, client_id )
      `)
      .eq("status", "CHO_CLIENT_DUYET")
      .eq("jobs.client_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh sách ứng viên");
    } else {
      setApplications((data ?? []) as unknown as Application[]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: number, status: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      toast.error("Cập nhật trạng thái thất bại!");
    } else {
      toast.success("Cập nhật thành công!");
      fetchApplications();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Duyệt ứng viên</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Họ tên</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Điện thoại</th>
              <th className="border px-4 py-2">Vị trí</th>
              <th className="border px-4 py-2">Công ty</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td className="border px-4 py-2">{app.candidates.full_name}</td>
                <td className="border px-4 py-2">{app.candidates.email}</td>
                <td className="border px-4 py-2">{app.candidates.phone}</td>
                <td className="border px-4 py-2">{app.jobs.title}</td>
                <td className="border px-4 py-2">{app.jobs.company_name}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <Button
                    variant="success"
                    onClick={() => updateStatus(app.id, "CLIENT_DUYET")}
                  >
                    ✅ Duyệt
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => updateStatus(app.id, "TU_CHOI_CLIENT")}
                  >
                    ❌ Từ chối
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
