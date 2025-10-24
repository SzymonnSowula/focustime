import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { FocusApp } from "@/components/FocusApp";
import { getRandomQuote } from "@/lib/achievements";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import Image from "next/image";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	// Ensure the user is logged in on whop.
	const { userId } = await whopsdk.verifyUserToken(await headers());

	// Fetch the neccessary data we want from whop.
	const [user, access] = await Promise.all([
		whopsdk.users.retrieve(userId),
		whopsdk.users.checkAccess(experienceId, { id: userId }),
	]);

	const displayName = user.name || `@${user.username}`;
	const motivationalQuote = getRandomQuote();

	return (
		<div className="min-h-screen relative overflow-hidden">
			{/* Animated Background Gradient */}
			<div className="fixed inset-0 bg-gradient-to-br from-black via-[var(--neutral-900)] to-[var(--neutral-800)]" />
			
			{/* Ambient Light Effects */}
			<div className="fixed top-0 left-1/4 w-96 h-96 bg-[var(--focus-primary)] rounded-full blur-[128px] opacity-10 animate-pulse" />
			<div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[var(--focus-secondary)] rounded-full blur-[128px] opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />

			{/* Content */}
			<div className="relative z-10">
				{/* Header - Minimal & Clean */}
				<header className="border-b border-white/5 backdrop-blur-xl bg-black/20">
					<div className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
						<div className="flex justify-between items-center">
							{/* Logo */}
							<div className="flex items-center gap-3">
								<Image
									src="/focustime.jpg"
									alt="FocusTime Logo"
									width={40}
									height={40}
									className="rounded-lg"
								/>
								<div>
									<h1 className="text-2xl font-semibold text-[var(--neutral-50)] tracking-tight">
										FocusTime
									</h1>
									<p className="text-xs text-[var(--neutral-400)] mt-0.5">
										Welcome back, <span className="text-[var(--neutral-300)]">{displayName}</span>
									</p>
								</div>
							</div>

							{/* Status Indicator */}
							<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
								<div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
								<span className="text-xs font-medium text-[var(--neutral-300)]">Active</span>
							</div>
						</div>
					</div>
				</header>

				{/* Motivational Quote - Floating Card */}
				<div className="max-w-3xl mx-auto px-6 sm:px-8 mt-8">
					<div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
						<p className="text-sm text-[var(--neutral-300)] italic leading-relaxed">
							"{motivationalQuote}"
						</p>
					</div>
				</div>

				{/* Main Content */}
				<main className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
					<Suspense fallback={<LoadingScreen />}>
						<FocusApp userId={userId} />
					</Suspense>
				</main>

				{/* Footer - Minimal */}
				<footer className="border-t border-white/5 mt-24">
					<div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 text-center">
						<p className="text-xs text-[var(--neutral-500)]">
							Designed with focus in mind
						</p>
					</div>
				</footer>
			</div>
		</div>
	);
}
