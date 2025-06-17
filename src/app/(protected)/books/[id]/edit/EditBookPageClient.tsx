"use client";

import React, { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Book as bookType } from "@/types/book";
import TitleBar from "@/components/TitleBar";
import { Button } from "@/components/ui/button";
import { genreOptions } from "@/types/genre";
import { deleteBook, updateBook } from "@/app/(protected)/books/book-action";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import {
    Upload,
    X,
    Eye,
    Trash2,
    Save,
    ArrowLeft,
    Plus,
    Tag,
    Image,
    GripVertical,
} from "lucide-react";

interface EditBookPageClientProps {
    book: bookType;
}

interface ImageItem {
    id: string; // Use string to accommodate both "existing-{id}" and "new-{index}"
    type: "existing" | "new";
    originalId?: number; // For existing images
    file?: File; // For new images
    picture?: string; // For existing images
    order: number;
}

interface DragState {
    isDragging: boolean;
    draggedIndex: number | null;
}

const EditBookPageClient: React.FC<EditBookPageClientProps> = ({ book }) => {
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [genres, setGenres] = useState<{ id: number; genre: string }[]>(
        book.genres
    );
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        draggedIndex: null,
    });

    // Initialize unified image array
    const [allImages, setAllImages] = useState<ImageItem[]>(() => {
        const existingImages =
            book.pictures
                ?.filter((pic) => !imagesToDelete.includes(pic.id))
                .map((pic, index) => ({
                    id: `existing-${pic.id}`,
                    type: "existing" as const,
                    originalId: pic.id,
                    picture: pic.picture,
                    order: index + 1,
                })) || [];
        return existingImages;
    });

    const MAX_IMAGES = 5;

    // Update images when imagesToDelete changes
    React.useEffect(() => {
        setAllImages((prevImages) =>
            prevImages
                .filter(
                    (img) =>
                        img.type === "new" ||
                        (img.type === "existing" &&
                            img.originalId &&
                            !imagesToDelete.includes(img.originalId))
                )
                .map((img, index) => ({ ...img, order: index + 1 }))
        );
    }, [imagesToDelete]);

    const handleSelectGenre = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGenre = e.target.value;
        if (!selectedGenre) return;

        const matched = genreOptions.find((g) => g === selectedGenre);

        if (!matched) return;

        const genreMap: Record<string, number> = {
            Horror: 1,
            Romance: 2,
            Adventure: 3,
            "Science Fiction": 4,
            Fantasy: 5,
            Mystery: 6,
            Thriller: 7,
            "Historical Fiction": 8,
            Biography: 9,
            "Self-Help": 10,
            Philosophy: 11,
            Poetry: 12,
            "Young Adult": 13,
            "Children's": 14,
            Dystopian: 15,
            "Non-Fiction": 16,
            Memoir: 17,
            Crime: 18,
            Classic: 19,
            "Comic Book/Graphic Novel": 20,
        };
        const genreId = genreMap[selectedGenre];
        if (genres.some((g) => g.id === genreId)) {
            alert(`Genre "${selectedGenre}" already exists.`);
            return;
        }
        setGenres((prev) => [...prev, { id: genreId, genre: selectedGenre }]);
        e.target.value = "";
    };

    const handleRemoveGenre = (id: number) => {
        setGenres((prev) => prev.filter((g) => g.id !== id));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);

        if (allImages.length + files.length > MAX_IMAGES) {
            alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
            return;
        }

        const newImageItems: ImageItem[] = files.map((file, index) => ({
            id: `new-${Date.now()}-${index}`, // Unique ID for new images
            type: "new",
            file: file,
            order: allImages.length + index + 1,
        }));

        setAllImages((prevImages) => [...prevImages, ...newImageItems]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Drag and Drop Handlers
    const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
        setDragState({
            isDragging: true,
            draggedIndex: index,
        });
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index.toString());
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragEnd = useCallback(() => {
        setDragState({
            isDragging: false,
            draggedIndex: null,
        });
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent, dropIndex: number) => {
            e.preventDefault();
            e.stopPropagation();

            const { draggedIndex } = dragState;
            if (draggedIndex === null || draggedIndex === dropIndex) return;

            setAllImages((prevImages) => {
                const newImages = [...prevImages];
                const [draggedItem] = newImages.splice(draggedIndex, 1);
                newImages.splice(dropIndex, 0, draggedItem);

                // Update order numbers
                return newImages.map((img, index) => ({
                    ...img,
                    order: index + 1,
                }));
            });

            setDragState({
                isDragging: false,
                draggedIndex: null,
            });
        },
        [dragState]
    );

    const handleDeleteExistingImage = (originalId: number) => {
        setImagesToDelete((prev) => [...prev, originalId]);
    };

    const handleDeleteImage = (imageId: string) => {
        const imageToDelete = allImages.find((img) => img.id === imageId);

        if (imageToDelete?.type === "existing" && imageToDelete.originalId) {
            handleDeleteExistingImage(imageToDelete.originalId);
        } else {
            // Remove new image from array
            setAllImages((prevImages) =>
                prevImages
                    .filter((img) => img.id !== imageId)
                    .map((img, index) => ({ ...img, order: index + 1 }))
            );
        }
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            // Add new pictures to form data
            const newImages = allImages.filter((img) => img.type === "new");
            newImages.forEach((imageItem, index) => {
                if (imageItem.file) {
                    formData.append(`new_pictures[${index}]`, imageItem.file);
                }
            });

            // Add image order data for existing images (backward compatibility)
            const existingImages = allImages.filter(
                (img) => img.type === "existing"
            );
            const imageOrder = existingImages.map((img) => ({
                id: img.originalId,
                order: img.order,
            }));
            formData.append("image_order", JSON.stringify(imageOrder));

            // Add complete final order data including both existing and new images
            const finalImageOrder = allImages.map((img, index) => ({
                id:
                    img.type === "existing"
                        ? img.originalId
                        : newImages.findIndex((newImg) => newImg.id === img.id),
                type: img.type,
                order: img.order,
            }));
            formData.append(
                "final_image_order",
                JSON.stringify(finalImageOrder)
            );

            const response = await updateBook(formData, String(book.id));
            if (!response.success) {
                console.error("Update failed:", response.message);
                alert("❌ " + response.message);
            } else {
                router.push("/books/" + book.id);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this book? This action cannot be undone."
        );
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            const response = await deleteBook(String(book.id));
            if (!response.success) {
                alert("❌ " + response.message);
            } else {
                alert("✅ Book deleted successfully.");
                router.push("/");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const getImageSrc = (imageItem: ImageItem): string => {
        if (imageItem.type === "existing" && imageItem.picture) {
            return process.env.NEXT_PUBLIC_IMAGE_PATH + imageItem.picture;
        } else if (imageItem.type === "new" && imageItem.file) {
            return URL.createObjectURL(imageItem.file);
        }
        return "";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {previewImage && (
                <ImagePreviewModal
                    imageUrl={previewImage}
                    onClose={() => setPreviewImage(null)}
                />
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <TitleBar
                        title="Edit Book"
                        className="text-4xl font-bold text-gray-800"
                    />
                    <p className="text-gray-600 mt-2">
                        Update your book information and manage images. Drag
                        images to reorder them.
                    </p>
                </div>

                <form
                    ref={formRef}
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(formRef.current!);
                        handleSubmit(formData);
                    }}
                    className="space-y-8"
                >
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Image Management Panel */}
                        <div className="xl:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="bg-black text-white p-6">
                                    <div className="flex items-center gap-3">
                                        <Image className="h-6 w-6" />
                                        <h2 className="text-xl font-semibold">
                                            Book Images
                                        </h2>
                                    </div>
                                    <p className="text-gray-300 text-sm mt-1">
                                        {allImages.length}/{MAX_IMAGES} images -
                                        Drag to reorder
                                    </p>
                                </div>

                                <div className="p-6">
                                    {/* Upload Button */}
                                    <div className="mb-6">
                                        <input
                                            ref={fileInputRef}
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            id="new-picture-upload"
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="new-picture-upload">
                                            <Button
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                type="button"
                                                className="w-full cursor-pointer bg-black text-white border-0 h-12 text-sm font-medium duration-200"
                                                disabled={
                                                    allImages.length >=
                                                    MAX_IMAGES
                                                }
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                {allImages.length >= MAX_IMAGES
                                                    ? "Maximum Images Reached"
                                                    : "Add Images"}
                                            </Button>
                                        </label>
                                    </div>

                                    {/* Image Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {allImages.map((imageItem, index) => (
                                            <div
                                                key={imageItem.id}
                                                draggable
                                                onDragStart={(e) =>
                                                    handleDragStart(e, index)
                                                }
                                                onDragOver={handleDragOver}
                                                onDragEnter={handleDragEnter}
                                                onDrop={(e) =>
                                                    handleDrop(e, index)
                                                }
                                                onDragEnd={handleDragEnd}
                                                className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-move ${
                                                    dragState.isDragging &&
                                                    dragState.draggedIndex ===
                                                        index
                                                        ? `border-${
                                                              imageItem.type ===
                                                              "existing"
                                                                  ? "blue"
                                                                  : "green"
                                                          }-500 opacity-50 scale-105`
                                                        : `border-${
                                                              imageItem.type ===
                                                              "existing"
                                                                  ? "gray"
                                                                  : "green"
                                                          }-${
                                                              imageItem.type ===
                                                              "existing"
                                                                  ? "200"
                                                                  : "300"
                                                          } hover:border-${
                                                              imageItem.type ===
                                                              "existing"
                                                                  ? "blue"
                                                                  : "green"
                                                          }-400`
                                                }`}
                                            >
                                                {/* Drag Handle */}
                                                <div className="absolute top-2 left-2 z-30">
                                                    <div className="bg-black/70 rounded p-1">
                                                        <GripVertical className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>

                                                {/* Order Badge */}
                                                <div className="absolute top-2 right-2 z-30">
                                                    <span
                                                        className={`text-white text-xs px-2 py-1 rounded-full font-medium ${
                                                            imageItem.type ===
                                                            "existing"
                                                                ? "bg-blue-500"
                                                                : "bg-green-500"
                                                        }`}
                                                    >
                                                        {imageItem.type ===
                                                        "new"
                                                            ? "NEW "
                                                            : ""}
                                                        #{imageItem.order}
                                                    </span>
                                                </div>

                                                <div className="aspect-square">
                                                    <img
                                                        src={getImageSrc(
                                                            imageItem
                                                        )}
                                                        alt={`Book image ${
                                                            index + 1
                                                        }`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute inset-0 bg-transparent group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white hover:bg-gray-100"
                                                        onClick={() => {
                                                            setPreviewImage(
                                                                getImageSrc(
                                                                    imageItem
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                        onClick={() =>
                                                            handleDeleteImage(
                                                                imageItem.id
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {allImages.length === 0 && (
                                        <div className="text-center py-12 text-gray-500">
                                            <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p className="text-sm">
                                                No images uploaded yet
                                            </p>
                                            <p className="text-xs mt-1">
                                                Add some images to showcase your
                                                book
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Book Details Panel */}
                        <div className="xl:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="bg-black text-white p-6">
                                    <h2 className="text-2xl font-semibold">
                                        Book Information
                                    </h2>
                                    <p className="text-gray-300 text-sm mt-1">
                                        Update your book details below
                                    </p>
                                </div>

                                <div className="p-8 space-y-6">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            Title{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            name="title"
                                            defaultValue={book.title}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                            type="text"
                                            placeholder="Enter book title"
                                            required
                                        />
                                    </div>

                                    {/* Author */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Author{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            name="author"
                                            defaultValue={book.author!}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                            type="text"
                                            placeholder="Enter author name"
                                            required
                                        />
                                    </div>

                                    {/* Genres */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Tag className="h-4 w-4" />
                                            Genres
                                        </label>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <select
                                                onChange={handleSelectGenre}
                                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white min-w-48"
                                            >
                                                <option value="">
                                                    Select Genre
                                                </option>
                                                {genreOptions.map((genre) => (
                                                    <option
                                                        key={genre}
                                                        value={genre}
                                                    >
                                                        {genre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {genres.length > 0 && (
                                            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                {genres.map((genre) => (
                                                    <div
                                                        key={genre.id}
                                                        className="flex items-center gap-2 bg-black text-white rounded-full px-4 py-2 text-sm font-medium"
                                                    >
                                                        <input
                                                            type="hidden"
                                                            name="genres[]"
                                                            value={genre.id}
                                                        />
                                                        <span>
                                                            {genre.genre}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveGenre(
                                                                    genre.id
                                                                )
                                                            }
                                                            type="button"
                                                            className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Condition */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Condition (0-100){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            name="condition"
                                            defaultValue={book.condition}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                            type="number"
                                            min={0}
                                            max={100}
                                            placeholder="Enter condition (0-100)"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            defaultValue={book.description}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                                            placeholder="Enter book description..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting || isSubmitting}
                            className="w-full sm:w-auto flex items-center gap-2 bg-red-500 hover:bg-red-600"
                        >
                            <Trash2 className="h-4 w-4" />
                            {isDeleting ? "Deleting..." : "Delete Book"}
                        </Button>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isSubmitting || isDeleting}
                                className="flex-1 sm:flex-none"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || isDeleting}
                                className="flex-1 sm:flex-none bg-black text-white border-0 flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>

                    {/* Hidden inputs for deleted images */}
                    {imagesToDelete.map((id) => (
                        <input
                            type="hidden"
                            name="delete_pictures[]"
                            value={id}
                            key={`delete-${id}`}
                        />
                    ))}
                </form>
            </div>
        </div>
    );
};

export default EditBookPageClient;
