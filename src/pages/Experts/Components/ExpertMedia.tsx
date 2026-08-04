import { useState } from "react";
import { Play } from "lucide-react";
import VideoModal from "./VideoModal";

interface ExpertMediaProps {
  image: string;
  videoUrl?: string;
  doctorName: string;
}

export default function ExpertMedia({
  image,
  videoUrl,
  doctorName,
}: ExpertMediaProps) {
  const hasVideo = Boolean(videoUrl);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={hasVideo ? () => setModalOpen(true) : undefined}
        role={hasVideo ? "button" : undefined}
        tabIndex={hasVideo ? 0 : undefined}
        onKeyDown={
          hasVideo
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setModalOpen(true);
                }
              }
            : undefined
        }
        aria-label={hasVideo ? `Watch ${doctorName}'s intro video` : undefined}
        className={`relative w-[104px] h-[104px] sm:w-[190px] sm:h-[190px] rounded-2xl overflow-hidden shrink-0 ${
          hasVideo ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <span className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-[#27b673] border-2 border-white z-10" />

        {/* Profile photo (thumbnail) — stays visible until the play button is clicked */}
        <img
          src={image}
          alt={doctorName}
          className="w-full h-full object-cover block"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-avatar.png";
          }}
        />

        {hasVideo && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 pl-3 pr-1.5 py-1.5 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
            <span className="text-white text-[11.5px] sm:text-[12.5px] font-semibold drop-shadow whitespace-nowrap">
              Watch intro
            </span>
            <span className="w-7 h-7 rounded-full bg-[#3de951] flex items-center justify-center text-white shrink-0 shadow-md">
              <Play className="w-3 h-3 fill-white ml-0.5" />
            </span>
          </div>
        )}
      </div>

      {modalOpen && videoUrl && (
        <VideoModal
          videoUrl={videoUrl}
          doctorName={doctorName}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}