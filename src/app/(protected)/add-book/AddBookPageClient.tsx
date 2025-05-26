"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addBook } from "./list-book-action";
import { Genre } from "@/types/genre";

interface AddBookPageClientProps {
    genres: Genre[];
}

export default function AddBookPageClient({ genres }: AddBookPageClientProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        condition: 50, // Default midpoint
        description: "",
        genres: [] as number[],
    });

    // File state handled separately
    const [pictures, setPictures] = useState<File[]>([]);

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

    const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const genreId = parseInt(e.target.value);

        setFormData((prev) => {
            if (e.target.checked) {
                return { ...prev, genres: [...prev.genres, genreId] };
            } else {
                return {
                    ...prev,
                    genres: prev.genres.filter((id) => id !== genreId),
                };
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);

            // Limit to 6 images max
            const newFiles = [...pictures, ...filesArray].slice(0, 6);
            setPictures(newFiles);

            // Generate previews
            const newPreviews = newFiles.map((file) =>
                URL.createObjectURL(file)
            );
            setImagePreview(newPreviews);
        }
    };

    const removeImage = (index: number) => {
        setPictures((prev) => prev.filter((_, i) => i !== index));
        setImagePreview((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const formDataToSend = new FormData();

            // Add text fields
            formDataToSend.append("title", formData.title);
            formDataToSend.append("author", formData.author);
            formDataToSend.append("condition", formData.condition.toString());
            formDataToSend.append("description", formData.description);

            // Add genres
            formData.genres.forEach((genreId) => {
                formDataToSend.append("genres[]", genreId.toString());
            });

            // Add pictures
            pictures.forEach((picture) => {
                formDataToSend.append("pictures[]", picture);
            });

            const response = await addBook(formDataToSend);

            if (response.success) {
                // Redirect to the book detail page or books list
                router.push(`/books/${response.data.book.id}`);
                router.refresh();
            } else {
                setErrors(response.errors || {});
            }
        } catch (error) {
            console.error("Failed to submit book:", error);
            setErrors({
                general: ["An unexpected error occurred. Please try again."],
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayError = (field: string) => {
        return errors[field] ? (
            <div className="text-red-500 text-sm mt-1">
                {errors[field].join(", ")}
            </div>
        ) : null;
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className=" grid grid-cols-2 gap-x-10">
                {/* Image Upload */}
                <div className="">
                    <label className="block text-sm font-medium mb-2">
                        Book Images (Up to 5)
                    </label>
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="bookImages"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                    className="w-8 h-8 mb-4 text-gray-500"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">
                                        Click to upload
                                    </span>{" "}
                                    or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, JPEG or GIF (MAX. 2MB)
                                </p>
                            </div>
                            <input
                                id="bookImages"
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                multiple
                                onChange={handleImageChange}
                                disabled={pictures.length >= 6}
                            />
                        </label>
                    </div>
                    {displayError("pictures")}

                    {/* Image previews */}
                    {imagePreview.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {imagePreview.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img}
                                        alt={`Preview ${index + 1}`}
                                        className="h-72 w-48 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className=" absolute  -top-2 right-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className=" space-y-6  bg-white p-4 rounded-lg shadow-md">
                    {/* Title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium"
                        >
                            Book Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleTextChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            required
                        />
                        {displayError("title")}
                    </div>

                    {/* Author */}
                    <div>
                        <label
                            htmlFor="author"
                            className="block text-sm font-medium"
                        >
                            Author
                        </label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleTextChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                        {displayError("author")}
                    </div>

                    {/* Condition */}
                    <div>
                        <label
                            htmlFor="condition"
                            className="block text-sm font-medium"
                        >
                            Book Condition: {formData.condition}/100{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="range"
                            id="condition"
                            name="condition"
                            min="0"
                            max="100"
                            value={formData.condition}
                            onChange={handleConditionChange}
                            className="mt-1 block w-full"
                            required
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Poor (0)</span>
                            <span>Average (50)</span>
                            <span>Like New (100)</span>
                        </div>
                        {displayError("condition")}
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium"
                        >
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleTextChange}
                            rows={4}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            required
                        />
                        {displayError("description")}
                    </div>

                    {/* Genres */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Genres <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {genres.map((genre) => (
                                <div
                                    key={genre.id}
                                    className="flex items-center"
                                >
                                    <input
                                        type="checkbox"
                                        id={`genre-${genre.id}`}
                                        value={genre.id}
                                        onChange={handleGenreChange}
                                        checked={formData.genres.includes(
                                            genre.id
                                        )}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label
                                        htmlFor={`genre-${genre.id}`}
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        {genre.genre}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {displayError("genres")}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                        >
                            {isSubmitting ? "Submitting..." : "List Book"}
                        </button>
                        {errors.general && (
                            <div className="mt-2 text-red-500 text-sm">
                                {errors.general.join(", ")}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
