import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Dock from "@/components/dock";
import StickyNavbar from "@/components/top-bar";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Next.js and Supabase Starter Kit",
	description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
	display: "swap",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={geistSans.className}
			suppressHydrationWarning
		>
			<body className="bg-background text-foreground overflow-y-hidden max-h-screen">
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<main className="flex flex-col items-center  h-screen">
						<StickyNavbar />
						<div className=" overflow-y-auto h-full">{children}</div>
						<Dock />
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
