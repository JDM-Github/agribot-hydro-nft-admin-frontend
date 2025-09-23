import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import RequestHandler from "../lib/utilities/RequestHandler";
import DiseaseHeader from "../components/diseases/diseaseheader";
import DiseasesTable from "../components/diseases/diseasestable";
import Paginator from "../components/pagination";
import { showToast } from "../components/toast";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

export default function DiseasePage() {
	const [disease, setDisease] = useState<null | any>(null);
	const [filteredDisease, setFilteredDisease] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const [searchParams] = useSearchParams();
	const initialSearch = searchParams.get("search") || "";
	const [searchTerm, setSearchTerm] = useState(initialSearch);

	async function fetchData() {
		try {
			const response = await RequestHandler.fetchData(
				"get",
				"disease/get-all"
			);
			if (response.success) {
				setDisease(response.diseases);
			} else {
				throw new Error(response.message || "Failed to fetch diseases");
			}
		} catch (err: any) {
			console.error("Dashboard fetch error:", err);
			showToast(err.message || "Unknown error", "error");
			setError(true);
		} finally {
			setLoading(false);
		}
	}
	useEffect(() => {
		fetchData();
	}, []);

	
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedDisease, setExpandedDisease] = useState<number | null>(null);
	const itemsPerPage = 10;

	useEffect(() => {
		if (disease === null) return;
		setFilteredDisease(
			searchTerm
				? disease.filter((p: any) =>
						p.name.toLowerCase().includes(searchTerm.toLowerCase())
			)
				: disease
		);
		setCurrentPage(1);
	}, [disease, searchTerm]);

	const totalPages = Math.ceil(filteredDisease.length / itemsPerPage);
	const paginatedDisease = filteredDisease.slice(
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
						<DiseaseHeader
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
						<DiseasesTable
							paginatedDiseases={paginatedDisease}
							setExpandedDisease={setExpandedDisease}
							expandedDisease={expandedDisease}
							fetchData={fetchData}
						/>
						<Paginator
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							totalPages={totalPages}
							pageLength={paginatedDisease.length}
						/>
					</motion.div>
				</div>
			</div>
		</>
	);
}
