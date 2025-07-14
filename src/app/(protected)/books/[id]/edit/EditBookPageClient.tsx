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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface EditBookPageClientProps {
    book: bookType;
    genres: { id: number; genre: string }[];
    genreMap: Record<string, number>;
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

const EditBookPageClient: React.FC<EditBookPageClientProps> = ({
    book,
    genres: availableGenres,
    genreMap,
}) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const authorRef = useRef<HTMLInputElement>(null);
    const conditionRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [formData, setFormData] = useState({
        title: book.title,
        author: book.author || "",
        condition: book.condition,
        description: book.description || "",
    });
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [genres, setGenres] = useState<{ id: number; genre: string }[]>(
        book.genres
    );
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        draggedIndex: null,
    });

    const handleTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            condition: parseInt(e.target.value),
        }));
    };

    const displayError = (field: string) => {
        return errors[field] ? (
            <div className="text-red-500 text-sm mt-1 bg-red-50 border border-red-200 rounded p-2">
                {errors[field].map((error, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{error}</span>
                    </div>
                ))}
            </div>
        ) : null;
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setErrors({}); // Clear previous errors

        try {
            // Client-side validation
            const clientErrors: Record<string, string[]> = {};

            if (!formData.get("title")?.toString().trim()) {
                clientErrors.title = ["Title is required"];
            }

            if (!formData.get("author")?.toString().trim()) {
                clientErrors.author = ["Author is required"];
            }

            if (genres.length === 0) {
                clientErrors.genres = ["At least one genre must be selected"];
            }

            const conditionValue = parseInt(
                formData.get("condition")?.toString() || "0"
            );
            if (
                isNaN(conditionValue) ||
                conditionValue < 0 ||
                conditionValue > 100
            ) {
                clientErrors.condition = [
                    "Condition must be between 0 and 100",
                ];
            }

            if (allImages.length === 0) {
                clientErrors.pictures = ["At least one image is required"];
            }

            // If there are client-side errors, show them
            if (Object.keys(clientErrors).length > 0) {
                setErrors(clientErrors);

                // Focus the first field with an error
                if (clientErrors.title) {
                    titleRef.current?.focus();
                } else if (clientErrors.author) {
                    authorRef.current?.focus();
                } else if (clientErrors.condition) {
                    conditionRef.current?.focus();
                } else if (clientErrors.description) {
                    descriptionRef.current?.focus();
                }

                const errorCount = Object.keys(clientErrors).length;
                const errorFields = Object.keys(clientErrors).join(", ");
                toast.error(
                    `Please fix ${errorCount} error${
                        errorCount > 1 ? "s" : ""
                    }: ${errorFields}`
                );

                setIsSubmitting(false);
                return;
            }

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
                if (response.errors) {
                    setErrors(response.errors);
                    toast.error(response.message); // ✅ Use the actual backend message
                } else {
                    toast.error("Failed to update book: " + response.message);
                    setErrors({
                        general: ["Failed to update book: " + response.message],
                    });
                }
            } else {
                setErrors({});
                toast.success("Book updated successfully!");
                router.push("/books/" + book.id);
                router.refresh();
                return; // Prevent setIsSubmitting(false) from running
            }
        } catch (error) {
            toast.error("An unexpected error occurred while updating the book");
            setErrors({
                general: [
                    "An unexpected error occurred while updating the book",
                ],
            });
        } finally {
            setIsSubmitting(false);
        }
    }

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
        const genreId = genreMap[selectedGenre]; // Use prop directly

        if (genres.some((g) => g.id === genreId)) {
            toast.error(`Genre "${selectedGenre}" is already selected.`);
            return;
        }

        setGenres((prev) => [...prev, { id: genreId, genre: selectedGenre }]);
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

    const handleDelete = async () => {
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        setIsDeleteDialogOpen(false); // Close dialog first

        try {
            const response = await deleteBook(String(book.id));
            if (!response.success) {
                toast.error("Failed to delete book: " + response.message);
            } else {
                toast.success("Book deleted successfully!");
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
        <div className="">
            {previewImage && (
                <ImagePreviewModal
                    imageUrl={previewImage}
                    onClose={() => setPreviewImage(null)}
                />
            )}

            <div>
                <div className="mb-8">
                    <TitleBar
                        title="Edit Book"
                        subTitle="Update your book information and manage images. Drag
                        images to reorder them."
                    />
                </div>

                <form
                    ref={formRef}
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(formRef.current!);
                        handleSubmit(formData);
                    }}
                    className="space-y-8"
                    noValidate // Disable HTML5 validation
                >
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Image Management Panel - Keep existing */}
                        <div className="xl:col-span-1">
                            <div className="xl:col-span-1">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                    <div className="bg-sidebarColor text-white p-6">
                                        <div className="flex items-center gap-3">
                                            <Image className="h-6 w-6" />
                                            <h2 className="text-xl font-semibold">
                                                Book Images
                                            </h2>
                                        </div>
                                        <p className="text-gray-300 text-sm mt-1">
                                            {allImages.length}/{MAX_IMAGES}{" "}
                                            images - Drag to reorder
                                        </p>
                                    </div>

                                    <div className="p-6">
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
                                                    className="w-full cursor-pointer bg-sidebarColor text-white border-0 h-12 text-sm font-medium duration-200"
                                                    disabled={
                                                        allImages.length >=
                                                        MAX_IMAGES
                                                    }
                                                >
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    {allImages.length >=
                                                    MAX_IMAGES
                                                        ? "Maximum Images Reached"
                                                        : "Add Images"}
                                                </Button>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {allImages.map(
                                                (imageItem, index) => (
                                                    <div
                                                        key={imageItem.id}
                                                        draggable
                                                        onDragStart={(e) =>
                                                            handleDragStart(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                        onDragOver={
                                                            handleDragOver
                                                        }
                                                        onDragEnter={
                                                            handleDragEnter
                                                        }
                                                        onDrop={(e) =>
                                                            handleDrop(e, index)
                                                        }
                                                        onDragEnd={
                                                            handleDragEnd
                                                        }
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
                                                        <div className="absolute top-2 left-2 z-30">
                                                            <div className="bg-black/70 rounded p-1">
                                                                <GripVertical className="h-4 w-4 text-white" />
                                                            </div>
                                                        </div>

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
                                                                #
                                                                {
                                                                    imageItem.order
                                                                }
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
                                                )
                                            )}
                                        </div>

                                        {allImages.length === 0 && (
                                            <div className="text-center py-12 text-gray-500">
                                                <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                <p className="text-sm">
                                                    No images uploaded yet
                                                </p>
                                                <p className="text-xs mt-1">
                                                    Add some images to showcase
                                                    your book
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Book Details Panel - Updated */}
                        <div className="xl:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="bg-sidebarColor text-white p-6">
                                    <h2 className="text-xl font-semibold">
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
                                            ref={titleRef}
                                            name="title"
                                            type="text"
                                            value={formData.title}
                                            onChange={handleTextChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                            placeholder="Enter book title"
                                        />
                                        {displayError("title")}
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
                                            ref={authorRef}
                                            name="author"
                                            type="text"
                                            value={formData.author}
                                            onChange={handleTextChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                            placeholder="Enter author name"
                                        />
                                        {displayError("author")}
                                    </div>

                                    {/* Genres - Updated to match add book style */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            Genres{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        {/* Genre Selection */}
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

                                        {/* Selected Genres Display */}
                                        {genres.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {genres.map((genre) => (
                                                    <div
                                                        key={genre.id}
                                                        className="flex items-center justify-between p-3 rounded-lg border-2 border-sidebarColor bg-sidebarColor text-white transition-all duration-200"
                                                    >
                                                        <input
                                                            type="hidden"
                                                            name="genres[]"
                                                            value={genre.id}
                                                        />
                                                        <span className="text-sm font-medium">
                                                            {genre.genre}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveGenre(
                                                                    genre.id
                                                                )
                                                            }
                                                            type="button"
                                                            className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {displayError("genres")}
                                    </div>

                                    {/* Condition - Updated to match add book slider style */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Condition: {formData.condition}/100{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="space-y-2">
                                            <input
                                                ref={conditionRef}
                                                type="range"
                                                name="condition"
                                                min="0"
                                                max="100"
                                                value={formData.condition}
                                                onChange={handleConditionChange}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Poor (0)</span>
                                                <span>Average (50)</span>
                                                <span>Excellent (100)</span>
                                            </div>
                                        </div>
                                        {displayError("condition")}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Description{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            ref={descriptionRef}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleTextChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                                            placeholder="Describe your book's condition, any notable features, etc..."
                                        />
                                        {displayError("description")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Keep existing but add cursor-pointer */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting || isSubmitting}
                            className="cursor-pointer w-full sm:w-auto flex items-center gap-2 bg-red-500 hover:bg-red-600"
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
                                className="cursor-pointer flex-1 sm:flex-none"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || isDeleting}
                                className="cursor-pointer flex-1 sm:flex-none bg-primaryBlue hover:bg-primaryBlue/90 text-white border-0 flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>

                    {/* Error Messages - Add this section */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="text-red-600 text-sm">
                                {errors.general.map((error, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="text-red-500 mt-0.5">
                                            ⚠
                                        </span>
                                        <span>{error}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hidden inputs for deleted images - Keep existing */}
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
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent className="w-[95vw] max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg">
                            Delete Book
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this book? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-4 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            type="button"
                        >
                            {isDeleting ? "Deleting..." : "Delete Book"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditBookPageClient;
