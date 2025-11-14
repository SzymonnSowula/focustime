import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { Navbar } from "@/components/Navbar";
import { FocusApp } from "@/components/FocusApp";
import { CommunityDashboard } from "@/components/CommunityDashboard";
import { getRandomQuote } from "@/lib/achievements";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	// Ensure the user is logged in on whop.
	const { userId } = await whopsdk.verifyUserToken(await headers());

	// Fetch the neccessary data we want from whop.
	const [user, access, company] = await Promise.all([
		whopsdk.users.retrieve(userId),
		whopsdk.users.checkAccess(experienceId, { id: userId }),
		whopsdk.companies.retrieve(experienceId).catch(() => null),
	]);

	const displayName = user.name || `@${user.username}`;
	const motivationalQuote = getRandomQuote();

	// Check if user is creator/admin (you can customize this logic)
	// For example, check if user owns the company or has admin role
	const isAdmin = company?.owner_user?.id === userId;

	return (
		<div className="min-h-screen relative overflow-hidden">
			{/* Animated Background Gradient */}
			<div className="fixed inset-0 bg-gradient-to-br from-black to-neutral-900" />
			
			{/* Ambient Light Effects */}
			<div className="fixed top-0 left-1/4 w-96 h-96 bg-[var(--focus-primary)] rounded-full blur-[128px] opacity-10 animate-pulse" />
			<div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[var(--focus-secondary)] rounded-full blur-[128px] opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />

			{/* Content */}
			<div className="relative z-10">
				{/* Navbar */}
				<Navbar
					displayName={displayName}
					isAdmin={isAdmin}
					companyId={company?.id}
					experienceId={experienceId}
				/>

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
						{/* Community Dashboard - NEW! */}
						<div className="mb-16">
							<CommunityDashboard companyId={experienceId} />
						</div>

						{/* Personal Focus App */}
						<div className="border-t border-white/5 pt-16">
							<div className="text-center mb-12">
								<h2 className="text-3xl font-bold text-white mb-2">Your Personal Focus</h2>
								<p className="text-[var(--neutral-400)]">Track your individual progress and achievements</p>
							</div>
							<FocusApp userId={userId} experienceId={experienceId} />
						</div>
					</Suspense>
				</main>

				{/* Footer - Minimal */}
				<footer className="border-t border-white/5 mt-24">
					<div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 text-center">
						<p className="text-xs text-[var(--neutral-500)]">
							Designed with focus in mind • Powering productive communities everywhere.
						</p>
					</div>
				</footer>
			</div>
		</div>
	);
}