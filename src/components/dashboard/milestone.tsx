import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Card, CardContent } from "../ui/card";
import { Tooltip } from "react-tooltip";
import { addDays, format } from "date-fns";
import { Activity } from "lucide-react";

const today = new Date();

const MilestoneHeatmap = ({ activities }: { activities: any}) => {

	return (
		<Card className="bg-gray-900 text-white shadow-lg border-0 py-6 lg:px-6 px-3">
			<CardContent>
				<h3 className="lg:text-xl mg:text-xl text-md font-bold mb-4 border-b border-gray-700 pb-2 flex items-center justify-between">
					Milestone Heatmap
					<Activity size={24} className="text-gray-400" />
				</h3>

				<div className="flex items-center justify-center min-h-10">
					<CalendarHeatmap
						startDate={addDays(today, -250)}
						endDate={today}
						values={activities}
						classForValue={(value: any) => {
							if (
								!value ||
								value.count === 0 ||
								value.count === null ||
								value.count === undefined
							) {
								return "fill-gray-700";
							}
							if (value.count === 1) return "fill-green-200";
							if (value.count === 2) return "fill-green-400";
							if (value.count === 3) return "fill-green-500";
							if (value.count === 4) return "fill-green-600";
							return "fill-green-700";
						}}
						gutterSize={5}
						tooltipDataAttrs={(value: any) => {
							if (!value || !value.date) return {};
							return {
								"data-tooltip-id": "heatmap-tooltip",
								"data-tooltip-content": `Commits on ${format(
									value.date,
									"MMM dd"
								)}: ${value.count}`,
							} as any;
						}}
					/>
				</div>
				<Tooltip id="heatmap-tooltip" place="top" />
			</CardContent>
		</Card>
	);
};

export default MilestoneHeatmap;
