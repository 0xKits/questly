import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function ProfilePage() {
	const supabase = await createClient();
	const user = await supabase.auth.getUser();
	if (user) {
		const userId = user.data.user?.id as string;
		let { data: userData, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", userId)
			.single();
    return redirect(`/dashboard/profile/${userData?.username}`);
	} else {
    return (
      <div>
        <h1>Profile</h1>
        <p>Please log in to view your profile</p>
      </div>
    )
  }
}
