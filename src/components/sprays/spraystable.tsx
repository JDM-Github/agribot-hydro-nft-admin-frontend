import { Table } from "../ui/table";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import SprayDetails from "./spraysui";

export default function SprayTable({
	paginatedSpray,
	setExpandedSpray,
	expandedSpray,
	fetchData,
}: {
	paginatedSpray: any[];
	setExpandedSpray: any;
	expandedSpray: any;
	fetchData: any
}) {
	return (
		<>
			<Table className="w-full bg-gray-900 text-white rounded-lg overflow-hidden table-fixed">
				<thead>
					<tr className="border-b border-gray-700 text-gray-400 bg-gray-800">
						<th className="p-3 text-left truncate w-1/5">
							Spray Name
						</th>
						<th className="p-3 text-left truncate w-1/5">
							Created At
						</th>
						<th className="p-3 text-left w-1/5 truncate">
							Updated At
						</th>
						<th className="p-3 text-left w-1/5 truncate">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-800 min-h-[100px]">
					{paginatedSpray.length > 0 ? (
						paginatedSpray.map((spray) => (
							<>
								<tr
									key={spray.id}
									className="hover:bg-gray-800"
								>
									<td className="p-3 truncate">
										<span className="flex items-center gap-3">
											{spray.name}
										</span>
									</td>
									<td className="p-3 text-blue-400 truncate">
										{new Date(
											spray.createdAt
										).toLocaleDateString()}
									</td>
									<td className="p-3 text-yellow-400 truncate">
										{new Date(
											spray.updatedAt
										).toLocaleDateString()}
									</td>

									<td className="p-3 text-purple-400 flex justify-between items-center">
										<Button
											variant="ghost"
											size="sm"
											className="hover:bg-gray-600 hover:text-white"
											onClick={() =>
												setExpandedSpray(
													expandedSpray ===
														spray.id
														? null
														: spray.id
												)
											}
										>
											{expandedSpray === spray.id ? (
												<>
													{"View "}
													<ChevronUp size={16} />
												</>
											) : (
												<>
													{"View "}
													<ChevronDown size={16} />
												</>
											)}
										</Button>
									</td>
								</tr>
								{expandedSpray === spray.id && (
									<SprayDetails
										spray={spray}
										fetchData={fetchData}
									/>
								)}
							</>
						))
					) : (
						<tr>
							<td
								colSpan={window.innerWidth < 800 ? 4 : 4}
								className="p-3 text-center text-gray-500"
							>
								No spray found
							</td>
						</tr>
					)}
				</tbody>
			</Table>
		</>
	);
}