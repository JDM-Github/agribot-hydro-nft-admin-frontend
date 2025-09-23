import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RobotComparisonCard from "../components/dashboard/robotcomparison";
import CardSection from "../components/dashboard/cardsection";
import RobotSpecification from "../components/dashboard/robotspecification";
import UpdateActivityCard from "../components/dashboard/updateactivity";
import MilestoneHeatmap from "../components/dashboard/milestone";
import RequestHandler from "../lib/utilities/RequestHandler";
import { showToast } from "../components/toast";
import { specs } from "../lib/constant";


export default function AgriBotDashboard() {
	const [data, setData] = useState({
		plantCount: 0,
		diseaseCount: 0,
		objectDetection: [],
		stageClassification: [],
		segmentation: [],
		activities: [],
		activitiesMilestone: [],
		error: null,
	});
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function fetchData() {
			try {
				const [
					plants,
					diseases,
					objectDetection,
					stageclassification,
					segmentation,
					activities,
				] = await Promise.all([
					RequestHandler.fetchData("get", "plant/count"),
					RequestHandler.fetchData("get", "disease/count"),
					RequestHandler.fetchData(
						"get",
						"yoloobjectdetection/get-all?count=5"
					),
					RequestHandler.fetchData(
						"get",
						"yolostageclassification/get-all"
					),
					RequestHandler.fetchData(
						"get",
						"maskrcnnsegmentation/get-all"
					),
					RequestHandler.fetchData("get", "activity/get-all"),
				]);
				let activitiesMilestone = {};
				if (activities != null && activities.activities != null) {
					activitiesMilestone = activities.activities.reduce(
						(acc: any, activity: any) => {
							const date = activity.createdAt.split("T")[0];
							if (!acc[date]) acc[date] = { date, count: 0 };
							acc[date].count += 1;
							return acc;
						},
						{}
					);
				}

				setData({
					plantCount: plants.count || 0,
					diseaseCount: diseases.count || 0,
					objectDetection: objectDetection.models || [],
					stageClassification: stageclassification.models || [],
					segmentation: segmentation.models || [],
					activities: activities.activities || [],
					activitiesMilestone: activitiesMilestone
						? Object.values(activitiesMilestone)
						: [],
					error: null,
				});
			} catch (err: any) {
				console.error("Dashboard fetch error:", err);
				showToast(err.message || "Unknown error", "error")
				setData((prev) => ({
					...prev,
					error: err.message || "Unknown error",
				}));
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	const {
		plantCount,
		diseaseCount,
		objectDetection,
		stageClassification,
		segmentation,
		activities,
		activitiesMilestone,
		error,
	} = data;

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
		<motion.div
			className="p-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<div className="lg:flex inline-block space-y-6 lg:space-x-5 w-full">
				<motion.div
					className="lg:w-[48vw] w-[100%] space-y-5"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
				>
					<RobotComparisonCard
						objectDetection={objectDetection}
						stageclassification={stageClassification}
						segmentation={segmentation}
					/>
					<MilestoneHeatmap activities={activitiesMilestone} />
				</motion.div>

				<motion.div
					className="flex-1 space-y-5"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
				>
					<CardSection
						plantCount={plantCount}
						diseaseCount={diseaseCount}
					/>
					<RobotSpecification specs={specs} />
					<UpdateActivityCard activities={activities} />
				</motion.div>
			</div>
		</motion.div>
	);
}
