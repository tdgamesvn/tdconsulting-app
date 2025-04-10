// pages/my-pipelines.tsx
import AuthGuard from "@/components/AuthGuard";

export default function MyPipelinesPage() {
  return (
    <AuthGuard>
      <h1 className="text-xl font-bold mb-4">My Pipelines</h1>
      {/* Nội dung dành cho user đã login */}
    </AuthGuard>
  );
}
