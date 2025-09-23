import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import RequestHandler from "../lib/utilities/RequestHandler";
import SprayHeader from "../components/sprays/sprayheader.tsx";
import SpraysTable from "../components/sprays/spraystable.tsx";
import Paginator from "../components/pagination";
import { removeToast, showToast } from "../components/toast";
import "react-toastify/dist/ReactToastify.css";
import CreateSprayModal from "../components/sprays/createspray.tsx";

export default function SprayPage() {
	const [openCreateSpray, setOpenCreateSpray] = useState(false);
	const [spray, setSpray] = useState<null | any>(null);
	const [filteredSpray, setFilteredSpray] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	async function fetchData() {
		try {
			const toastId = showToast("Fetching all sprays.", "loading");
			const response = await RequestHandler.fetchData(
				"get",
				"spray/get-all"
			);
			removeToast(toastId);
			if (response.success) {
				setSpray(response.sprays);
			} else {
				throw new Error(response.message || "Failed to fetch sprays");
			}
		} catch (err: any) {
			console.error("Sprays fetch error:", err);
			showToast(err.message || "Unknown error", "error");
			setError(true);
		} finally {
			setLoading(false);
		}
	}
	useEffect(() => {
		fetchData();
	}, []);

	async function onCreate(values: { name: string, description: string, activeIngredients: string }) {
		try {
			const toastId = showToast("Adding new spray.", "loading");
			const response = await RequestHandler.fetchData(
				"post",
				"spray/create",
				{
					name: values.name,
					description: values.description,
					activeIngredients: values.activeIngredients
				}
			);
			removeToast(toastId);
			if (response.success) {
				showToast("Successfully added new spray!");
				await fetchData();
			} else {
				showToast(response.message || "Failed to add new spray")
				throw new Error(response.message || "Failed to add new sprays");
			}
		} catch (err: any) {
			console.error("Spray add error:", err);
			showToast(err.message || "Unknown error", "error");
			setError(true);
		} finally {
			setLoading(false);
		}
	}

	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedSpray, setExpandedSpray] = useState<number | null>(null);
	const itemsPerPage = 10;

	useEffect(() => {
		if (spray === null) return;
		setFilteredSpray(
			searchTerm
				? spray.filter((p: any) =>
						p.name.toLowerCase().includes(searchTerm.toLowerCase())
				)
			: spray
		);
		setCurrentPage(1);
	}, [spray, searchTerm]);

	const totalPages = Math.ceil(filteredSpray.length / itemsPerPage);
	const paginatedSpray = filteredSpray.slice(
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
						<SprayHeader
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							onAddSpray={() => setOpenCreateSpray(true)}
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
						<SpraysTable
							paginatedSpray={paginatedSpray}
							setExpandedSpray={setExpandedSpray}
							expandedSpray={expandedSpray}
							fetchData={fetchData}
						/>
						<Paginator
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							totalPages={totalPages}
							pageLength={paginatedSpray.length}
						/>
					</motion.div>
				</div>
			</div>
			<CreateSprayModal open={openCreateSpray} setOpen={setOpenCreateSpray} onCreate={onCreate} />
		</>
	);
}
