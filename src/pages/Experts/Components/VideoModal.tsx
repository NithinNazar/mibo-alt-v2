import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { getYouTubeEmbedUrl } from "../utils/youtube";

interface VideoModalProps {
  videoUrl: string;
  doctorName: string;
  onClose: () => void;
}

export default function VideoModal({ videoUrl, doctorName, onClose }: VideoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const embedUrl = getYouTubeEmbedUrl(videoUrl, true);

  // Close on Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    // Prevent background scroll while modal is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!embedUrl) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label={`${doctorName} video`}
      >
        <motion.div
          className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <button
            onClick={onClose}
            aria-label="Close video"
            className="absolute -top-2 -right-2 md:top-3 md:right-3 z-10 bg-white/90 hover:bg-white text-[#034B44] rounded-full p-2 shadow-lg transition-transform hover:scale-105"
          >
            <X size={20} />
          </button>
          <iframe
            src={embedUrl}
            title={`${doctorName} introduction video`}
            className="w-full h-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}