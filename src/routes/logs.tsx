import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import RequestHandler from "../lib/utilities/RequestHandler.ts";
import LogHeader from "../components/logs/logsheader.tsx";
import LogTable from "../components/logs/logstable.tsx";
import Paginator from "../components/pagination.tsx";
import { showToast } from "../components/toast.tsx";
import "react-toastify/dist/ReactToastify.css";

export default function LogsPage() {
	const [logs, setLogs] = useState<null | any>(null);
	const [filteredLogs, setFilteredLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	async function fetchData() {
		try {
			const response = await RequestHandler.fetchData(
				"get",
				"log/get-all"
			);
			if (response.success) {
				setLogs(response.logs);
			} else {
				throw new Error(response.message || "Failed to fetch logs");
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

	const [searchTerm, setSearchTerm] = useState("");
	const [sortLevel, setSortLevel] = useState(""); 
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedLog, setExpandedLog] = useState<number | null>(null);
	const itemsPerPage = 10;

	useEffect(() => {
		if (!logs) return;

		let filtered = searchTerm
			? logs.filter((log: any) =>
				log.message.toLowerCase().includes(searchTerm.toLowerCase())
			)
			: [...logs];

		if (sortLevel) {
			filtered = filtered.sort((a: any, b: any) =>
				a.level.localeCompare(b.level)
			);
			filtered = filtered.filter((l: any) => l.level === sortLevel);
		}
		setFilteredLogs(filtered);
		setCurrentPage(1);
	}, [logs, searchTerm, sortLevel]);

	const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
	const paginatedLogs = filteredLogs.slice(
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
						<LogHeader
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							sortLevel={sortLevel}
							setSortLevel={setSortLevel}
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
						<LogTable
							paginatedLogs={paginatedLogs}
							setExpandedLog={setExpandedLog}
							expandedLog={expandedLog}
						/>
						<Paginator
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							totalPages={totalPages}
							pageLength={paginatedLogs.length}
						/>
					</motion.div>
				</div>
			</div>
		</>
	);
}
