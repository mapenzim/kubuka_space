"use client";

import { useEffect, useState, SyntheticEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { AtSignIcon, CircleEllipsisIcon, EyeIcon, EyeOff, User2Icon } from "lucide-react";
import { toast } from "sonner";
import { createUser, resetPasswordAction, changePasswordAction } from "@/app/actions/authActions.server";
import Divider from "@/components/divider";
import Fading from "@/components/fade";
import Loading from "@/components/loading";
import Turnstile from "react-turnstile";

export const VARIANTS = {
  login: "LOGIN",
  register: "REGISTER",
  reset: "RESET PASSWORD",
  change: "CHANGE PASSWORD",
};

const AuthenticationPage = () => {
  const [variant, setVariant] = useState(VARIANTS.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState("signup");
  const [accountCaptchaToken, setAccountCaptchaToken] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const controls = useAnimationControls();

  const changeVariant = async (next: string) => {
    await controls.start({ x: -500, opacity: 0, transition: { duration: 0.4 } });
    setVariant(next);
    await controls.start({ x: 0, opacity: 1, transition: { duration: 0.4 } });
  };

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      const redirect =
        role === "ADMIN" ? "/admin" :
        role === "EDITOR" ? "/admin/posts" :
        callbackUrl;
      router.replace(redirect);
    }
  }, [status, session, router]);

  const onSubmitHandler = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    setIsLoading(true);

    try {
      if (variant === VARIANTS.reset) {
        const res = await resetPasswordAction(form.get("email") as string);
        if ("error" in res) return toast.error(res.error.message);
        toast.success("Reset link sent!");
        changeVariant(VARIANTS.change);
        router.replace(`/auth?token=${res.token}`);
        return;
      }

      if (variant === VARIANTS.login) {
        const email = form.get("email");
        const pwd = form.get("password");

        if (!email || !pwd) {
          toast.error("Email or Password required.");
          return;
        }

        const res = await signIn("credentials", {
          redirect: false,
          email,
          password: pwd,
        });

        if (res?.error) {
          toast.error("Invalid credentials");
          return;
        }

        toast.success("Logged in successfully!");

        setTimeout(() => {
          router.replace(callbackUrl);
        }, 50);

        return null;
      }

      if (variant === VARIANTS.register) {

        // 🚫 Block if captcha not completed 
        if (!accountCaptchaToken) {
          toast.error("Please complete the captcha.");
          return;
        }

        const password = form.get("password") as string;
        const confirm = form.get("confirmPassword") as string;
        if (password !== confirm) return toast.error("Passwords do not match");
        form.append("captchaToken", accountCaptchaToken);

        const res = await createUser(form);
        if ("error" in res) return toast.error(res.error.message);

        toast.success("User created successfully!");
        e.currentTarget.reset();
        
        // 🔄 Reset Turnstile widget by forcing re-render
        setTurnstileKey((prev) => prev + 1);
        setAccountCaptchaToken(null);

        return;
      }

      if (variant === VARIANTS.change) {
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

  if (status === "authenticated") return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={variant}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-xl bg-white/90 dark:bg-gray-800 shadow-xl pl-6 pr-6 pb-6 backdrop-blur-sm"
    
      >
        <div
          className="w-16 h-16"
        >
          <img
            src="/images/Kubuka_Logo.png"
            alt="Logo"
            className="object-contain"
          />
        </div>
        <Fading direction="top" delay={0.8} fullWidth padding={0}>
          <Divider>{variant}</Divider>
        </Fading>

        <form onSubmit={onSubmitHandler} className="relative">
          <fieldset disabled={isLoading} className="opacity-90">
            {/* Inputs */}
            {/* 🧠 Honeypot (hidden spam trap) */}
            <input
              type="text"
              name="company"
              className="hidden"
              autoComplete="off"
              tabIndex={-1}
            />
            {/* ...same as your code but with improved accessibility */} 
            <Fading direction="left" delay={0.6} fullWidth padding={0}>
              <div className="relative flex flex-col items-end mt-2">
                {variant === VARIANTS.register && (
                  <div className="relative w-full mb-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      autoComplete="name"
                      className="w-full rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-600 dark:border-gray-500 p-2 pl-10 pr-10 text-gray-900 focus:border-sky-500 focus:ring-sky-500 dark:text-gray-200"
                    />
                    <User2Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                )}

                {(variant === VARIANTS.login || variant === VARIANTS.register || variant === VARIANTS.reset) && (
                  <div className="relative w-full mb-4">
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 pl-10 pr-10 text-gray-900 focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                    />
                    <AtSignIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                )}

                {(variant === VARIANTS.login || variant === VARIANTS.register) && (
                  <div className="relative w-full mb-4">
                    {/* Leading icon */}
                    <CircleEllipsisIcon
                      className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />

                    {/* Password input */}
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 pl-10 pr-10 text-gray-900 focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                    />

                    {/* Toggle icon */}
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-3 text-gray-500 hover:text-sky-600 focus:outline-none"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? <EyeOff /> : <EyeIcon />}
                    </button>
                  </div>
                )}

                {variant === VARIANTS.register && (
                  <div className="relative w-full mb-4">
                    {/* Leading icon */}
                    <CircleEllipsisIcon
                      className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />

                    {/* Password input */}
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      autoComplete="current-confirm-password"
                      className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 pl-10 pr-10 text-gray-900 focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                    />
                  </div>
                )}
                <div className="my-3 flex flex-col justify-between text-sm text-sky-600 dark:text-gray-400">
                  {/** check for captcha verification during signup */}
                  {variant === VARIANTS.register && !accountCaptchaToken && (
                    <Turnstile
                      key={turnstileKey}
                      sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY_SIGNUP_FORM!}
                      onVerify={(token) => setAccountCaptchaToken(token)}
                      onExpire={() => setAccountCaptchaToken(null)}
                    />
                  )}
                  {variant === VARIANTS.login && (
                    <>
                      <button type="button" onClick={() => changeVariant(VARIANTS.reset)} className="hover:underline">
                        Forgot password?
                      </button>
                      <button type="button" onClick={() => changeVariant(VARIANTS.register)} className="hover:underline">
                        Create account
                      </button>
                    </>
                  )}
                  {variant !== VARIANTS.login && (
                    <button type="button" onClick={() => changeVariant(VARIANTS.login)} className="hover:underline">
                      Back to Login
                    </button>
                  )}
                </div>

              </div>
            </Fading>

            <Fading delay={0.8} direction="left" fullWidth padding={0}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-2 text-white font-semibold shadow hover:from-sky-600 hover:to-indigo-600 focus:ring-2 focus:ring-sky-400 flex items-center justify-center gap-2 dark:from-gray-400 dark:to-zinc-600 dark:text-gray-800 dark:hover:from-gray-500 dark:hover:to-zinc-700 dark:focus:ring-gray-400"

              >
                {isLoading && <Loading />}
                {(variant === VARIANTS.login && VARIANTS.login) ||
                  (variant === VARIANTS.register && VARIANTS.register) ||
                  (variant === VARIANTS.reset && VARIANTS.reset) ||
                  (variant === VARIANTS.change && VARIANTS.change)}
              </button>
            </Fading>
          </fieldset>
        </form>
      </motion.div>
    </AnimatePresence>
  );
  
}
 
export default AuthenticationPage;