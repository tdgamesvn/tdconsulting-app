import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function SignupPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async ({ email, password, full_name, phone_number }: any) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);

    await supabase.from("profiles").insert({
      id: data.user?.id,
      full_name,
      phone_number,
      role: "COLLABORATOR"
    });

    alert("Đăng ký thành công! Mời đăng nhập.");
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-xl font-bold mb-4">Đăng ký</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("email")} placeholder="Email" className="input" />
        <input {...register("password")} type="password" placeholder="Password" className="input" />
        <input {...register("full_name")} placeholder="Họ tên" className="input" />
        <input {...register("phone_number")} placeholder="Số điện thoại" className="input" />
        <button className="btn">Đăng ký</button>
      </form>
    </div>
  );
}
