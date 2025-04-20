import InfoBubble from "@/components/infoBubble";
import UploadVideo from "@/components/uploadVideo";
import Image from "next/image";
import GoosianceName from "@/assets/GoosianceName.webp";

const Home = () => {
  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gradient-to-b from-goose-red-419 to-goose-red-419 min-h-screen font-irish leading-none tracking-wider">
      <Image
        src={GoosianceName}
        alt="Title"
        className="w-[60%] md:[25%] lg:w-[50%] ml-4 mb-5"
      />

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

      <UploadVideo/>

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
