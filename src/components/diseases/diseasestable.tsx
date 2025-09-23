import { Table } from "../ui/table";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import DiseaseDetails from "./diseaseui";

export default function DiseasesTable({
	paginatedDiseases,
	setExpandedDisease,
	expandedDisease,
	fetchData,
}: {
	paginatedDiseases: any[];
	setExpandedDisease: any;
	expandedDisease: any;
	fetchData: any
}) {
	return (
		<>
			<Table className="w-full bg-gray-900 text-white rounded-lg overflow-hidden table-fixed">
				<thead>
					<tr className="border-b border-gray-700 text-gray-400 bg-gray-800">
						<th className="p-3 text-left truncate w-1/5">
							Disease Name
						</th>
						<th className="p-3 text-left truncate w-1/5">
							Precision
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
					{paginatedDiseases.length > 0 ? (
						[...paginatedDiseases]
							.sort((a, b) => a.id - b.id)
							.map((disease) => (
							<>
								<tr
									key={disease.id}
									className="hover:bg-gray-800"
								>
									<td className="p-3 truncate">
										<span className="flex items-center gap-3">
											<img
												src={
													disease.all_images.length > 0
														? disease.all_images[0]
														: null
												}
												alt={disease.name}
												className="w-10 h-10 object-cover rounded-full shadow-lg"
											/>

											{disease.name}
										</span>
									</td>
									<td className="p-3 text-green-400 truncate">
										{(Number(disease.latest_precision)*100).toFixed(2)}%
									</td>
									<td className="p-3 text-blue-400 truncate">
										{new Date(
											disease.createdAt
										).toLocaleDateString()}
									</td>
									<td className="p-3 text-yellow-400 truncate">
										{new Date(
											disease.updatedAt
										).toLocaleDateString()}
									</td>

									<td className="p-3 text-purple-400 flex justify-between items-center">
										<Button
											variant="ghost"
											size="sm"
											className="hover:bg-gray-600 hover:text-white"
											onClick={() =>
												setExpandedDisease(
													expandedDisease ===
														disease.id
														? null
														: disease.id
												)
											}
										>
											{expandedDisease === disease.id ? (
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
								{expandedDisease === disease.id && (
									<DiseaseDetails
										disease={disease}
										fetchData={fetchData}
									/>
								)}
							</>
						))
					) : (
						<tr>
							<td
								colSpan={window.innerWidth < 800 ? 5 : 6}
								className="p-3 text-center text-gray-500"
							>
								No diseases found
							</td>
						</tr>
					)}
				</tbody>
			</Table>
		</>
	);
}