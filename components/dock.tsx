import { createClient } from "@/utils/supabase/server";
import { HomeIcon, ScrollIcon, SwordIcon, User2Icon } from "lucide-react";
import Link from "next/link";

export default async function Dock() {
	const supabase = await createClient();
	const user = await supabase.auth.getUser();

	if (!user.data.user) {
		return <div>Not logged in</div>;
	}

	const { data: profileData, error: profileError } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.data.user.id)
		.single();

	return (
		<div className="w-screen bottom-0 left-0 right-0 bg-background text-white border-t border-black/20">
			<div className="flex justify-around items-center h-16 ">
				<DockItem
					icon={<HomeIcon className="h-6 w-6" />}
					label="Home"
					href="/"
				/>
				<DockItem
					icon={<SwordIcon className="h-6 w-6" />}
					label="New Quest"
					href="/dashboard/chat"
				/>
				<DockItem
					icon={<ScrollIcon className="h-6 w-6" />}
					label="Your Quests"
					href="/dashboard/profile/quests"
				/>
				<DockItem
					icon={<User2Icon className="h-6 w-6" />}
					label="Profile"
					href={`/dashboard/profile/${profileData?.username}`}
				/>
			</div>
		</div>
	);
}

function DockItem({
	icon,
	label,
	href,
}: {
	icon: React.ReactNode;
	label: string;
	href: string;
}) {
	return (
		<Link
			href={href}
			className="flex flex-col items-center justify-center w-full h-full group"
		>
			<div className="relative">
				<div className="absolute inset-0 rounded-full bg-white/0 transition-all duration-300 ease-in-out group-hover:bg-white/10 -m-2" />
				<div className="relative z-10 text-black transition-transform duration-300 ease-in-out group-hover:scale-110">
					{icon}
				</div>
			</div>
			<span className="mt-1 text-xs text-black/90 font-bold">
				{label}
			</span>
		</Link>
	);
}
