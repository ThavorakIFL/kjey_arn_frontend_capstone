import PiuLogo from "@/assets/icons/piu.svg";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Home() {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/home");
    } else {
        redirect("/register");
    }
    return (
        <main>
            <div className="container mx-auto my-20 flex">
                <PiuLogo className="w-96 h-96" />
                <div className="flex flex-col items-start justify-between w-1/2">
                    <div className="flex flex-col space-y-4">
                        <h1 className="text-3xl font-semibold">
                            What is KjeyArn ?{" "}
                        </h1>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit. Eius commodi id, libero repudiandae nisi enim
                            molestias aspernatur ab voluptatem perspiciatis
                            magni voluptas dolore tempora, inventore illo in
                            asperiores reprehenderit nobis!
                        </p>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Find A Book
                    </button>
                </div>
            </div>
        </main>
    );
}
