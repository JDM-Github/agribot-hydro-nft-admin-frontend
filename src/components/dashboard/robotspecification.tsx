import { Settings } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function RobotSpecification({
	specs,
}: {
	specs: { [key: string]: any };
}) {
	return (
		<Card className="bg-gray-800 border-0 text-white shadow-lg max-h-[300px] overflow-y-auto scrollbar-thin">
			<CardContent>
				<h3 className="lg:text-xl mg:text-xl text-md font-bold mb-3 border-b border-gray-700 pb-2 flex items-center justify-between">
					Robot Specifications
					<Settings size={24} className="text-gray-400" />
				</h3>
				<ul className=" gap-y-3 gap-x-4">
					{Object.entries(specs).map(([key, value], idx) => {
						if (
							key === "Detection_Accuracy" &&
							typeof value === "object"
						) {
							return Object.entries(value).map(
								([subKey, subValue]: any, subIdx): any => (
									<li
										key={`${idx}-${subIdx}`}
										className={`grid grid-cols-2 gap-x-4 px-4 py-3 rounded-lg ${
											(idx % 2 !== 0 ? 1 : 0) +
												(subIdx % 2) ===
											0
												? "bg-gray-700"
												: "bg-gray-750"
										}`}
									>
										<span className="font-semibold capitalize text-gray-200">
											{subKey.replace(/_/g, " ")}:
										</span>
										<span className="text-gray-300">
											{subValue}
										</span>
									</li>
								)
							);
						}

						return (
							<li
								key={idx}
								className={`grid grid-cols-2 gap-x-4 px-4 py-3 rounded-lg ${
									idx % 2 === 0
										? "bg-gray-700"
										: "bg-gray-750"
								}`}
							>
								<span className="font-semibold capitalize text-gray-200">
									{key.replace(/_/g, " ")}:
								</span>
								<span className="text-gray-300">{value}</span>
							</li>
						);
					})}
				</ul>
			</CardContent>
		</Card>
	);
}
