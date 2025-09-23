import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Preview from "../components/model/preview";
import PlantScroll from "../components/model/plantscroll";
import RobotComparison from "../components/model/robotcomparison";
import Specifications from "../components/model/specification";
import MaterialDialog from "../components/model/materialdialog";
import RequestHandler from "../lib/utilities/RequestHandler";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../components/toast";

export default function ModelPage() {
	const [data, setData] = useState({
		plants: [],
		objectDetection: [],
		stageclassification: [],
		segmentation: [],
		error: false,
	});
	const [selectedModel, setSelectedModel] = useState(null);
	const [showMaterials, setShowMaterials] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState("objectDetection");
	const {
		plants,
		objectDetection,
		stageclassification,
		segmentation,
		error,
	} = data;

	const [loading, setLoading] = useState(true);

	const updateSelectedModel = (objectDetection: any, stageclassification: any, segmentation: any) => {
		let selectedModels: any[] = [];

		if (selectedCategory === "objectDetection")
			selectedModels = objectDetection.models || [];
		else if (selectedCategory === "stageclassification")
			selectedModels = stageclassification.models || [];
		else if (selectedCategory === "segmentation")
			selectedModels = segmentation.models || [];

		if (selectedModels.length > 0)
			setSelectedModel(selectedModels[0]);
		else
			setSelectedModel(null);
	}

	useEffect(() => {
		async function fetchData() {
			try {
				const [
					plants,
					objectDetection,
					stageclassification,
					segmentation,
				] = await Promise.all([
					RequestHandler.fetchData(
						"get",
						"plant/get-all-only?fields=id,image,name,latest_precision"
					),
					RequestHandler.fetchData(
						"get",
						"yoloobjectdetection/get-all"
					),
					RequestHandler.fetchData(
						"get",
						"yolostageclassification/get-all"
					),
					RequestHandler.fetchData(
						"get",
						"maskrcnnsegmentation/get-all"
					),
				]);

				if (!plants.success)
					throw new Error(
						plants.message || "Failed to fetch plant count."
					);
				if (!objectDetection.success)
					throw new Error(
						objectDetection.message ||
						"Failed to fetch object detection models."
					);
				if (!stageclassification.success)
					throw new Error(
						stageclassification.message ||
						"Failed to fetch stage classification models."
					);
				if (!segmentation.success)
					throw new Error(
						segmentation.message ||
						"Failed to fetch segmentation models."
					);
				setData({
					plants: plants.plants || [],
					objectDetection: objectDetection.models || [],
					stageclassification: stageclassification.models || [],
					segmentation: segmentation.models || [],
					error: false,
				});
				updateSelectedModel(objectDetection, stageclassification, segmentation);
			} catch (err: any) {
				console.error("Dashboard fetch error:", err);
				showToast(err.message || "Unknown error", "error");
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

	async function fetchDetect() {
		setLoading(true);
		try {
			const [
				plants,
				objectDetection,
			] = await Promise.all([
				RequestHandler.fetchData(
					"get",
					"plant/get-all-only?fields=id,image,name,latest_precision"
				),
				RequestHandler.fetchData(
					"get",
					"yoloobjectdetection/get-all"
				)
			]);

			if (!plants.success)
				throw new Error(
					plants.message || "Failed to fetch plant count."
				);
			if (!objectDetection.success)
				throw new Error(
					objectDetection.message ||
					"Failed to fetch object detection models."
				);
			setData({
				plants: plants.plants || [],
				objectDetection: objectDetection.models || [],
				stageclassification: data.stageclassification || [],
				segmentation: data.segmentation || [],
				error: false,
			});
			updateSelectedModel(objectDetection, stageclassification, segmentation);
		} catch (err: any) {
			console.error("Dashboard fetch error:", err);
			showToast(err.message || "Unknown error", "error");
			setData((prev) => ({
				...prev,
				error: err.message || "Unknown error",
			}));
		} finally {
			setLoading(false);
		}
	}

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
			{loading && (
				<div
					className="fixed top-0 left-0 w-full h-full bg-gray-800/50 flex justify-center items-center z-100"
					style={{ zIndex: "100" }}
				>
					<div className="border-4 border-t-4 border-gray-200 border-t-blue-500 w-16 h-16 rounded-full animate-spin"></div>
				</div>
			)}

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<div className="text-white grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 lg:p-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
							delay: 0.4,
							ease: "easeOut",
						}}
					>
						<Preview setShowMaterials={setShowMaterials} />
						<PlantScroll plants={plants} />
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
							delay: 0.2,
							ease: "easeOut",
						}}
					>
						<RobotComparison
							objectDetection={objectDetection}
							stageclassification={stageclassification}
							segmentation={segmentation}
							setSelectedModel={setSelectedModel}
							selectedModel={selectedModel}
							fetchDetect={fetchDetect}
							selectedCategory={selectedCategory}
							setSelectedCategory={setSelectedCategory}
						/>
						<Specifications
							selectedModel={selectedModel}
							selectedCategory={selectedCategory}
							fetchDetect={fetchDetect}
						/>
					</motion.div>
				</div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
				>
					<MaterialDialog
						showMaterials={showMaterials}
						setShowMaterials={setShowMaterials}
					/>
				</motion.div>
			</motion.div>
		</>
	);
}
