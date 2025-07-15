import { notFound } from "next/navigation";
import OtherUserProfilePage from "../OtherUserPageClient";
import { getOtherUserProfile, getOtherUserBooks } from "../user-profile-action";

// export default async function UserProfilePage({
//     params,
// }: {
//     params: Promise<{ id: string }>;
// }) {
//     const { id } = await params;

//     try {
//         const otherUserProfile = await getOtherUserProfile(id);
//         const otherUserBookDataRes = await getOtherUserBooks(id);
//         const otherUserBookData = otherUserBookDataRes.success
//             ? otherUserBookDataRes.data
//             : [];

//         if (!otherUserProfile || !otherUserBookData) {
//             notFound();
//         }

//         return (
//             <OtherUserProfilePage
//                 otherUserBookData={otherUserBookData}
//                 initialUserData={otherUserProfile.data}
//             />
//         );
//     } catch (error) {
//         notFound();
//     }
// }

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    try {
        const otherUserProfile = await getOtherUserProfile(id);
        const otherUserBookDataRes = await getOtherUserBooks(id);
        const otherUserBookData = otherUserBookDataRes.success
            ? otherUserBookDataRes.data
            : [];

        // Fix: Check the success property instead
        if (!otherUserProfile.success || !otherUserProfile.data) {
            notFound();
        }

        return (
            <OtherUserProfilePage
                otherUserBookData={otherUserBookData}
                initialUserData={otherUserProfile.data}
            />
        );
    } catch (error) {
        notFound();
    }
}
