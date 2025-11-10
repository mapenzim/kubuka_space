import { MessageForm } from "./private_message/message_form";

const MessageSection = () => {
  return (
    <section id="contact-us" className="relative block w-full min-h-screen items-center justify-center pt-16 pb-16 lg:pb-32 bg-violet-900">
      <div
        className="bottom-0 top-0 left-0 right-0 w-full relative pointer-events-none overflow-hidden -mt-36"
        style={{ height: "80px" }}
      >
        <svg
          className="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            className="fill-violet-900"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
      <div className="flex-auto card p-5 mt-16 lg:p-10 w-[96%] lg:w-1/2 mx-auto">
        <h4 className="text-2xl font-semibold text-gray-200">
          Reach to us for more.
        </h4>
        <p className="leading-relaxed mt-1 mb-4 text-gray-400">
          Complete this form and we will get back to you within 24 hours.
        </p>
        {/** Form Area */}
        <MessageForm />
      </div>
    </section>
  );
}

export default MessageSection;