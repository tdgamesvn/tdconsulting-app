"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
    full_name: z.string().min(1, "Họ tên không được bỏ trống"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().optional(),
    cv: z
      .instanceof(FileList)
      .refine((files) => files.length > 0, {
        message: "Vui lòng chọn 1 file CV (.pdf)",
      }),
  });  

type FormData = z.infer<typeof formSchema>;

export default function AddCandidateModal({ jobId }: { jobId: number }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setLoading(true);
    try {
      const file = data.cv[0];
      const filePath = `public/${user.id}/${data.full_name}-${Date.now()}.pdf`;

      const { error: uploadError } = await supabase.storage.from("cvs").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: candidate, error: insertError } = await supabase
        .from("candidates")
        .insert({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          cv_storage_path: filePath,
          created_by: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const { error: appError } = await supabase.from("applications").insert({
        job_id: jobId,
        candidate_id: candidate.id,
        submitted_by: user.id,
        status: "CHO_ADMIN_DUYET",
      });

      if (appError) throw appError;

      alert("Ứng viên đã được nộp thành công!");
      setOpen(false);
      reset();
    } catch (err) {
      console.error("Error:", err);
      alert("Đã có lỗi xảy ra.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mt-4">🚀 Nộp ứng viên</Button>
      </DialogTrigger>
  
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Nộp ứng viên mới</DialogTitle>
        </DialogHeader>
  
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Họ và tên</Label>
            <Input {...register("full_name")} />
            {errors.full_name && (
              <p className="text-red-500 text-sm">{errors.full_name.message}</p>
            )}
          </div>
  
          <div>
            <Label>Email</Label>
            <Input {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
  
          <div>
            <Label>Số điện thoại</Label>
            <Input {...register("phone")} />
          </div>
  
          <div>
            <Label>CV (PDF)</Label>
            <Input type="file" accept=".pdf" {...register("cv")} />
            {errors.cv && (
              <p className="text-red-500 text-sm">{errors.cv.message}</p>
            )}
          </div>
  
          <Button type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Nộp ứng viên"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );  
}
