import { MessageCircle, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Table } from "../ui/table";
import { useState } from "react";
import MessageModal from "./messagemodal";

export default function AccountsTable({
	paginatedUsers,
	showAdmins,
	setConfigModal,
	setConfig,
}: {
	paginatedUsers: any[];
	showAdmins: boolean;
	setConfigModal: any;
	setConfig: any;
}) {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<{ userId: number; fullName: string } | null>(null);
	const openModal = (userId: number, fullName: string) => {
		setSelectedUser({ userId, fullName });
		setModalOpen(true);
	};
	const handleViewConfig = (conf: any) => {
		setConfig(conf);
		setConfigModal(true);
	}
	return (
		<>
			<div className="relative">
				<Table className="w-full bg-gray-900 text-white rounded-lg overflow-hidden table-fixed">
					<thead>
						<tr className="border-b border-gray-700 text-gray-400 bg-gray-800">
							<th className="p-3 text-left">Name</th>
							<th className="p-3 text-left">Role</th>
							{!showAdmins ? (
								<>
									<th className="p-3 text-left">Email</th>
									<th className="p-3 text-left">Agribot-ID</th>
									<th className="p-3 text-left">Actions</th>
								</>
							) : (
								<>
									<th className="p-3 text-left">Email</th>
									<th className="p-3 text-left">Facebook</th>
								</>
							)}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-800 min-h-[100px]">
						{paginatedUsers.length > 0 ? (
							paginatedUsers.map((user) => (
								<tr key={user.id} className="hover:bg-gray-800">
									<td className="p-3 flex items-center space-x-3 truncate">
										{user.profileImage ? (
											<img
												src={user.profileImage}
												alt={user.name}
												className="w-8 h-8 rounded-full object-cover"
											/>
										) : (
											<div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white font-semibold">
												{user.name
													.split(" ")
													.map((n: any) => n[0])
													.join("")
													.toUpperCase().slice(0, 2)}
											</div>
										)}
										<span>{user.name}</span>
									</td>

									<td className="p-3 text-blue-400 truncate">
										{user.role}
									</td>
									{!showAdmins ? (
										<>
											<td className="p-3 text-green-400 truncate">
												{user.email}
											</td>
											<td className="p-3 text-green-400 truncate">
												{user.prototypeID}
											</td>
											<td className="p-3 flex justify-center gap-2">
												<Button
													onClick={() => handleViewConfig(user.config)}
													className="cursor-pointer transition duration-100 ease-in-out bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
												>
													<Settings size={16} className="mr-2" />
													VIEW CONFIG
												</Button>

												<Button
													onClick={() => openModal(user.id, user.fullName)}
													className="cursor-pointer transition duration-100 ease-in-out bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center"
												>
													<MessageCircle size={16} className="mr-2" />
													MESSAGE
												</Button>
											</td>

										</>
									) : (
										<>
											<td className="p-3 text-green-400 truncate">
												{user.email}
											</td>
											<td className="p-3 text-yellow-400 truncate">
												{user.facebook}
											</td>
										</>
									)}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={!showAdmins ? 5 : 4}
									className="p-3 text-center text-gray-500"
								>
									No users found
								</td>
							</tr>
						)}
					</tbody>
				</Table>
			</div>
			<MessageModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				userId={selectedUser?.userId || 0}
				fullName={selectedUser?.fullName || ""}
			/>
		</>
	);
}
