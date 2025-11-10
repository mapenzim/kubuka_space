"use client";

import { useEffect, useState, FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useAnimationControls } from "framer-motion";
import { EyeIcon, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { createUser, resetPasswordAction, changePasswordAction } from "@/app/actions/authActions.server";
import Divider from "@/components/divider";
import Fading from "@/components/fade";
import Loading from "@/components/loading";

export const VARIANTS = {
  login: "LOGIN",
  register: "REGISTER",
  reset: "RESET PASSWORD",
  change: "CHANGE PASSWORD",
};

const Authentication = () => {
  const [variant, setVariant] = useState(VARIANTS.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const controls = useAnimationControls();

  const isLogin = variant === VARIANTS.login;
  const isRegister = variant === VARIANTS.register;
  const isReset = variant === VARIANTS.reset;
  const isChange = variant === VARIANTS.change;

  const changeVariant = async (next: string) => {
    await controls.start({ x: -500, opacity: 0, transition: { duration: 0.4 } });
    setVariant(next);
    await controls.start({ x: 0, opacity: 1, transition: { duration: 0.4 } });
  };

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      const redirect =
        role === "ADMIN"
          ? "/admin"
          : role === "EDITOR"
          ? "/admin/posts"
          : "/dashboard";
      router.replace(redirect);
    }
  }, [status, session, router]);

  if (status === "authenticated") return null;

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setIsLoading(true);

    try {
      // RESET PASSWORD
      if (isReset) {
        const res = await resetPasswordAction(form.get("email") as string);
        if ("error" in res) return toast.error(res.error.message);
        toast.success("Reset link sent!");
        changeVariant(VARIANTS.change);
        router.replace(`/auth?token=${res.token}`);
        return;
      }

      // LOGIN
      if (isLogin) {
        const res = await signIn("credentials", {
          redirect: false,
          email: form.get("email"),
          password: form.get("password"),
        });
        if (res?.error) return toast.error("Invalid credentials");
        toast.success("Logged in successfully!");
        router.push(callbackUrl);
        return;
      }

      // REGISTER
      if (isRegister) {
        const password = form.get("password") as string;
        const confirm = form.get("confirmPassword") as string;
        if (password !== confirm) return toast.error("Passwords do not match");

        const res = await createUser(form);
        if ("error" in res) return toast.error(res.error.message);
        toast.success("User created successfully!");
        e.currentTarget.reset();
        return;
      }

      // CHANGE PASSWORD
      if (isChange) {
        const res = await changePasswordAction(token, form.get("password") as string);
        if ("error" in res) return toast.error(res.error.message);
        toast.success("Password changed successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 1, x: 0 }} animate={controls}>
      <Fading direction="top" delay={0.8} fullWidth padding={0}>
        <Divider>
          {(isLogin && VARIANTS.login) ||
            (isRegister && VARIANTS.register) ||
            (isReset && VARIANTS.reset) ||
            (isChange && VARIANTS.change)}
        </Divider>
      </Fading>

      <form onSubmit={onSubmitHandler}>
        <fieldset disabled={isLoading} className="opacity-90">
          <Fading direction="left" delay={0.6} fullWidth padding={0}>
            <div className="relative flex flex-col items-end mt-2">
              {isRegister && (
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full mb-4 p-2 border rounded"
                />
              )}

              {(isLogin || isRegister || isReset) && (
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full mb-4 p-2 border rounded"
                />
              )}

              {(isLogin || isRegister) && (
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full mb-4 p-2 border rounded"
                  />
                  <span
                    className="absolute right-2 top-2 text-sm text-blue-600 cursor-pointer"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? <EyeOff /> : <EyeIcon />}
                  </span>
                </div>
              )}

              {isRegister && (
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full mb-4 p-2 border rounded"
                />
              )}

              {isLogin ? (
                <>
                  <span
                    className="-mr-3 w-max cursor-pointer p-3"
                    onClick={() => changeVariant(VARIANTS.reset)}
                  >
                    <span className="text-sm text-blue-600">Forgot password?</span>
                  </span>
                  <span
                    className="-mr-3 w-max cursor-pointer p-3"
                    onClick={() => changeVariant(VARIANTS.register)}
                  >
                    <span className="text-sm text-blue-600">Don't have an account?</span>
                  </span>
                </>
              ) : (
                <div className="relative flex flex-col items-end">
                  <span
                    className="-mr-3 w-max cursor-pointer p-3"
                    onClick={() => changeVariant(VARIANTS.login)}
                  >
                    <span className="text-sm text-blue-600">Back to Login?</span>
                  </span>
                </div>
              )}
            </div>
          </Fading>

          <Fading delay={0.8} direction="left" fullWidth padding={0}>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-sky-500 text-white hover:bg-sky-600 focus:bg-sky-600 px-3 py-1 rounded-md flex flex-row gap-2"
            >
              {isLoading && <Loading />}
              {(isLogin && VARIANTS.login) ||
                (isRegister && VARIANTS.register) ||
                (isReset && VARIANTS.reset) ||
                (isChange && VARIANTS.change)}
            </button>
          </Fading>
        </fieldset>
      </form>
    </motion.div>
  );
};

export default Authentication;
