"use client";

import { createUser } from "@/app/actions/adminActions";
import Divider from "@/components/divider";
import Fading from "@/components/fade";
import Loading from "@/components/loading";
import { motion, useAnimationControls } from "framer-motion";
import { EyeIcon, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

export const VARIANTS = {
  login :'LOGIN',
  register :'REGISTER',
  reset :'RESET PASSWORD',
  change: 'CHANGE PASSWORD',
}

const Authentication = () => {
  const [variant, setVariant] = useState(VARIANTS.login);
  const [showPassword, setShowPassword] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const controls = useAnimationControls();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const router = useRouter();
  
  const isLogin = variant === VARIANTS.login;
  const isRegister = variant === VARIANTS.register;
  const isReset = variant === VARIANTS.reset;
  const isChange = variant === VARIANTS.change;

  //const { data: session, status } = useSession();
  
  const changeVariant = async (nextVariant: string) => {
    setShowMessage(null);
    await controls.start({ x: -500, opacity: 0, transition: { duration: 0.4 } });
    setVariant(nextVariant);
    await controls.start({ x: 0, opacity: 1, transition: { duration: 0.4 } });
  };

  /*useEffect(() => {
    if (status === "authenticated") {
      const role = session.user?.role;
      const redirectUrl =
        role === "ADMIN"
          ? "/admin"
          : role === "EDITOR"
          ? "/admin/posts"
          : "/dashboard";

      router.replace(redirectUrl);
    }
  }, [status, session, router]);

  if (status === "authenticated") return null;*/

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    if (isReset) {
      startTransition(() => {
        /*try {
          await resetPasswordAction(values.email).then((res) => {
            if (res?.error) {
              toast.error(res?.error?.message);
            } else {
              changeVariant(VARIANTS.change);
              toast.success("Done!");
              router.replace(`/auth?token=${res.token}`)
            }
          });
        } catch (error:any) {
          toast.error(error?.message || 'Error');
        }*/
       console.log("reset password");
      });
    }
    if (isLogin) {
      const email = form.get("email") as string;
      const password = form.get("password") as string;

      startTransition(async () => {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        if (res?.error) {
          setShowMessage("Invalid credentials");
        } else {
          router.push(callbackUrl);
        }
      });
    }
    if (isRegister) {
      startTransition(async () => {
        await createUser(form); // server action
        e.currentTarget.reset();
      });
    }
    /*if (isChange) {
      await changePasswordAction(token, values.password).then((res) => {
        if (res?.error) {
          toast.error(res?.error?.message);
        } else {
          toast.success("Done.");
        }
      });
    }*/
  };

  //if (status === "authenticated") return null;

  return (
    <motion.div initial={{ opacity: 1, x: 0 }} animate={controls}>
      <Fading direction="top" delay={0.8} fullWidth padding={0}>
        <Divider 
          children={
            (isLogin && VARIANTS.login) ||
            (isRegister && VARIANTS.register) ||
            (isReset && VARIANTS.reset) ||
            (isChange && VARIANTS.change)
          }
        />
      </Fading>
      <form onSubmit={onSubmitHandler} className="">
        <fieldset disabled={isPending} className="opacity-90">
          <Fading direction="left" delay={0.6} fullWidth padding={0}>
            <div className="relative flex flex-col items-end mt-2">
              {isRegister && (
                <>
                  <input type="text" name="name" placeholder="Name" className="w-full mb-4 p-2 border rounded" />
                </>
              )}

              {(isLogin || isRegister || isReset) && (
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
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
                      {showPassword 
                        ? <EyeOff />
                        : <EyeIcon />
                      }
                    </span>
                </div>
              )}
              {isRegister && 
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Confirm Password"
                  className="w-full mb-4 p-2 border rounded"
                />
              }
              {isLogin ? (
                <>
                <span
                  className="-mr-3 w-max cursor-pointer p-3"
                  onClick={() => changeVariant(VARIANTS.reset)}
                >
                  <span className="text-sm tracking-wide text-blue-600">Forgot password ?</span>
                </span>
                <span
                  className="-mr-3 w-max cursor-pointer p-3"
                  onClick={() => changeVariant(VARIANTS.register)}
                >
                  <span className="text-sm tracking-wide text-blue-600">Don't have an account ?</span>
                </span>
                </>
              ) : (
                <div className="relative flex flex-col items-end">
                  <span
                    className="-mr-3 w-max cursor-pointer p-3"
                    onClick={() => changeVariant(VARIANTS.login)}
                  >
                    <span className="text-sm tracking-wide text-blue-600">Back to Login ?</span>
                  </span>
                </div>
              )}
              {showMessage && (
                <p className="text-center text-sm text-red-500 mt-2">{showMessage}</p>
              )}
            </div>
          </Fading >
          <Fading delay={0.8} direction="left" fullWidth padding={0}>
            <button
              type="submit"
              disabled={isPending}
              className="bg-sky-500 text-primary-foreground hover:hover:bg-sky-600 focus:bg-sky-600 active:bg-sky-800 px-3 py-1 rounded-md text-gray-100 flex flex-row gap-2"
            >
              {isPending && <Loading />}
              {
                (isLogin && VARIANTS.login) ||
                (isRegister && VARIANTS.register) ||
                (isReset && VARIANTS.reset) ||
                (isChange && VARIANTS.change)
              }
            </button>
          </Fading>
        </fieldset>
      </form>
    </motion.div>
  );
}

export default Authentication;
