import InfoBubble from "@/app/infoBubble";

const Home = () => {
  return (
    <div className="">
      <>Hello World</>
      <InfoBubble
        text="What is Goosiance?"
        height={100}
        width={400}
        textSize={25}
      />
      <InfoBubble
        text="Goosiance is a next-generation LED system that instantly transforms your space to match a film’s emotion. As scenes shift — from deep blue sadness to fiery red action — Goosiance reacts in real time, pulling you deeper into the story and making every moment feel alive."
        height={200}
        width={1000}
        textSize={20}
      />
    </div>
  );
};

export default Home;
