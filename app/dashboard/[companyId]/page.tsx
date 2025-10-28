import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { Navbar } from "@/components/Navbar";
import { AdminStats } from "@/components/AdminStats";
import { MemberManagement } from "@/components/MemberManagement";
import { SessionHistory } from "@/components/SessionHistory";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

export default async function AdminDashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const { companyId } = await params;
	const { userId } = await whopsdk.verifyUserToken(await headers());

	// Fetch company and user data
	const [company, user, access] = await Promise.all([
		whopsdk.companies.retrieve(companyId),
		whopsdk.users.retrieve(userId),
		whopsdk.users.checkAccess(companyId, { id: userId }),
	]);

	const displayName = user.name || `@${user.username}`;

	// Check if user is admin/creator
	// You can customize this logic based on how you determine admin status
	const isAdmin = true; // For now, assume dashboard access means admin

	return (
		<div className="min-h-screen relative overflow-hidden">
			{/* Background */}
			<div className="fixed inset-0 bg-gradient-to-br from-black via-[var(--neutral-900)] to-[var(--neutral-800)]" />
			
			{/* Ambient Light Effects */}
			<div className="fixed top-0 left-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-[128px] opacity-5 animate-pulse" />
			<div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-[128px] opacity-5 animate-pulse" style={{ animationDelay: '1s' }} />

			{/* Content */}
			<div className="relative z-10">
				{/* Navbar */}
				<Navbar
					displayName={displayName}
					isAdmin={isAdmin}
					companyId={companyId}
					experienceId={companyId} // Or fetch the actual experienceId
				/>

				{/* Main Content */}
				<main className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
					{/* Header */}
					<div className="mb-12">
						<div className="flex items-center gap-3 mb-4">
							<div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500">
								<span className="text-2xl">👑</span>
							</div>
							<div>
								<h1 className="text-4xl font-bold text-white">Creator Dashboard</h1>
								<p className="text-[var(--neutral-400)] mt-1">
									{company.title} • Manage your community
								</p>
							</div>
						</div>
					</div>

					<Suspense fallback={<LoadingScreen />}>
						{/* Admin Stats */}
						<div className="mb-12">
							<AdminStats companyId={companyId} />
						</div>

						{/* Session History */}
						<div className="mb-12">
							<SessionHistory companyId={companyId} />
						</div>

						{/* Member Management */}
						<div className="mb-12">
							<MemberManagement companyId={companyId} />
						</div>
					</Suspense>
				</main>

				{/* Footer */}
				<footer className="border-t border-white/5 mt-24">
					<div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 text-center">
						<p className="text-xs text-[var(--neutral-500)]">
							FocusTime Creator Dashboard • Empowering productive communities
						</p>
					</div>
				</footer>
			</div>
		</div>
	);
}