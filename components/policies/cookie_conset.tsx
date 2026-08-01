"use client";
import { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";

export default function AppCookieConsent() {
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setIsDev(true);
    }
  }, []);

  const resetConsent = () => {
    document.cookie =
      "myWebsiteCookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  };

  return (
    <>
      <CookieConsent
        location="bottom"
        enableDeclineButton
        declineButtonText="Decline"
        buttonText="Accept All"
        cookieName="myWebsiteCookieConsent"
        style={{
          background: "#2ae",
          padding: "20px",
          zIndex: 1000,
          borderRadius: "8px",
          maxWidth: "400px",
          maxHeight: "300px",
          margin: "0 auto",
          left: "20px",
          marginBottom: "20px",
        }}
        buttonStyle={{
          color: "#fff",
          fontSize: "14px",
          background: "#27ae60",
          padding: "6px 10px",
          borderRadius: "4px",
          position: "absolute",
          right: "10px",
          bottom: "10px",
        }}
        declineButtonStyle={{
          color: "#fff",
          background: "#c0392b",
          fontSize: "14px",
          padding: "6px 10px",
          borderRadius: "4px",
          position: "absolute",
          left: "32px",
          bottom: "10px",
        }}
        expires={365}
        onAccept={() => undefined}
        onDecline={() => undefined}
      >
        <div className="flex flex-col items-center w-full bg-transparent text-sm pb-10">
          {/* Header */}
          <div className="flex items-center justify-center relative w-full gap-2 pb-3">
            <img
              className="absolute -top-16"
              src="/svgs/cookieImage.svg"
              alt="cookieImage"
            />
            <h2 className="text-gray-800 text-xl font-medium text-left w-full pt-3">
              Your privacy is important to us
            </h2>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-justify">
            We process your personal information to measure and improve our site
            and services, assist our campaigns, and provide personalised content.
            For more information, see our{" "}
            <a href="/cookie_policy" className="font-medium underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </CookieConsent>

      {/* Developer-only reset button */}
      {isDev && (
        <button
          type="button"
          onClick={resetConsent}
          className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-md hover:bg-red-700 transition"
        >
          Reset Cookie Consent
        </button>
      )}
    </>
  );
}
