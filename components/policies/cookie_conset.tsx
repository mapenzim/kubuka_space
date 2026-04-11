"use client";

import CookieConsent from "react-cookie-consent";

export default function AppCookieConsent() {
  const handleDecline = () => {
    // ⏱️ expire in 2 minutes
    const expires = new Date(Date.now() + 2 * 60 * 1000).toUTCString();

    document.cookie = `myWebsiteCookieConsent=false; path=/; expires=${expires}`;

    // Optional: hide immediately
    window.location.reload();
  };

  return (
    <CookieConsent
      location="bottom"
      cookieName="myWebsiteCookieConsent"
      expires={365}
      disableStyles // 👈 we fully control styling
      containerClasses="fixed bottom-4 left-1/2 -translate-x-1/2 z-9999"
      contentClasses=""
      buttonClasses="hidden"
      declineButtonClasses="hidden"
      enableDeclineButton
      onAccept={() => console.log("Cookies accepted")}
      onDecline={handleDecline}
    >
      <div className="relative w-[90vw] max-w-md bg-white text-gray-700 p-5 md:p-6 rounded-xl shadow-xl border border-gray-200">

        {/* 🍪 Floating Image */}
        <img
          src="/svgs/cookieImage.svg"
          alt="Cookies"
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16"
        />

        {/* 🧠 Header */}
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 text-center mt-6">
          Your privacy matters
        </h2>

        {/* 📄 Description */}
        <p className="mt-3 text-sm text-center leading-relaxed">
          We use cookies to improve your experience, analyze traffic, and
          personalize content. Learn more in our{" "}
          <a href="#" className="underline font-medium hover:text-indigo-600">
            Privacy Policy
          </a>.
        </p>

        {/* ⚙️ Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">

          <button
            onClick={() => {
              document.cookie =
                "myWebsiteCookieConsent=false; path=/; max-age=31536000";
              window.location.reload();
            }}
            className="w-full sm:w-auto px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition"
          >
            Decline
          </button>

          <button
            onClick={() => {
              document.cookie =
                "myWebsiteCookieConsent=true; path=/; max-age=31536000";
              window.location.reload();
            }}
            className="w-full sm:w-auto px-5 py-2 text-sm rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-95 transition"
          >
            Accept All
          </button>
        </div>

        {/* 🔗 Footer link */}
        <div className="mt-4 text-center">
          <a href="#" className="text-xs underline hover:text-indigo-600">
            More options
          </a>
        </div>
      </div>
    </CookieConsent>
  );
}