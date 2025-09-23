import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PlantsTable from "../components/plants/plantstable";
import PlantsPaginator from "../components/plants/plantspaginator";
import PlantHeader from "../components/plants/plantheader";
import RequestHandler from "../lib/utilities/RequestHandler";
import { showToast } from "../components/toast";
import "react-toastify/dist/ReactToastify.css";

export default function PlantsPage() {
	const [plants, setPlants] = useState<null | any>(null);
	const [allDisease, setAllDisease] = useState<string[]>([]);
	const [filteredPlants, setFilteredPlants] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	async function fetchDisease() {
		try {
			const response = await RequestHandler.fetchData(
				"get",
				"disease/get-all-names"
			);
			if (response.success) {
				setAllDisease(response.diseases);
			} else {
				throw new Error(response.message || "Failed to fetch diseases");
			}
		} catch (err: any) {
			console.error("Plants fetch error:", err);
			showToast(err.message || "Unknown error", "error");
			setError(true);
		} finally {
			setLoading(false);
		}
	}

	async function fetchData() {
		try {
			const response = await RequestHandler.fetchData(
				"get",
				"plant/get-all"
			);
			if (response.success) {
				setPlants(response.plants);
			} else {
				throw new Error(response.message || "Failed to fetch plants");
			}
		} catch (err: any) {
			console.error("Plants fetch error:", err);
			showToast(err.message || "Unknown error", "error");
			setError(true);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchDisease();
		fetchData();
	}, []);

	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedPlant, setExpandedPlant] = useState<number | null>(null);
	const itemsPerPage = 10;

	useEffect(() => {
		if (!plants) return;

		const lowerSearch = searchTerm.toLowerCase();
		const filtered = searchTerm
			? plants.filter((p: any) =>
				p.name.toLowerCase().includes(lowerSearch)
			)
			: plants;

		setFilteredPlants(filtered);
		setCurrentPage(1)
	}, [plants, searchTerm]);

	const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
	const paginatedPlants = filteredPlants.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

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
			<div className="bg-gray-950 text-white rounded-b-3xl">
				<div className="bg-gray-950 text-white rounded-b-3xl p-6 space-y-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
							delay: 0.2,
							ease: "easeOut",
						}}
					>
						<PlantHeader
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
							delay: 0.5,
							ease: "easeOut",
						}}
					>
						<PlantsTable
							paginatedPlants={paginatedPlants}
							setExpandedPlant={setExpandedPlant}
							expandedPlant={expandedPlant}
							fetchData={fetchData}
							allDisease={allDisease}
						/>
						<PlantsPaginator
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							totalPages={totalPages}
							paginatedPlants={paginatedPlants}
						/>
					</motion.div>
				</div>
			</div>
		</>
	);
}
