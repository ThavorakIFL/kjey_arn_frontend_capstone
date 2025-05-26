"use client";
import { useRouter } from "next/navigation";
import { Book as bookType } from "@/types/book";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import TitleBar from "@/components/TitleBar";
import Book from "@/components/bookComponent/Book";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";
interface HomePageClientProps {
    books: bookType[];
    error: string | null;
}
const HomePageClient: React.FC<HomePageClientProps> = ({ books, error }) => {
    const router = useRouter();
    return (
        <>
            <div className="p-8">
                <SearchAndFilterBar searchTitle="all-book" />
                {!error && books.length > 0 && (
                    <>
                        <TitleBar
                            onAction={() => {
                                router.push("/all-book");
                            }}
                            actionTitle="See All Book"
                            title="Newly Added Books"
                        />
                        <div className="my-4 mx-14 relative py-2">
                            <Carousel
                                opts={{
                                    align: "start",
                                }}
                                className="w-full"
                            >
                                <CarouselContent>
                                    {books.map((book) => (
                                        <CarouselItem
                                            key={book.id}
                                            className="basis-1/6"
                                        >
                                            <Book book={book} />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default HomePageClient;
