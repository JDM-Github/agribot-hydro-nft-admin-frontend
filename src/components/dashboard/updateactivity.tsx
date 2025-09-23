import { Card, CardContent } from "../ui/card";
import {
	BarChart,
	Image,
	Cpu,
	RefreshCw,
	Settings,
	ArrowRightCircle,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";

interface Activity {
	type: string;
	repo: string;
	details: string;
	createdAt: string;
}

const getTypeIcon = (type: string) => {
	switch (type) {
		case "robot-update":
			return <Settings size={16} className="text-green-400" />;
		case "object-detection-model":
			return <Cpu size={16} className="text-blue-400" />;
		case "classification-model":
			return <BarChart size={16} className="text-yellow-400" />;
		case "segmentation-model":
			return <Image size={16} className="text-purple-400" />;
		default:
			return null;
	}
};

const UpdateActivityCard = ({ activities }: { activities: Activity[] }) => {
	// Limit the displayed activities to the first 4
	const limitedActivities = activities.slice(0, 4);

	return (
		<>
			<Card className="bg-gradient-to-b from-gray-900 to-gray-950 text-white shadow-lg border-0 p-4">
				<CardContent>
					<h3 className="lg:text-xl mg:text-xl text-md font-bold mb-3 border-b border-gray-700 pb-2 flex items-center justify-between">
						Update Activity
						<RefreshCw size={24} className="text-gray-400" />
					</h3>

					<ul className="space-y-3">
						{limitedActivities.map((update, idx) => (
							<li
								key={idx}
								className="flex items-start space-x-3"
							>
								{getTypeIcon(update.type)}
								<div>
									<p className="text-sm text-gray-300">
										<span className="font-semibold">
											{update.repo}
										</span>{" "}
										- {update.details}
									</p>
									<p className="text-xs text-gray-500">
										{update.createdAt}
									</p>
								</div>
							</li>
						))}
					</ul>

					<Dialog>
						<DialogTrigger asChild>
							<button className="text-sm text-blue-500 mt-4 flex items-center">
								Show All Activities
								<ArrowRightCircle size={16} className="ml-2" />
							</button>
						</DialogTrigger>

						<DialogContent className="bg-gradient-to-b from-gray-900 to-gray-950 text-white shadow-lg border-0 p-6">
							<DialogHeader>
								<DialogTitle>All Activities</DialogTitle>
								<DialogDescription>
									Below are all the activities recorded.
								</DialogDescription>
							</DialogHeader>

							<ul className="space-y-3">
								{activities.map((update, idx) => (
									<li
										key={idx}
										className="flex items-start space-x-3"
									>
										{getTypeIcon(update.type)}
										<div>
											<p className="text-sm text-gray-300">
												<span className="font-semibold">
													{update.repo}
												</span>{" "}
												- {update.details}
											</p>
											<p className="text-xs text-gray-500">
												{update.createdAt}
											</p>
										</div>
									</li>
								))}
							</ul>
						</DialogContent>
					</Dialog>
				</CardContent>
			</Card>
		</>
	);
};

export default UpdateActivityCard;
