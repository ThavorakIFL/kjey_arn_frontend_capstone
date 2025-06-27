// utils/imageCompression.ts
export const compressImage = async (
    file: File,
    maxSizeKB: number = 2048
): Promise<File> => {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const img = new Image();

        img.onload = () => {
            // Calculate dimensions to maintain aspect ratio
            const maxWidth = 1920;
            const maxHeight = 1080;
            let { width, height } = img;

            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            // Start with high quality and reduce if needed
            let quality = 0.9;
            const compress = () => {
                canvas.toBlob(
                    (blob) => {
                        if (blob && blob.size <= maxSizeKB * 1024) {
                            const compressedFile = new File([blob], file.name, {
                                type: "image/jpeg",
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else if (quality > 0.1) {
                            quality -= 0.1;
                            compress();
                        } else {
                            // Fallback if still too large
                            const compressedFile = new File(
                                [blob!],
                                file.name,
                                {
                                    type: "image/jpeg",
                                    lastModified: Date.now(),
                                }
                            );
                            resolve(compressedFile);
                        }
                    },
                    "image/jpeg",
                    quality
                );
            };

            compress();
        };

        img.src = URL.createObjectURL(file);
    });
};
