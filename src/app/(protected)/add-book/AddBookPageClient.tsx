"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { addBook } from "./list-book-action";
import { Genre } from "@/types/genre";
import TitleBar from "@/components/TitleBar";
import { Button } from "@/components/ui/button";
import {
    Upload,
    X,
    Eye,
    Save,
    ArrowLeft,
    Tag,
    Image,
    GripVertical,
    Plus,
} from "lucide-react";
import { toast } from "sonner";

interface AddBookPageClientProps {
    genres: Genre[];
}

interface DragState {
    isDragging: boolean;
    draggedIndex: number | null;
}

export default function AddBookPageClient({ genres }: AddBookPageClientProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        draggedIndex: null,
    });

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        condition: 50,
        description: "",
        genres: [] as number[],
    });

    // File state handled separately
    const [pictures, setPictures] = useState<File[]>([]);
    const MAX_IMAGES = 5;

    const handleTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            condition: parseInt(e.target.value),
        }));
    };

    const handleGenreToggle = (genreId: number) => {
        setFormData((prev) => {
            const isSelected = prev.genres.includes(genreId);
            if (isSelected) {
                return {
                    ...prev,
                    genres: prev.genres.filter((id) => id !== genreId),
                };
            } else {
                return { ...prev, genres: [...prev.genres, genreId] };
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);

            // Validate each file before adding
            const validFiles: File[] = [];
            const invalidFiles: string[] = [];

            filesArray.forEach((file) => {
                // Check file size (2MB limit)
                // const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                // if (file.size > maxSize) {
                //     invalidFiles.push(`${file.name} is too large (max 2MB)`);
                //     return;
                // }

                // Check file type
                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/jpg",
                    "image/gif",
                ];
                if (!allowedTypes.includes(file.type)) {
                    invalidFiles.push(
                        `${file.name} is not a supported format (JPEG, PNG, JPG, GIF only)`
                    );
                    return;
                }

                validFiles.push(file);
            });

            // Show errors for invalid files
            if (invalidFiles.length > 0) {
                setErrors((prev) => ({
                    ...prev,
                    pictures: invalidFiles,
                }));
                // Clear picture errors after 5 seconds
                setTimeout(() => {
                    setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.pictures;
                        return newErrors;
                    });
                }, 5000);
            } else {
                // Clear any existing picture errors
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.pictures;
                    return newErrors;
                });
            }

            // Add valid files
            if (validFiles.length > 0) {
                const newFiles = [...pictures, ...validFiles].slice(
                    0,
                    MAX_IMAGES
                );
                setPictures(newFiles);

                // Show warning if we hit the limit
                if (pictures.length + validFiles.length > MAX_IMAGES) {
                    setErrors((prev) => ({
                        ...prev,
                        pictures: [
                            `Maximum ${MAX_IMAGES} images allowed. Some files were not added.`,
                        ],
                    }));
                    setTimeout(() => {
                        setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.pictures;
                            return newErrors;
                        });
                    }, 3000);
                }
            }
        }

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

            // Create new array and move the item
            setPictures((prevPictures) => {
                const newOrder = [...prevPictures];
                const [draggedItem] = newOrder.splice(draggedIndex, 1);
                newOrder.splice(dropIndex, 0, draggedItem);
                return newOrder;
            });

            setDragState({
                isDragging: false,
                draggedIndex: null,
            });
        },
        [dragState]
    );

    const removeImage = (index: number) => {
        setPictures((prev) => prev.filter((_, i) => i !== index));
        // Close preview if we're removing the currently previewed image
        if (previewImage) {
            const currentPreviewUrl = URL.createObjectURL(pictures[index]);
            if (previewImage === currentPreviewUrl) {
                setPreviewImage(null);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            // Client-side validation
            const clientErrors: Record<string, string[]> = {};

            if (!formData.title.trim()) {
                clientErrors.title = ["Title is required"];
            }

            if (!formData.description.trim()) {
                clientErrors.description = ["Description is required"];
            }

            if (formData.genres.length === 0) {
                clientErrors.genres = ["At least one genre must be selected"];
            }

            if (Object.keys(clientErrors).length > 0) {
                setErrors(clientErrors);
                setIsSubmitting(false);
                return;
            }

            const formDataToSend = new FormData();

            // Add text fields
            formDataToSend.append("title", formData.title.trim());
            formDataToSend.append("author", formData.author.trim());
            formDataToSend.append("condition", formData.condition.toString());
            formDataToSend.append("description", formData.description.trim());

            // Add genres
            formData.genres.forEach((genreId) => {
                formDataToSend.append("genres[]", genreId.toString());
            });

            // Add pictures in their current order
            pictures.forEach((picture, index) => {
                formDataToSend.append("pictures[]", picture);
            });
            console.log("Data to be sent", formDataToSend);
            const response = await addBook(formDataToSend);
            if (response.success) {
                // Use toast.promise for better UX
                const toastPromise = new Promise((resolve) => {
                    toast.success(
                        response.message || "Book listed successfully!",
                        {
                            duration: 2000,
                            action: {
                                label: "View Book",
                                onClick: () => {
                                    router.push(
                                        `/books/${response.data.book.id}`
                                    );
                                },
                            },
                            onDismiss: () => resolve(true),
                            onAutoClose: () => resolve(true),
                        }
                    );

                    setTimeout(() => resolve(true), 2000);
                });
                await toastPromise;
                router.push(`/books/${response.data.book.id}`);
                router.refresh();
            } else {
                if (response.errors) {
                    console.log("Server validation errors:", response.errors);
                    setErrors(errors);
                    toast.error("Please fix the errors below");
                } else {
                    toast.error(response.message || "Failed to add book");
                    setErrors({
                        general: [response.message || "Failed to add book"],
                    });
                }
            }
        } catch (error) {
            console.error("Failed to submit book:", error);
            toast.error(
                "Network error. Please check your connection and try again."
            );
            setErrors({
                general: [
                    "Network error. Please check your connection and try again.",
                ],
            });
        } finally {
            setIsSubmitting(false);
        }
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

    const displaySuccess = (field: string) => {
        return errors[field] ? (
            <div className="text-green-600 text-sm mt-1 bg-green-50 border border-green-200 rounded p-2">
                {errors[field].map((message, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{message}</span>
                    </div>
                ))}
            </div>
        ) : null;
    };

    return (
        <div className="">
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative max-w-4xl max-h-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                        />
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            )}

            <div>
                <div className="mb-8">
                    <TitleBar
                        title="List a New Book"
                        subTitle="      Add your book details and upload images. Drag images to
                        reorder them."
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Image Management Panel */}
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
                                        {pictures.length}/{MAX_IMAGES} images -
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
                                            onChange={handleImageChange}
                                        />
                                        <label htmlFor="new-picture-upload">
                                            <Button
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                type="button"
                                                className="w-full cursor-pointer bg-sidebarColor text-white border-0 h-12 text-sm font-medium duration-200"
                                                disabled={
                                                    pictures.length >=
                                                    MAX_IMAGES
                                                }
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                {pictures.length >= MAX_IMAGES
                                                    ? "Maximum Images Reached"
                                                    : "Add Images"}
                                            </Button>
                                        </label>
                                    </div>

                                    {/* Image Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {pictures.map((file, index) => (
                                            <div
                                                key={`image-${index}`}
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
                                                        ? "border-blue-500 opacity-50 scale-105"
                                                        : "border-green-300 hover:border-green-400"
                                                }`}
                                            >
                                                {/* Drag Handle */}
                                                <div className="absolute top-2 left-2 z-30">
                                                    <div className="bg-black bg-opacity-70 rounded p-1">
                                                        <GripVertical className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>

                                                {/* Order Badge */}
                                                <div className="absolute top-2 right-2 z-30">
                                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                        #{index + 1}
                                                    </span>
                                                </div>

                                                <div className="aspect-square">
                                                    <img
                                                        src={URL.createObjectURL(
                                                            file
                                                        )}
                                                        alt={`Preview ${
                                                            index + 1
                                                        }`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute inset-0   bg-transparent group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white hover:bg-gray-100"
                                                        onClick={() =>
                                                            setPreviewImage(
                                                                URL.createObjectURL(
                                                                    file
                                                                )
                                                            )
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                        onClick={() =>
                                                            removeImage(index)
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {pictures.length === 0 && (
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

                                    {displayError("pictures")}
                                </div>
                            </div>
                        </div>

                        {/* Book Details Panel */}
                        <div className="xl:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="bg-sidebarColor text-white p-6">
                                    <h2 className="text-xl font-semibold">
                                        Book Information
                                    </h2>
                                    <p className="text-gray-300 text-sm mt-1">
                                        Fill in your book details below
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
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleTextChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                            placeholder="Enter book title"
                                            required
                                        />
                                        {displayError("title")}
                                    </div>

                                    {/* Author */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Author
                                        </label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleTextChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                            placeholder="Enter author name"
                                        />
                                        {displayError("author")}
                                    </div>

                                    {/* Genres */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Tag className="h-4 w-4" />
                                            Genres{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {genres.map((genre) => (
                                                <label
                                                    key={genre.id}
                                                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                        formData.genres.includes(
                                                            genre.id
                                                        )
                                                            ? "border-black bg-black text-white"
                                                            : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.genres.includes(
                                                            genre.id
                                                        )}
                                                        onChange={() =>
                                                            handleGenreToggle(
                                                                genre.id
                                                            )
                                                        }
                                                        className="sr-only"
                                                    />
                                                    <span className="text-sm font-medium">
                                                        {genre.genre}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        {displayError("genres")}
                                    </div>

                                    {/* Condition */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Condition: {formData.condition}/100{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="space-y-2">
                                            <input
                                                type="range"
                                                name="condition"
                                                min="0"
                                                max="100"
                                                value={formData.condition}
                                                onChange={handleConditionChange}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                required
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
                                            name="description"
                                            value={formData.description}
                                            onChange={handleTextChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                                            placeholder="Describe your book's condition, any notable features, etc..."
                                            required
                                        />
                                        {displayError("description")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto bg-primaryBlue text-white border-0 flex items-center gap-2 px-8"
                        >
                            <Save className="h-4 w-4" />
                            {isSubmitting ? "Listing Book..." : "List Book"}
                        </Button>
                    </div>

                    {/* Success/General Messages */}
                    {errors.success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            {displaySuccess("success")}
                        </div>
                    )}

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
                </form>
            </div>
        </div>
    );
}
