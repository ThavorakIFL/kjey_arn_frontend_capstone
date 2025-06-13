import OtherUserProfilePage from "../OtherUserPageClient";
import { getOtherUserProfile, getOtherUserBooks } from "../user-profile-action";

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const otherUserProfile = await getOtherUserProfile(id);
    const otherUserBookDataRes = await getOtherUserBooks(id);
    const otherUserBookData = otherUserBookDataRes.success
        ? otherUserBookDataRes.data
        : [];

    return (
        <OtherUserProfilePage
            otherUserBookData={otherUserBookData}
            initialUserData={otherUserProfile}
        />
    );
}
