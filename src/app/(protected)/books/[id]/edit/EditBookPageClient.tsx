"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Book as bookType } from "@/types/book";
import TitleBar from "@/components/TitleBar";
import { Button } from "@/components/ui/button";
import { genreOptions } from "@/types/genre";
import { deleteBook, updateBook } from "@/app/(protected)/books/book-action";
import ImagePreviewModal from "@/components/ImagePreviewModal";

interface EditBookPageClientProps {
    book: bookType;
}

const EditBookPageClient: React.FC<EditBookPageClientProps> = ({ book }) => {
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [genres, setGenres] = useState<{ id: number; genre: string }[]>(
        book.genres
    );
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [newPictures, setNewPictures] = useState<File[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const MAX_IMAGES = 5;

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
        const total = book.pictures.length + newPictures.length + files.length;

        if (total > MAX_IMAGES) {
            alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
            return;
        }

        setNewPictures((prev) => [...prev, ...files]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    async function handleSubmit(formData: FormData) {
        newPictures.forEach((file, index) => {
            formData.append(`new_pictures[${index}]`, file);
        });

        const response = await updateBook(formData, String(book.id));
        if (!response.success) {
            console.error("Update failed:", response.message);
            alert("❌ " + response.message);
        } else {
            router.push("/books/" + book.id);
        }
    }

    return (
        <>
            <div className="p-8">
                {previewImage && (
                    <ImagePreviewModal
                        imageUrl={previewImage}
                        onClose={() => setPreviewImage(null)}
                    />
                )}
                <form
                    ref={formRef}
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(formRef.current!);
                        handleSubmit(formData);
                    }}
                >
                    <div>
                        <TitleBar title="Edit Book" className="mb-8" />
                        <div className="grid grid-cols-7 gap-x-12 my-8">
                            <div className="col-span-1 bg-white shadow-md rounded-lg px-4 py-8">
                                <div className="grid grid-cols-1 gap-4 place-items-center">
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
                                            className="h-10 cursor-pointer"
                                        >
                                            + Add Image
                                        </Button>
                                    </label>
                                    {book.pictures
                                        ?.filter(
                                            (pic) =>
                                                !imagesToDelete.includes(pic.id)
                                        )
                                        .map((pictureObject, index) => (
                                            <div
                                                className="relative h-32 w-32 object-contain overflow-hidden p-2 cursor-pointer"
                                                key={pictureObject.id}
                                            >
                                                {/* red remove badge */}
                                                <div
                                                    onClick={() =>
                                                        setImagesToDelete(
                                                            (prev) => [
                                                                ...prev,
                                                                pictureObject.id,
                                                            ]
                                                        )
                                                    }
                                                    className="absolute right-0 top-0 z-20 text-lg bg-red-500 text-white rounded-full flex items-center justify-center w-6 h-6 hover:bg-red-600 transition"
                                                >
                                                    &minus;
                                                </div>

                                                <img
                                                    onClick={() => {
                                                        setPreviewImage(
                                                            process.env
                                                                .NEXT_PUBLIC_IMAGE_PATH +
                                                                pictureObject.picture
                                                        );
                                                    }}
                                                    className="z-10 h-full w-full object-cover"
                                                    src={
                                                        process.env
                                                            .NEXT_PUBLIC_IMAGE_PATH +
                                                        pictureObject.picture
                                                    }
                                                    alt="Book image"
                                                />
                                            </div>
                                        ))}
                                    {newPictures.map((file, index) => (
                                        <div
                                            key={`new-${index}`}
                                            className="relative h-32 w-32 object-contain overflow-hidden p-2 cursor-pointer"
                                        >
                                            {/* Red remove badge */}
                                            <div
                                                onClick={() =>
                                                    setNewPictures((prev) =>
                                                        prev.filter(
                                                            (_, i) =>
                                                                i !== index
                                                        )
                                                    )
                                                }
                                                className="absolute right-0 top-0 z-20 text-lg bg-red-500 text-white rounded-full flex items-center justify-center w-6 h-6 hover:bg-red-600 transition"
                                            >
                                                &minus;
                                            </div>
                                            <img
                                                onClick={() =>
                                                    setPreviewImage(
                                                        URL.createObjectURL(
                                                            file
                                                        )
                                                    )
                                                }
                                                src={URL.createObjectURL(file)}
                                                alt={`New preview ${index + 1}`}
                                                className="h-full w-full object-cover rounded z-10"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-6 bg-white shadow-md rounded-lg p-8 max-h-[60vh]">
                                <div className="flex flex-col space-y-4 ">
                                    <h1 className="text-3xl font-semibold">
                                        Book Description
                                    </h1>
                                    <div className="flex items-center">
                                        <div className="w-40">Title:</div>
                                        <input
                                            name="title"
                                            defaultValue={book.title}
                                            className="px-4 h-12 rounded-lg w-full bg-backgroundColor"
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex h-auto">
                                        <div className="w-40 my-3 ">Genre:</div>
                                        <div className="flex space-x-4 w-full">
                                            <select
                                                onChange={handleSelectGenre}
                                                name="genres"
                                                className="w-auto h-12 rounded-lg bg-backgroundColor text-center"
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
                                            <div className="bg-backgroundColor flex flex-wrap gap-2 items-center  rounded-md h-auto px-2 py-2 ">
                                                {genres.map((genre) => (
                                                    <div
                                                        key={genre.id}
                                                        className="items-center my-auto flex h-8 space-x-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium px-3"
                                                    >
                                                        <input
                                                            type="hidden"
                                                            name="genres[]"
                                                            value={genre.id}
                                                        />
                                                        <p> {genre.genre} </p>
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveGenre(
                                                                    genre.id
                                                                )
                                                            }
                                                            type="button"
                                                            className="hover:bg-bookBackgroundStroke transition-all duration-300 cursor-pointer flex items-center justify-center rounded-full bg-backgroundColor text-sidebarColorHover w-4 h-4"
                                                        >
                                                            x
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-40">Author:</div>
                                        <input
                                            name="author"
                                            defaultValue={book.author!}
                                            className="px-4 h-12 rounded-lg w-full bg-backgroundColor"
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-40">Condition:</div>
                                        <input
                                            name="condition"
                                            defaultValue={book.condition}
                                            className="px-4 h-12 rounded-lg w-full bg-backgroundColor"
                                            type="number"
                                            min={0}
                                            max={100}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-40">Description:</div>
                                        <textarea
                                            name="description"
                                            defaultValue={book.description}
                                            className="px-4 py-3 h-12 rounded-lg w-full bg-backgroundColor"
                                        />
                                    </div>
                                    <div className="w-full flex justify-between">
                                        <Button
                                            type="button"
                                            onClick={async () => {
                                                const confirmed =
                                                    window.confirm(
                                                        "Are you sure you want to delete this book?"
                                                    );
                                                if (!confirmed) return;

                                                const response =
                                                    await deleteBook(
                                                        String(book.id)
                                                    );
                                                if (!response.success) {
                                                    alert(
                                                        "❌ " + response.message
                                                    );
                                                } else {
                                                    alert(
                                                        "✅ Book deleted successfully."
                                                    );
                                                    router.push("/"); // or wherever you want to redirect after deletion
                                                }
                                            }}
                                        >
                                            Delete Book
                                        </Button>
                                        <Button type="submit">Save</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
        </>
    );
};

export default EditBookPageClient;
