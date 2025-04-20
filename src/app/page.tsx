import InfoBubble from "@/components/infoBubble";
import UploadVideo from "@/components/uploadVideo";
import Image from "next/image";
import GoosianceName from "@/assets/GooseLogo.webp";

import { Irish_Grover } from "next/font/google";
const irsih = Irish_Grover({ subsets: ["latin"], weight: "400" });

const Home = () => {
  return (
    <div
      className={`flex flex-col ${irsih.className} items-center gap-6 p-6 bg-gradient-to-b from-goose-red-419 to-goose-red-419 min-h-screen leading-none tracking-wider`}
    >
      <Image
        src={GoosianceName}
        alt="Title"
        className="w-[60%] md:[25%] lg:w-[80%] ml-4 mb-5"
      />

      <UploadVideo />

      <InfoBubble
        text="What is Goosiance?"
        height={100}
        width={400}
        textSize={35}
      />

      <InfoBubble
        text="Goosiance is a next-generation LED system that instantly transforms your space to match a film’s emotion. As scenes shift — from deep blue sadness to fiery red action — Goosiance reacts in real time, pulling you deeper into the story and making every moment feel alive."
        height={200}
        width={1000}
        textSize={25}
      />

      <InfoBubble
        text="How To Use Goosiance?"
        height={100}
        width={500}
        textSize={35}
      />
      <InfoBubble
        text="Simply upload your video — we’ll handle the rest. Make sure your ambient lighting is set up and connected according to the instruction manual. Then sit back, relax, and enjoy your entertainment right here."
        height={200}
        width={1000}
        textSize={25}
      />
    </div>
  );
};

export default Home;
