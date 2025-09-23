import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AccountHeader from "../components/accounts/accountsheader";
import AccountsTable from "../components/accounts/accountstable";
import AccountsPaginator from "../components/accounts/accountspaginator";
import RequestHandler from "../lib/utilities/RequestHandler";
import { showToast } from "../components/toast";
import { useSearchParams } from "react-router-dom";
import ReportModal from "../components/accounts/configModal";

export default function AccountsPage() {
	const [configModal, setConfigModal] = useState(false);
	const [config, setConfig] = useState<any>(null);
	const [showAdmins, setShowAdmins] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const [searchParams] = useSearchParams();
	const initialSearch = searchParams.get("search") || "";
	const [searchTerm, setSearchTerm] = useState(initialSearch);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await RequestHandler.fetchData(
					"get",
					"get-all-users"
				);

				if (!response.success) {
					throw new Error(
						response.message || "Failed to fetch users"
					);
				}

				setUsers(response.users);
			} catch (err: any) {
				console.error("Dashboard fetch error:", err);
				showToast(err.message || "Unknown error", "error");
				setError(true);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	const filteredUsers = users.filter((u: any) => {
		const roleMatch = showAdmins ? u.role === "Admin" : u.role !== "Admin";
		const nameMatch = searchTerm
			? u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			u.email?.toLowerCase().includes(searchTerm.toLowerCase())
			: true;
		return roleMatch && nameMatch;
	});

	const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
	const paginatedUsers = filteredUsers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	const handleFilterChange = () => { };

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
			<div className="bg-gray-950 text-white rounded-b-3xl min-h-screen flex flex-col items-center">
				<div className="p-6 space-y-3 w-full">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
					>
						<AccountHeader
							showAdmins={showAdmins}
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							handleFilterChange={handleFilterChange}
							setShowAdmins={setShowAdmins}
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
						<AccountsTable
							setConfigModal={setConfigModal}
							setConfig={setConfig}
							paginatedUsers={paginatedUsers}
							showAdmins={showAdmins}
						/>
						<AccountsPaginator
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							totalPages={totalPages}
							paginatedUsers={paginatedUsers}
						/>
					</motion.div>
				</div>
			</div>
			<ReportModal open={configModal} onOpenChange={setConfigModal} jsonData={config} />
		</>
	);
}
