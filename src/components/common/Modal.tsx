import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose} // 1. Click on backdrop closes modal
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} // 2. Click inside modal does NOT close it
        className={cn(
          "bg-(--theme-primary) brightness-95 text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 mx-2 flex flex-col max-h-[85vh] border border-white/10 cursor-default", // 3. Reset cursor to default inside
        )}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/10">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
