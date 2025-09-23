import {
	GaugeCircle,
	Crosshair,
	CornerDownRight,
	BarChart4,
	BarChart3,
	Download,
	CheckCircle2,
	ListChecks,
} from "lucide-react";

import { Card, CardContent } from "../ui/card";
import { confirmToast, removeToast, showToast } from "../toast";
import RequestHandler from "../../lib/utilities/RequestHandler";
import HighlightOverlay from "../highlight";
import { useState } from "react";

const colorMap: Record<string, string> = {
	"text-blue-500": "bg-blue-500/50",
	"text-yellow-400": "bg-yellow-400/50",
	"text-green-500": "bg-green-500/50",
	"text-indigo-400": "bg-indigo-400/50",
	"text-purple-400": "bg-purple-400/50",
	"text-pink-400": "bg-pink-400/50",
	"text-orange-400": "bg-orange-400/50",
};

export default function Specifications({
	selectedModel,
	selectedCategory,
	fetchDetect,
}: {
	selectedModel: any;
	selectedCategory: string;
	fetchDetect: any;
}) {
	const [openConfirmToast, setOpenConfirmToast] = useState(false);

	const getDownloadLink = (link: string) => {
		if (!link) return "#";
		const driveMatch = link.match(/\/d\/([a-zA-Z0-9_-]+)\//);
		if (driveMatch && driveMatch[1]) {
			return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
		}
		return link;
	};

	const handleDeleteModel = async () => {
		if (!selectedModel) {
			showToast("No model selected.", "error");
			return;
		}
		setOpenConfirmToast(true);
		confirmToast(
			`Are you sure you want to delete model "${selectedModel.version}"?`,
			async () => {
				setOpenConfirmToast(false);
				const toastId = showToast("Deleting model...", "loading");

				try {
					let target = "yoloobjectdetection";
					if (selectedCategory === "stageclassification") {
						target = "yolostageclassification";
					} else if (selectedCategory === "segmentation") {
						target = "maskrcnnsegmentation";
					}

					const response = await RequestHandler.fetchData(
						"delete",
						`${target}/delete/${selectedModel.id}`
					);

					removeToast(toastId);

					if (response.success) {
						await fetchDetect();
						showToast(
							response.message || "Model deleted successfully.",
							"success"
						);
					} else {
						showToast(
							response.message || "Failed to delete model.",
							"error"
						);
					}
				} catch (error) {
					removeToast(toastId);
					showToast(
						"An error occurred while deleting the model.",
						"error"
					);
				}
			},
			() => {
				setOpenConfirmToast(false);
				showToast("Delete cancelled.", "info");
			}
		);
	};

	// Choose which metrics to show based on category
	const metrics =
		selectedCategory === "stageclassification"
			? [
				{
					icon: <CheckCircle2 size={18} className="text-pink-400" />,
					label: "Accuracy Top-1",
					value: `${(
						(selectedModel?.accuracy_top1 ?? 0) * 100
					).toFixed(2)}%`,
					color: "text-pink-400",
				},
				{
					icon: <ListChecks size={18} className="text-orange-400" />,
					label: "Accuracy Top-5",
					value: `${(
						(selectedModel?.accuracy_top5 ?? 0) * 100
					).toFixed(2)}%`,
					color: "text-orange-400",
				},
			]
			: [
				{
					icon: <Crosshair size={18} className="text-blue-500" />,
					label: "Precision",
					value: `${(
						(selectedModel?.precision ?? 0) * 100
					).toFixed(2)}%`,
					color: "text-blue-500",
				},
				{
					icon: <CornerDownRight size={18} className="text-yellow-400" />,
					label: "Recall",
					value: `${(
						(selectedModel?.recall ?? 0) * 100
					).toFixed(2)}%`,
					color: "text-yellow-400",
				},
				{
					icon: <GaugeCircle size={18} className="text-green-500" />,
					label: "F1 Score",
					value: `${(
						(selectedModel?.f1 ?? 0) * 100
					).toFixed(2)}%`,
					color: "text-green-500",
				},
				{
					icon: <BarChart4 size={18} className="text-indigo-400" />,
					label: "mAP 50",
					value: `${(
						(selectedModel?.mAP50 ?? 0) * 100
					).toFixed(2)}%`,
					color: "text-indigo-400",
				},
				{
					icon: <BarChart3 size={18} className="text-purple-400" />,
					label: "mAP 50-95",
					value: `${(
						(selectedModel?.mAP50_95 ?? 0) * 100
					).toFixed(2)}%`,
					color: "text-purple-400",
				},
			];

	return (
		<>
			{openConfirmToast && <HighlightOverlay />}
			<Card className="bg-gradient-to-b from-gray-900 to-gray-950 p-4 lg:p-3 border-0 rounded-xl shadow-xl">
				<CardContent>
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg lg:text-xl font-bold text-white relative flex">
							Model{" "}
							{selectedModel ? `"${selectedModel.version}"` : ""}{" "}
							Details
						</h3>

						<div className="flex items-center space-x-2">
							{selectedModel && (
								<button
									onClick={handleDeleteModel}
									className="inline-flex items-center gap-2 px-3 py-1.5 border border-red-700 rounded-md text-red-400 text-sm lg:text-base hover:bg-red-600 hover:text-white transition-colors"
								>
									Delete
								</button>
							)}
							{selectedModel?.download_link && (
								<a
									href={getDownloadLink(
										selectedModel.download_link
									)}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-700 rounded-md text-white text-sm lg:text-base hover:bg-green-600 hover:text-white transition-colors"
								>
									<Download size={16} />
									Download
								</a>
							)}
						</div>
					</div>

					{selectedModel ? (
						<>
							<p className="text-gray-400 text-sm mb-4 rounded-2xl">
								<strong>Description:</strong>{" "}
								{selectedModel.description ||
									"No description available."}
							</p>

							<ul className="text-gray-300 text-sm lg:text-base space-y-3 mb-4">
								{metrics.map((item, index) => (
									<li
										key={index}
										className="flex items-center justify-between"
									>
										<div className="flex items-center space-x-2 mr-4">
											{item.icon}
											<span className="text-gray-400">
												{item.label}:
											</span>
										</div>
										<div className="flex-1 h-2 bg-gray-700 rounded-full relative">
											<div
												className={`h-2 rounded-full ${colorMap[item.color]}`}
												style={{
													width:
														item.value.replace("%", "") +
														"%",
												}}
											></div>
										</div>
										<span
											className={`${item.color} font-semibold ml-4`}
										>
											{item.value}
										</span>
									</li>
								))}
							</ul>
						</>
					) : (
						<p className="text-gray-400">No model selected.</p>
					)}
				</CardContent>
			</Card>
		</>
	);
}
