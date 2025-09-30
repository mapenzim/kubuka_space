"use client";

import { FrownIcon, ThumbsUp, X } from "lucide-react";
import toast, { ToastBar, Toaster } from "react-hot-toast";

export default function Alert () {
  return (
    <Toaster
      toastOptions={{
        className: "p-1",
        position: "top-center",
        success: {
          style: {
            background: 'lime',
            color: "green",
          },
          iconTheme: {
            primary: "green",
            secondary: "lime"
          },
          icon: <ThumbsUp width={32} height={32} />
        },
        error: {
          style: {
            background: '#ec9d9f',
            color: "red",
          },
          iconTheme: {
            primary: "orange",
            secondary: "white",
          },
          icon: <FrownIcon width={32} height={32} />
        },
        duration: 10000,
      }}
      containerStyle={{
        top: 200
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({icon, message}) => (
            <div className="flex flex-row w-full h-full">
              <div className="w-16 border-r-2 border-indigo-500">
                {icon}
              </div>
              <div className="w-full">
                {message}
              </div>
              {t.type !== 'loading' && (
                <button 
                  onClick={() => toast.dismiss(t.id)}
                  className="w-10 h-8 bg-white rounded-full items-center justify-center"
                >
                  <X />
                </button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}