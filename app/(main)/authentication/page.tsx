"use client";

import { useEffect, useState, SyntheticEvent } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AtSignIcon, CircleEllipsisIcon, EyeIcon, EyeOff, User2Icon } from "lucide-react";
import { toast } from "sonner";
import { createUser } from "@/app/actions/authActions.server";
import Divider from "@/components/divider";
import Fading from "@/components/fade";
import Loading from "@/components/loading";
import Turnstile from "react-turnstile";
import Image from "next/image";
import Link from "next/link";

const VARIANTS = {
  login: "LOGIN",
  register: "REGISTER",
} as const;

type AuthenticationVariant = (typeof VARIANTS)[keyof typeof VARIANTS];

function safeCallbackUrl(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

const AuthenticationPage = () => {
  const [variant, setVariant] = useState<AuthenticationVariant>(VARIANTS.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [accountCaptchaToken, setAccountCaptchaToken] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));
  const accountInactive = searchParams.get("account") === "inactive";
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY_SIGNUP_FORM;

  const changeVariant = (next: AuthenticationVariant) => {
    setVariant(next);
    setShowPassword(false);
    setAccountCaptchaToken(null);
    setTurnstileKey((current) => current + 1);
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.status && session.user.status !== "ACTIVE") {
        void signOut({ redirect: false }).then(() => {
          toast.error("This account is suspended or archived.");
          router.replace("/authentication?account=inactive");
        });
        return;
      }

      const role = session?.user?.role;
      const redirect =
        role === "ADMIN" || role === "SUPERUSER" ? "/admin" :
        role === "EDITOR" ? "/admin/posts" :
        callbackUrl;
      router.replace(redirect);
    }
  }, [callbackUrl, status, session, router]);

  const onSubmitHandler = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    setIsLoading(true);

    try {
      if (variant === VARIANTS.login) {
        const email = String(form.get("email") ?? "").trim().toLowerCase();
        const password = String(form.get("password") ?? "");

        if (!email || !password) {
          toast.error("Email and password are required.");
          return;
        }

        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          toast.error("Unable to sign in. Check your credentials and account status.");
          return;
        }

        toast.success("Logged in successfully!");
        return;
      }

      if (variant === VARIANTS.register) {
        if (!turnstileSiteKey) {
          toast.error("Account registration is temporarily unavailable.");
          return;
        }

        if (!accountCaptchaToken) {
          toast.error("Please complete the captcha.");
          return;
        }

        const password = form.get("password") as string;
        const confirm = form.get("confirmPassword") as string;
        if (password !== confirm) return toast.error("Passwords do not match");
        form.append("captchaToken", accountCaptchaToken);

        const res = await createUser(form);
        setTurnstileKey((current) => current + 1);
        setAccountCaptchaToken(null);

        if ("error" in res) return toast.error(res.error.message);

        formElement.reset();

        const loginResult = await signIn("credentials", {
          redirect: false,
          email: String(form.get("email") ?? "").trim().toLowerCase(),
          password,
        });

        if (loginResult?.error) {
          toast.success("Account created. Please sign in.");
          changeVariant(VARIANTS.login);
          return;
        }

        toast.success("Account created successfully!");
        return;
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "authenticated") {
    return (
      <div className="rounded-xl bg-white/90 px-6 py-8 text-center text-sm text-zinc-600 shadow-xl dark:bg-zinc-900/90 dark:text-zinc-300">
        Redirecting to your account…
      </div>
    );
  }

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
          <Image
            src="/images/Kubuka_Logo.png"
            alt="Logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <Fading direction="top" delay={0.8} fullWidth padding={0}>
          <Divider>{variant}</Divider>
        </Fading>

        <form onSubmit={onSubmitHandler} className="relative">
          <fieldset disabled={isLoading || status === "loading"} className="opacity-90">
            {accountInactive && (
              <p role="alert" className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                This account is suspended or archived.
              </p>
            )}
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
                      required
                      className="w-full rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-600 dark:border-gray-500 p-2 pl-10 pr-10 text-gray-900 focus:border-sky-500 focus:ring-sky-500 dark:text-gray-200"
                    />
                    <User2Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                )}

                {(variant === VARIANTS.login || variant === VARIANTS.register) && (
                  <div className="relative w-full mb-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      required
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
                      autoComplete={variant === VARIANTS.register ? "new-password" : "current-password"}
                      minLength={variant === VARIANTS.register ? 8 : undefined}
                      required
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
                      autoComplete="new-password"
                      minLength={8}
                      required
                      className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 pl-10 pr-10 text-gray-900 focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                    />
                  </div>
                )}
                <div className="my-3 flex flex-col justify-between text-sm text-sky-600 dark:text-gray-400">
                  {/** check for captcha verification during signup */}
                  {variant === VARIANTS.register && !accountCaptchaToken && turnstileSiteKey && (
                    <Turnstile
                      key={turnstileKey}
                      sitekey={turnstileSiteKey}
                      onVerify={(token) => setAccountCaptchaToken(token)}
                      onExpire={() => setAccountCaptchaToken(null)}
                      onError={() => {
                        setAccountCaptchaToken(null);
                        toast.error("Captcha could not be loaded. Please try again.");
                      }}
                    />
                  )}
                  {variant === VARIANTS.register && !turnstileSiteKey && (
                    <p role="alert" className="text-center text-red-600 dark:text-red-300">
                      Account registration is temporarily unavailable.
                    </p>
                  )}
                  {variant === VARIANTS.login && (
                    <>
                      <Link href="/contact_us" className="text-center hover:underline">
                        Forgot password?
                      </Link>
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
                disabled={isLoading || status === "loading"}
                className="w-full rounded-md bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-2 text-white font-semibold shadow hover:from-sky-600 hover:to-indigo-600 focus:ring-2 focus:ring-sky-400 flex items-center justify-center gap-2 dark:from-gray-400 dark:to-zinc-600 dark:text-gray-800 dark:hover:from-gray-500 dark:hover:to-zinc-700 dark:focus:ring-gray-400"

              >
                {(isLoading || status === "loading") && <Loading />}
                {(variant === VARIANTS.login && VARIANTS.login) ||
                  (variant === VARIANTS.register && VARIANTS.register)}
              </button>
            </Fading>
          </fieldset>
        </form>
      </motion.div>
    </AnimatePresence>
  );
  
}
 
export default AuthenticationPage;
