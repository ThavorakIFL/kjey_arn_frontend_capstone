import { fetchUserBook, getUserProfile } from "./profile-action";
import ProfilePageClient from "./ProfilePageClient";

export default async function ProfilePage({}) {
    const userProfile = await getUserProfile();
    const userBookDataRes = await fetchUserBook();
    const userBookData = userBookDataRes.success ? userBookDataRes.data : [];

    return (
        <ProfilePageClient
            userBookData={userBookData}
            initialUserData={userProfile}
        />
    );
}
