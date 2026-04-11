"use client";

import { createPrivateMessage } from "@/app/actions/mainActions.server";
import Fading from "@/components/fade";
import Loading from "@/components/loading";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import Turnstile from "react-turnstile";

const MAX_LENGTH = 500;

const MessageForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    // 🚫 Block if captcha not completed
    if (!captchaToken) {
      toast.error("Please complete the captcha.");
      return;
    }

    const form = new FormData(formRef.current);
    form.append("captchaToken", captchaToken);

    setIsLoading(true);

    try {
      const res = await createPrivateMessage(form);

      if ("error" in res) {
        toast.error(res.error.message);
        return;
      }

      toast.success("Message was sent to admin.");

      // ✅ Reset everything cleanly
      formRef.current.reset();
      setMessage("");
      setCaptchaToken(null);

      // 🔄 Reset Turnstile widget by forcing re-render
      setTurnstileKey((prev) => prev + 1);

    } catch (error: any) {
      toast.error(error?.message || "Unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <fieldset disabled={isLoading} className="opacity-90">
        <Fading direction="up" delay={0.8} fullWidth padding={0}>
          <div className="grid grid-cols-6 gap-6">

            {/* 👤 Names */}
            <div className="col-span-6 sm:col-span-3">
              <input
                type="text"
                className="p-3 bg-white rounded text-sm shadow w-full"
                placeholder="Names"
                name="names"
                required
              />
            </div>

            {/* 📧 Email */}
            <div className="col-span-6 sm:col-span-3">
              <input
                type="email"
                className="p-3 bg-white rounded text-sm shadow w-full"
                placeholder="Email"
                name="email"
                required
              />
            </div>

            {/* 🧠 Honeypot (hidden spam trap) */}
            <input
              type="text"
              name="company"
              className="hidden"
              autoComplete="off"
              tabIndex={-1}
            />

            {/* 💬 Message */}
            <div className="col-span-6">
              <textarea
                className="w-full rounded text-sm shadow bg-gray-50 p-2"
                placeholder="Type a message..."
                rows={8}
                name="message"
                required
                maxLength={MAX_LENGTH}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              {/* 🔢 Character counter */}
              <div className="text-xs text-gray-500 mt-1 text-right">
                {message.length}/{MAX_LENGTH}
              </div>
            </div>

            {/* 🤖 CAPTCHA */}
            <div className="col-span-6">
              <Turnstile
                key={turnstileKey}
                sitekey={process.env.TURNSTILE_SITE_KEY_MESSAGE_FORM!}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
              />
            </div>

            {/* 🚀 Submit */}
            <div className="col-span-6">
              <div className="flex items-end text-center">
                <button
                  type="submit"
                  disabled={isLoading || !captchaToken}
                  className="flex items-center gap-2 bg-green-400 disabled:bg-gray-300 text-white text-sm uppercase px-6 py-3 rounded shadow hover:shadow-lg transition"
                >
                  {isLoading && <Loading />}
                  Send Message
                </button>
              </div>
            </div>

          </div>
        </Fading>
      </fieldset>
    </form>
  );
};

export { MessageForm };