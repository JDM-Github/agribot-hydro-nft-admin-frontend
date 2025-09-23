import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import {
	Radar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	ResponsiveContainer,
	Legend,
	Tooltip,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Bar,
} from "recharts";
import Paginator from "../components/pagination";
import { Search } from "lucide-react";
import RequestHandler from "../lib/utilities/RequestHandler";
import { showToast } from "../components/toast";

export default function FeedbackPage() {
	const [allFeedback, setAllFeedback] = useState<any[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedId, setExpandedId] = useState<null | number>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [starFilter, setStarFilter] = useState<number | "all">("all");
	const pageSize = 5;

	async function fetchData() {
		try {
			const response = await RequestHandler.fetchData("get", "feedback/get-all");
			if (response.success) {
				const enriched = response.feedbacks.map((f: any) => {
					const ratings: any = f.ratings || {};
					const avg =
						(Object as any).values(ratings).reduce((a: any, b: any) => a + b, 0) /
						Object.values(ratings).length;

					const stars = Math.round(avg);
					const label =
						stars >= 5
							? "Excellent"
							: stars === 4
								? "Very Good"
								: stars === 3
									? "Good"
									: stars === 2
										? "Poor"
										: "Very Poor";

					return {
						...f,
						stars,
						label,
					};
				});
				setAllFeedback(enriched);
			} else {
				throw new Error(response.message || "Failed to fetch feedbacks");
			}
		} catch (err: any) {
			console.error("Feedback fetch error:", err);
			showToast(err.message || "Unknown error", "error");
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	const toggleExpand = (id: number) => {
		setExpandedId(expandedId === id ? null : id);
	};

	const filteredFeedbacks = allFeedback.filter((f) => {
		const matchesSearch = f.User.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStars = starFilter === "all" || f.stars === starFilter;
		return matchesSearch && matchesStars;
	});

	const totalPages = Math.ceil(filteredFeedbacks.length / pageSize);
	const paginatedFeedbacks = filteredFeedbacks.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<div className="text-white grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 lg:p-6">
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h2 className="text-2xl font-bold">All Feedback</h2>

							<div className="flex items-center gap-3">
								<select
									value={starFilter}
									onChange={(e) =>
										setStarFilter(e.target.value === "all" ? "all" : Number(e.target.value))
									}
									className="py-1 px-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:ring-green-500 text-sm text-gray-300"
								>
									<option value="all">All Stars</option>
									<option value="5">⭐⭐⭐⭐⭐ (5)</option>
									<option value="4">⭐⭐⭐⭐ (4)</option>
									<option value="3">⭐⭐⭐ (3)</option>
									<option value="2">⭐⭐ (2)</option>
									<option value="1">⭐ (1)</option>
								</select>

								<div className="relative">
									<Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
									<input
										type="text"
										placeholder="Search users..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-8 py-1 w-52 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:ring-green-500"
									/>
								</div>
							</div>
						</div>


						<div className="space-y-3 bg-gradient-to-b from-gray-950 to-gray-900 rounded-2xl p-4 min-h-[500px] shadow-md max-h-[500px] overflow-y-auto">
							{paginatedFeedbacks.length > 0 ? (
								paginatedFeedbacks
									.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
									.map((feedback) => (
										<motion.div
											key={feedback.id}
											onClick={() => toggleExpand(feedback.id)}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											className="bg-gray-800/70 border border-gray-700 hover:border-green-500/50 rounded-xl transition-all duration-300 shadow-md cursor-pointer overflow-hidden"
										>
											<div className="px-6 py-4 flex justify-between items-start">
												<div className="flex flex-col gap-1">
													<p className="text-white font-semibold text-lg">{feedback.title}</p>

													<div className="flex items-center gap-2 text-sm">
														<div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">
															{feedback.User.fullName.charAt(0)}
														</div>
														<div className="flex flex-col leading-tight space-y-0.5">
															<span
																onClick={(e) => {
																	e.stopPropagation();
																	window.location.href = `/accounts?search=${encodeURIComponent(feedback.User.fullName)}`;
																}}
																className="text-green-400 hover:underline cursor-pointer font-medium"
															>
																{feedback.User.fullName}
															</span>
															<span className="text-gray-400 text-xs">{feedback.User.email}</span>

															<div className="flex items-center gap-2 text-xs text-gray-500">
																<span>Created: {new Date(feedback.createdAt).toLocaleString()}</span>
																<span className="text-gray-600">•</span>
																<span>Updated: {new Date(feedback.updatedAt).toLocaleString()}</span>
															</div>
														</div>
													</div>

													<div className="flex items-center gap-2 text-sm mt-2">
														<span className="text-yellow-400 text-base">
															{"⭐".repeat(feedback.stars)}
														</span>
														<span className="text-gray-400 italic text-xs">
															({feedback.label})
														</span>
													</div>
												</div>

												<span className="text-gray-400 text-sm">
													{expandedId === feedback.id ? "▲" : "▼"}
												</span>
											</div>

											{expandedId === feedback.id && (
												<div className="px-6 pb-6 text-sm bg-gray-950/70 text-gray-300 border-t border-gray-700 space-y-4">
													<p className="bg-gray-800 p-4 rounded-lg text-gray-300 leading-relaxed mt-2">
														{feedback.message}
													</p>

													<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
														{Object.entries(feedback.ratings as Record<string, number> || {}).map(
															([key, value]) => (
																<div
																	key={key}
																	className="flex justify-between items-center bg-gray-800/70 p-3 rounded-lg"
																>
																	<span className="text-gray-400 text-xs">{key}</span>
																	<span className="text-green-400 font-semibold text-sm">
																		{value}
																	</span>
																</div>
															)
														)}
													</div>
												</div>
											)}
										</motion.div>
									))
							) : (
								<div className="text-center text-gray-400 py-12">
									No feedbacks to display.
								</div>
							)}

						</div>

						<div className="pt-4">
							<Paginator
								currentPage={currentPage}
								setCurrentPage={(page: number) => {
									setCurrentPage(page);
									setExpandedId(null);
								}}
								totalPages={totalPages}
								pageLength={paginatedFeedbacks.length}
							/>
						</div>
					</div>

					<div className="space-y-8">
						<div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-6 shadow-md max-h-[300px]">
							<h3 className="text-xl font-bold mb-4 text-gray-200">
								Feedback Average Analysis
							</h3>
							<ResponsiveContainer width="100%" height={300}>
								<RadarChart data={formatRadarData(allFeedback)}>
									<PolarGrid stroke="#374151" />
									<PolarAngleAxis dataKey="category" stroke="#9ca3af" />
									<PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#4b5563" />
									<Radar
										name="Average Rating"
										dataKey="average"
										stroke="#34d399"
										fill="#10b981"
										fillOpacity={0.3}
									/>
									<Legend />
									<Tooltip
										cursor={{ fill: "#374151", opacity: 0.3 }}
										contentStyle={{
											backgroundColor: "#1f2937",
											border: "none",
											color: "#fff",
										}}
									/>
								</RadarChart>
							</ResponsiveContainer>
						</div>

						<div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-6 shadow-md max-h-[300px]">
							<h3 className="text-xl font-bold mb-4 text-gray-200">
								All Feedback Comparison
							</h3>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={formatBarData(allFeedback)}>
									<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
									<XAxis dataKey="category" stroke="#9ca3af" />
									<YAxis domain={[0, 5]} stroke="#9ca3af" />
									<Legend />
									{allFeedback.map((fb, idx) => (
										<Bar
											key={fb.id}
											dataKey={`user_${fb.id}`}
											name={fb.User?.fullName || `User ${idx + 1}`}
											fill={`hsl(${(idx * 40) % 360}, 70%, 50%)`}
										/>
									))}
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

				</div>
			</motion.div>
		</>
	);
}

function formatRadarData(feedbacks: any[]) {
	if (!feedbacks.length) return [];
	const categories = Object.keys(feedbacks[0].ratings || {});
	return categories.map((category) => {
		const total = feedbacks.reduce(
			(sum, f) => sum + (f.ratings?.[category] || 0),
			0
		);
		return {
			category,
			average: parseFloat((total / feedbacks.length).toFixed(2)),
		};
	});
}

function formatBarData(feedbacks: any[]) {
	if (!feedbacks.length) return [];

	const categories = Object.keys(feedbacks[0].ratings);

	return categories.map((category) => {
		const row: any = { category };
		feedbacks.forEach((f) => {
			row[`user_${f.id}`] = f.ratings?.[category] || 0;
		});
		return row;
	});
}