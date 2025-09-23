import { Button } from "../ui/button";
import { Shield, Search } from "lucide-react";
import { Input } from "../ui/input";

export default function AccountHeader({
	showAdmins,
	searchTerm,
	setSearchTerm,
	handleFilterChange,
	setShowAdmins,
}: {
	showAdmins: boolean;
	searchTerm: string;
	setSearchTerm: (searchTerm: string) => void;
	handleFilterChange: () => void;
    setShowAdmins: (showAdmins: boolean) => void;
}) {
	return (
		<>
			<div className="flex justify-between items-center bg-gray-800 px-6 py-3 rounded-lg">
				<h2 className="text-lg lg:text-2xl font-bold">
					{showAdmins ? "Admin Accounts" : "All Users"}
				</h2>
				<div className="flex gap-2 flex-wrap">
					<div className="relative">
						<Search
							className="absolute left-2 top-2.5 text-gray-500"
							size={16}
						/>
						<Input
							type="text"
							placeholder="Search users..."
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								handleFilterChange();
							}}
							style={{backgroundColor: "#00000011"}}
							className="pl-8 w-48 border-gray-500"
						/>
					</div>

					<Button
						onClick={() => setShowAdmins(!showAdmins)}
						className="cursor-pointer transition duration-100 ease-in-out bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center"
					>
						<Shield size={16} className="mr-2" />
						{showAdmins ? "Show Users" : "Show Admins"}
					</Button>
				</div>
			</div>
		</>
	);
}
