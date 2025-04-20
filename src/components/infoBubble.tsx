// For text
interface InfoBubbleProps {
  height: number;
  width: number;
  text: string;
  textSize?: number;
}

const InfoBubble = ({ text, height, width, textSize }: InfoBubbleProps) => {
  return (
    <div
      style={{ height: `${height}px`, width: `${width}px` }}
      className="flex items-center justify-center text-goose-red-419 rounded-full bg-pink-100 border border-solid p-10 text-lg sm:transition-colors ease-in duration-150 overflow-hidden"
    >
      <p
        className="text-center break-words"
        style={{ fontSize: textSize ? `${textSize}px` : undefined }}
      >
        {text}
      </p>
    </div>
  );
};

export default InfoBubble;
