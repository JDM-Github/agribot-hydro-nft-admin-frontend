import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";
import { Card, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import { Cpu, ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Model {
	version: string;
	f1?: number;
	recall?: number;
	precision?: number;
	mAP50?: number;
	mAP50_95?: number;
	accuracy_top1?: number;
	accuracy_top5?: number;
}

interface RobotComparisonCardProps {
	objectDetection: Model[];
	stageclassification: Model[];
	segmentation: Model[];
}

const RobotComparisonCard: React.FC<RobotComparisonCardProps> = ({
	objectDetection,
	stageclassification,
	segmentation,
}) => {
	const modelColors = ["#34D399", "#3B82F6", "#F97316", "#8B5CF6", "#EC4899"];

	const modelOptions = [
		{ label: "YOLOv8 Object Detection", key: "objectDetection" },
		{ label: "YOLOv8 Stage Classification", key: "stageclassification" },
		{ label: "Mask-RCNN Segmentation", key: "segmentation" },
	];

	const [selectedModel, setSelectedModel] = useState(modelOptions[0]);
	const selectedModels =
		selectedModel.key === "objectDetection"
			? objectDetection
			: selectedModel.key === "stageclassification"
				? stageclassification
				: segmentation;

	const metrics =
		selectedModel.key === "stageclassification"
			? ["accuracy_top1", "accuracy_top5"]
			: ["recall", "precision", "f1", "mAP50", "mAP50_95"];

	const chartData = metrics.map((metric: string) => {
		let row: any = { metric };
		selectedModels.forEach((model) => {
			const value: any = model[metric as keyof Model];
			row[model.version] = value !== undefined ? +(value * 100).toFixed(2) : 0;
		});
		return row;
	});

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<Card className="bg-gray-900 text-white shadow-lg border-0 p-4 md:p-6">
			<CardContent>
				<div className="flex items-center justify-between mb-3 border-b border-gray-700 pb-2">
					<h3 className="lg:text-xl text-md font-bold flex items-center">
						Latest Model Comparison
						<Cpu size={24} className="text-gray-400 ml-2" />
					</h3>
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center bg-gray-800 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-700">
							{selectedModel.label}{" "}
							<ChevronDown size={16} className="ml-2" />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="bg-gray-800 text-white rounded-lg shadow-lg">
							{modelOptions.map((option) => (
								<DropdownMenuItem
									key={option.key}
									onClick={() => setSelectedModel(option)}
									className="hover:bg-gray-700 px-4 py-2 cursor-pointer"
								>
									{option.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
						<XAxis
							dataKey="metric"
							tick={{
								fill: "#ccc",
								fontSize: isMobile ? 10 : 14,
							}}
						/>
						<YAxis
							domain={[
								Math.max(
									80,
									Math.min(
										...selectedModels.flatMap((model) =>
											metrics.map(
												(metric) =>
													Number(
														model[metric as keyof Model] || 0
													) * 100
											)
										)
									) - 10
								),
								100,
							]}
							tick={{
								fill: "#ccc",
								fontSize: isMobile ? 10 : 14,
							}}
						/>

						<Tooltip
							contentStyle={{
								backgroundColor: "#333",
								border: "none",
							}}
						/>
						<Legend
							wrapperStyle={{ fontSize: isMobile ? 10 : 14 }}
						/>

						{selectedModels.map((model, idx) => (
							<Line
								key={model.version}
								type="monotone"
								dataKey={model.version}
								stroke={modelColors[idx % modelColors.length]}
								strokeWidth={isMobile ? 1.5 : 2.5}
								dot={{ r: isMobile ? 2 : 4 }}
							/>
						))}
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

export default RobotComparisonCard;
