import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ email, password }: any) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push("/");
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-xl font-bold mb-4">Đăng nhập</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("email")} placeholder="Email" className="input" />
        <input {...register("password")} type="password" placeholder="Password" className="input" />
        <button className="btn">Đăng nhập</button>
      </form>
    </div>
  );
}
