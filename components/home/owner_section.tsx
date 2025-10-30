import Image from "next/image";
import Link from "next/link";

const owners = [
  {
    name: "Mulumbe Chaliyanika",
    position: "Co-Founder - Managing Director",
    phone: '+263 77 640 3338',
    email: 'chaliyanikamm@gmail.com',
    image: "muluc3",
    imgDescription: "Mulumbe C",
    bio: "General accountant, Tech enthusaiast, Small Business Start-up and Business mentorship trainer. Business financing and outsourcing, general staff managemenet techniques, organisational visioning, and identifying talent.",
    children: [
      {
        name: "facebook",
        url: "https://www.facebook.com/mulumbe.chaliyanika",
      },
      {
        name: "twitter",
        url: "https://twitter.com/mulumbechaliyanika",
      },
      {
        name: "instagram",
        url: "https://instagram.com/mulumbechaliyanika",
      }
    ]
  },
  {
    name: "Busongo Mweembe",
    position: "Co-Founder",
    phone: '+263 77 662 5192',
    email: 'info@kubukaspace.com',
    image: "busom",
    imgDescription: "Busongo",
    bio: "Electrical engineer, web developer and all things between. CNC Progammer, small projects management techniques and business development start-ups. Also does hardware projects in Robotics, IoT, AI, and home electronics.",
    children: [
      {
        name: "facebook",
        url: "https://www.facebook.com/busongo.mweembe",
      },
      {
        name: "twitter",
        url: "https://twitter.com/busongomweembe",
      },
      {
        name: "instagram",
        url: "https://instagram.com/busongomweembe",
      }
    ]
  },
  {
    name: "Mapenzi Mudimba",
    position: "Co-Founder - Web Master",
    image: "mape",
    phone: '+263 77 715 1673',
    email: 'hazelman@live.com',
    imgDescription: "Mapenzi",
    bio: "Trained in informatics, data science and metadata algorithms. Business start-uper, Strategic thinker and go getter. This site's design, coding, and implementation in his mandate. Web frameworks, IoT, Cloud Computing, Coding, and hobbying.",
    children: [
      {
        name: "facebook",
        url: "https://www.facebook.com/mapenzi.mudimba",
      },
      {
        name: "twitter",
        url: "https://twitter.com/mapenzimudimba",
      },
      {
        name: "instagram",
        url: "https://instagram.com/mapenzimudimba",
      },
      {
        name: "github",
        url: "https://github.com/HilmaM",
      }
    ]
  },
];

const OwnerSection = () => {
  return (
    <section
      id="about-us"
      className="min-h-screen w-full px-4 pt-16 pb-24 bg-gradient-to-r from-fuchsia-50 via-indigo-100 to-purple-200"
    >
      <div className="mx-auto px-4">
        <div className="flex flex-wrap justify-center text-center mb-16">
          <div className="w-full lg:w-6/12 px-4">
            <h2 className="text-4xl font-semibold">
              This company is owned by
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-around gap-5">
          {owners.map((owner) => {
            return (
              <div
                className="card group w-96 md:w-1/2 lg:w-1/4 lg:mb-0 mb-12 p-4 overflow-hidden"
                key={owner.name}
              >
                <figure>
                  <Image
                    alt="..."
                    src={`/images/${owner.image}.png`}
                    className="shadow-lg rounded-full max-w-full mx-auto"
                    style={{ maxWidth: "120px" }}
                    width={100}
                    height={100}
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h5 className="card-title text-xl font-bold">
                    {owner.name}
                  </h5>
                  <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                    {owner.position}
                  </p>
                  <p className="mt-1 text-gray-500">
                    {owner.phone}
                  </p>
                  <p className="mt-1 text-gray-500">
                    {owner.email}
                  </p>
                  <p className="mt-1 text-gray-500 text-justify">
                    {owner.bio}
                  </p>
                  <div className="my-5 flex flex-row justify-around items-center">
                    {owner.children.map((it) =>
                    (
                      <Link
                        className="bg-transparent shadow-none border-none w-8 h-8 rounded-full outline-none focus:outline-none even:mx-4"
                        key={it.name}
                        href={it.url}
                        target="_blank"
                      >
                        <Image
                          src={`/images/${it.name}.png`} 
                          className="h-6 w-6" 
                          width={16}
                          height={16}
                          alt=".."
                        />
                      </Link>
                    )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default OwnerSection;