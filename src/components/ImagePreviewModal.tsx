// components/ImagePreviewModal.tsx
"use client";

import { useEffect } from "react";

interface ImagePreviewModalProps {
    imageUrl: string;
    onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
    imageUrl,
    onClose,
}) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>

            <img
                src={imageUrl}
                alt="Preview"
                className="z-60 max-w-3xl max-h-[80vh] rounded-lg shadow-lg"
            />
        </div>
    );
};

export default ImagePreviewModal;
