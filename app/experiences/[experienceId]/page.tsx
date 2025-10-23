import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { FocusApp } from "@/components/FocusApp";
import { getRandomQuote } from "@/lib/achievements";

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
		<div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
			{/* Header */}
			<div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-8 py-6">
					<div className="flex justify-between items-center">
						<div>
							<h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
								FocusTime
							</h1>
							<p className="text-sm text-gray-400 mt-1">
								Welcome back, <span className="text-gray-300">{displayName}</span>
							</p>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
							<span className="text-sm text-gray-400">Active</span>
						</div>
					</div>
					
					{/* Motivational Quote */}
					<div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
						<p className="text-sm text-gray-300 italic text-center">
							"{motivationalQuote}"
						</p>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-8 py-12">
				<FocusApp userId={userId} />
			</div>

			{/* Footer */}
			<div className="border-t border-gray-800 mt-20">
				<div className="max-w-7xl mx-auto px-8 py-6 text-center text-sm text-gray-500">
					Stay focused. Stay productive. 🎯
				</div>
			</div>
		</div>
	);
}
