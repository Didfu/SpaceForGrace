import { BackButton } from "@/components/ui/BackButton";
export const metadata = {
    title: "About",
    description: "Learn more about the purpose behind Space for Grace.",
  };
  
  export default function AboutPage() {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <BackButton />
        <h1 className="text-4xl font-bold text-center mb-4">About</h1>
        <p className="text-lg text-black-700 text-justify mb-10">
          These blogs would be a rough sketch of what goes in my mind when things take place out in the world. Being given this spiritual vision to see with faith and purpose beyond the material senses of the mundane life, I’m making a meagre effort to write it down for reflections and share them with friends and loved ones for their enjoyment only.
          <br /><br />
          All glories to the readers!
        </p>
  
        <div className="flex justify-center">
          <div className="max-w-sm p-4 rounded-xl border border-[#807431FF] shadow-sm bg-neutral-100 flex items-start gap-4">
            <img
              src="/images/pic.png"
              alt="Dhruv Mahyavanshi"
              className="w-16 h-16 rounded-full border border-[#807431FF] object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">Dhruv Mahyavanshi</h2>
              <p className="text-sm text-gray-700 mt-2">
                A work in progress, trying serve the Supreme Lord, His devotees and the world at large.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }
  