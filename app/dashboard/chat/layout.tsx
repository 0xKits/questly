import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
// import './globals.css'
const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div >
			<TooltipProvider delayDuration={0}>{children}</TooltipProvider>
		</div>
	);
}
