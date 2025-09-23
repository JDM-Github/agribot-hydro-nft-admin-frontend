import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Profile from "../components/settings/profile";
import Links from "../components/settings/links";
import Logout from "../components/settings/logout";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../components/toast";
import RequestHandler from "../lib/utilities/RequestHandler";

export default function AccountSettings() {
	const [selectedTab, setSelectedTab] = useState("profile");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [user, setUser] = useState(null);

	async function fetchData() {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			const parsed = JSON.parse(storedUser);
			try {
				const response = await RequestHandler.fetchData(
					"get",
					`admin/get-user/${parsed.id}`
				);
				if (response.success) {
					setUser(response.user);
				} else {
					throw new Error(
						response.message || "Failed to fetch plants"
					);
				}
			} catch (err: any) {
				console.error("Plants fetch error:", err);
				showToast(err.message || "Unknown error", "error");
				setError(true);
			} finally {
				setLoading(false);
			}
		} else {
			showToast("User not found", "error");
			setError(true);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-full">
				<div className="spinner-border animate-spin border-4 border-t-4 border-gray-300 w-8 h-8 rounded-full"></div>
			</div>
		);
	}
	if (error) {
		return <div className="text-red-500 p-4">Error: {error}</div>;
	}

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="w-6xl mx-auto p-6 text-white inline-block lg:flex"
			>
				<div className="w-80 h-auto bg-gray-900 p-4 rounded-lg shadow-lg space-y-4 flex-shrink-0">
					<h2 className="text-lg font-semibold border-b border-gray-700 pb-2">
						Settings
					</h2>
					<button
						onClick={() => setSelectedTab("profile")}
						className={`block w-full text-left px-4 py-2 rounded-lg transition ${
							selectedTab === "profile"
								? "bg-gray-700 text-white"
								: "text-gray-400 hover:bg-gray-800"
						}`}
					>
						Profile Account
					</button>
					<button
						onClick={() => setSelectedTab("links")}
						className={`block w-full text-left px-4 py-2 rounded-lg transition ${
							selectedTab === "links"
								? "bg-gray-700 text-white"
								: "text-gray-400 hover:bg-gray-800"
						}`}
					>
						Profile Links
					</button>
					<button
						onClick={() => setSelectedTab("logout")}
						className="block w-full text-left px-4 py-2 rounded-lg text-red-400 hover:bg-red-800 hover:text-white transition"
					>
						Logout
					</button>
				</div>

				<div className="flex-1 lg:ml-6">
					<Profile selectedTab={selectedTab} user={user} />
					<Links selectedTab={selectedTab} user={user} />
					<Logout selectedTab={selectedTab}/>
				</div>
			</motion.div>
		</>
	);
}
