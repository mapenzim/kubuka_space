"use client";

import { createPrivateMessage } from "@/app/actions/mainActions.server";
import Fading from "@/components/fade";
import Loading from "@/components/loading";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const MessageForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setIsLoading(true);

    try {
      const res = await createPrivateMessage(form);
      if ("error" in res) return toast.error(res.error.message);
      toast.success("Message was sent to admin.");
      return;
    } catch (error: any) {
      toast.error(error?.message || "Unexpected error occured.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className=""
      onSubmit={handleSubmit}
    >
      <fieldset disabled={isLoading} className="opacity-90">
        <Fading direction="up" delay={0.8} fullWidth padding={0}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <input
                type="text"
                className="peer p-3 bg-white rounded text-sm shadow w-full"
                placeholder="Names"
                name="names"
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <input
                type="email"
                className="peer p-3 bg-white rounded text-sm shadow w-full"
                placeholder="Email"
                name="email"
                required
              />
            </div>
            <div className="col-span-6">
              <textarea
                className="w-full rounded text-sm shadow bg-gray-50 p-2"
                placeholder="Type a message..."
                rows={8}
                name="message"
                required
              ></textarea>
            </div>
            <div className="col-span-6">
              <div className="flex items-end text-center">
                <button
                  className="flex flex-row gap-2 bg-green-400 text-white active:bg-gray-700 text-sm font-light uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 cursor-pointer"
                  type="submit"
                  style={{ transition: "all .15s ease" }}
                >
                  {isLoading && <Loading />} Send Message
                </button>
              </div>
            </div>
          </div>
        </Fading>
      </fieldset>
    </form>
  );
}

export { MessageForm };
