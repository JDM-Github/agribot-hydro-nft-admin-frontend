import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Legend,
	Radar,
} from "recharts";
import { motion } from "framer-motion";
import ImageGallery from "./imagegallery";
import EditSprayModal from "./managespray";
import { removeToast, showToast } from "../toast";
import RequestHandler from "../../lib/utilities/RequestHandler";
import EditDiseaseModal from "./editdisease";
import ViewOpenSpray from "../sprays/viewopenspray";

interface Spray {
	id: number;
	name: string;
}

export default function DiseaseDetails({
	disease,
	fetchData,
}: {
	disease: any;
	fetchData: any;
}) {
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [sprays, setSprays] = useState<Spray[]>([]);
	const [selectedSpray, setSelectedSpray] = useState<any>(null);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedDisease, setSelectedDisease] = useState(null);
	const [expanded, setExpanded] = useState(false);
	const [isSprayModalOpen, setSprayModalOpen] = useState(false);

	const versionCount = 5;
	const radarData = ["Precision", "Recall", "F1"].map(
		(metric) => {
			const obj: any = { subject: metric, fullMark: 1 };
			for (let i = 0; i < versionCount; i++) {
				const key = `v${i}`;
				if (metric === "Precision")
					obj[key] = Number(disease.all_precision[i] || 0);
				if (metric === "Recall")
					obj[key] = Number(disease.all_recall[i] || 0);
				if (metric === "F1")
					obj[key] = Number(disease.all_f1_score[i] || 0);
			}
			return obj;
		}
	);

	async function fetchSprayData() {
		try {
			const response = await RequestHandler.fetchData(
				"get",
				"spray/get-all"
			);
			if (response.success) {
				setSprays(response.sprays);
			} else {
				throw new Error(response.message || "Failed to fetch users");
			}
		} catch (err: any) {
			console.error("Dashboard fetch error:", err);
			showToast(err.message || "Unknown error", "error");
		}
	}
	useEffect(() => {
		fetchSprayData();
	}, []);

	return (
		<>
			<tr className="bg-gray-950 border-gray-800 border">
				<td colSpan={5} className="p-4 w-full">
					<div className="flex flex-col md:flex-row justify-between w-full space-y-4 md:space-y-0">
						<div className="space-y-2 w-full md:w-2/3">
							<p className="text-gray-400">
								<strong className="text-blue-300">
									Description:
								</strong>{" "}
								{disease.description}
							</p>
							<p className="text-gray-400">
								<strong className="text-green-300">Recommended Sprays:</strong>{" "}
								{disease.all_spray_ids && disease.all_spray_ids.length > 0 ? (
									<span className="inline-flex flex-wrap gap-2">
										{disease.all_spray_ids.map((id: any) => {
											const spray = sprays.find((s) => s.id === id);
											if (!spray) return null;

											return (
												<span
													key={id}
													onClick={() => {
														setSelectedSpray(spray);
														setViewModalOpen(true);
													}}
													className="text-blue-400 hover:underline cursor-pointer"
												>
													{spray.name}
												</span>
											);
										})}
									</span>
								) : (
									"Not Set"
								)}
							</p>

						</div>

						<ImageGallery disease={disease} />
					</div>

					<div className="flex flex-col md:flex-row justify-between w-full space-y-4 md:space-y-0 mt-4">
						<div className="w-full md:w-2/3 grid grid-cols-2 sm:flex sm:flex-wrap gap-4">
							<Button
								className="w-full sm:w-auto min-w-[150px] text-white border-gray-600 hover:bg-gray-700"
								onClick={() => {
									setSelectedDisease(disease);
									setEditModalOpen(true);
								}}
							>
								Edit Disease
							</Button>
							<Button
								className="w-full sm:w-auto min-w-[150px] text-white border-gray-600 hover:bg-gray-700"
								onClick={() => setSprayModalOpen(true)}
							>
								Manage Sprays
							</Button>
						</div>
						<div className="w-full md:w-2/3">
							<Button
								className="w-full text-white border-gray-600 hover:bg-gray-700"
								onClick={() => setExpanded(!expanded)}
							>
								{expanded
									? "Hide Performance Metrics"
									: "View Performance Metrics"}
							</Button>
						</div>
					</div>

					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{
							height: expanded ? "auto" : 0,
							opacity: expanded ? 1 : 0,
						}}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="overflow-hidden mt-4 flex flex-col gap-6"
					>
						{expanded && (
							<div className="bg-gray-900 p-4 rounded-lg shadow-lg">
								<h3 className="text-center text-blue-300 font-semibold mb-2">
									Radar Overview
								</h3>
								<ResponsiveContainer width="100%" height={300}>
									<RadarChart data={radarData}>
										<PolarGrid
											gridType="polygon"
											stroke="#444"
											strokeDasharray="4 4"
										/>
										<PolarAngleAxis
											dataKey="subject"
											tick={{
												fill: "#ccc",
												fontSize: 12,
												fontWeight: 500,
											}}
										/>
										<PolarRadiusAxis
											angle={30}
											domain={[0, 1]}
											tick={{
												fill: "#ccc",
												fontSize: 10,
											}}
											axisLine={false}
										/>
										{disease.all_version
											.slice(0, versionCount)
											.map(
												(
													version: string,
													i: number
												) => {
													const colors = [
														"#8884d8",
														"#82ca9d",
														"#ffc658",
														"#ff7300",
														"#FF4444",
													];
													return (
														<Radar
															key={version}
															name={version}
															dataKey={`v${i}`}
															stroke={
																colors[
																i %
																colors.length
																]
															}
															fill={
																colors[
																i %
																colors.length
																]
															}
															fillOpacity={0.35}
															strokeWidth={2}
															strokeLinejoin="round"
														/>
													);
												}
											)}
										<Tooltip
											contentStyle={{
												backgroundColor: "#1f2937",
												border: "none",
												color: "#fff",
											}}
											itemStyle={{ fontSize: 13 }}
										/>
										<Legend
											iconType="circle"
											verticalAlign="bottom"
											wrapperStyle={{
												paddingTop: 8,
												color: "#ccc",
											}}
										/>
									</RadarChart>
								</ResponsiveContainer>
							</div>
						)}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div className="bg-gray-800 p-4 rounded-lg shadow-lg">
								<h3 className="text-center text-green-300 font-semibold mb-2">
									Precision
								</h3>
								<ResponsiveContainer width="100%" height={200}>
									<PieChart>
										<Tooltip
											cursor={{
												fill: "#374151",
												opacity: 0.3,
											}}
											contentStyle={{
												backgroundColor: "#1f2937",
												border: "none",
												color: "#fff",
											}}
											labelStyle={{ color: "#00C49F" }}
											itemStyle={{ color: "#fff" }}
										/>

										<Pie
											data={disease.all_version
												.slice(0, 5)
												.map(
													(
														version: string,
														i: number
													) => ({
														name: version,
														value: Number(
															Number(
																disease
																	.all_precision[
																i
																] || 0
															).toFixed(2)
														),
													})
												)}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={60}
											label
										>
											{[
												"#8884d8",
												"#ff7300",
												"#00C49F",
												"#FFBB28",
												"#FF4444",
											].map((color, index) => (
												<Cell
													key={`cell-${index}`}
													fill={color}
												/>
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
							</div>

							<div className="bg-gray-900 p-4 rounded-lg shadow-lg">
								<h3 className="text-center text-green-300 font-semibold mb-2">
									Recall
								</h3>
								<ResponsiveContainer width="100%" height={200}>
									<BarChart
										data={disease.all_version
											.slice(0, 5)
											.map(
												(
													version: string,
													i: number
												) => ({
													name: version,
													value: Number(
														disease.all_recall[i] || 0
													).toFixed(2),
												})
											)}
									>
										<XAxis
											dataKey="name"
											tick={{ fill: "#ccc" }}
										/>
										<YAxis tick={{ fill: "#ccc" }} />
										<Tooltip
											cursor={{
												fill: "#374151",
												opacity: 0.3,
											}}
											contentStyle={{
												backgroundColor: "#1f2937",
												border: "none",
												color: "#fff",
											}}
										/>
										<Bar dataKey="value" fill="#82ca9d" />
									</BarChart>
								</ResponsiveContainer>
							</div>

							<div className="bg-gray-800 p-4 rounded-lg shadow-lg">
								<h3 className="text-center text-green-300 font-semibold mb-2">
									F1 Score
								</h3>
								<ResponsiveContainer width="100%" height={200}>
									<LineChart
										data={disease.all_version
											.slice(0, 5)
											.map(
												(
													version: string,
													i: number
												) => ({
													name: version,
													value: Number(
														disease.all_f1_score[i] ||
														0
													).toFixed(2),
												})
											)}
									>
										<XAxis
											dataKey="index"
											tick={{ fill: "#ccc" }}
										/>
										<YAxis tick={{ fill: "#ccc" }} />
										<Tooltip
											cursor={{
												fill: "#374151",
												opacity: 0.3,
											}}
											contentStyle={{
												backgroundColor: "#1f2937",
												border: "none",
												color: "#fff",
											}}
										/>
										<Line
											type="monotone"
											dataKey="value"
											stroke="#ff7300"
											strokeWidth={2}
											dot={{ r: 4 }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>
					</motion.div>
				</td>
			</tr>

			{selectedDisease && (
				<EditDiseaseModal
					disease={selectedDisease}
					open={editModalOpen}
					onClose={() => setEditModalOpen(false)}
					fetchData={fetchData}
				/>
			)}
			{isSprayModalOpen && (
				<EditSprayModal
					isOpen={isSprayModalOpen}
					sprays={sprays}
					setSprays={setSprays}
					onClose={() => setSprayModalOpen(false)}
					initialSprays={disease.all_spray_ids || []}
					onSave={async (updatedSprays) => {
						const toastId = showToast(
							"Saving spray data...",
							"loading"
						);

						try {
							const response = await RequestHandler.fetchData(
								"post",
								`disease/update-sprays/${disease.id}`,
								{ sprays: updatedSprays }
							);

							if (response.success) {
								removeToast(toastId);
								showToast(
									"Disease sprays updated successfully!",
									"success"
								);
							} else {
								throw new Error(response.message);
							}
						} catch (err: any) {
							removeToast(toastId);
							showToast(
								err?.message ||
								"Failed to update disease diseases.",
								"error"
							);
						} finally {
							fetchData();
						}
					}}
				/>
			)}
			{viewModalOpen && selectedSpray && (
				<ViewOpenSpray viewModalOpen={viewModalOpen} setViewModalOpen={setViewModalOpen} spray={selectedSpray} />
			)}
		</>
	);
}
