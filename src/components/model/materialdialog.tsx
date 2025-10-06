import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { materialLinks, materials } from "../../lib/constant";

export default function MaterialDialog({
	showMaterials,
	setShowMaterials,
}: {
	showMaterials: boolean;
	setShowMaterials: any;
}) {
	type MaterialLinks = keyof typeof materialLinks;
	return (
		<Dialog open={showMaterials} onOpenChange={setShowMaterials}>
			<DialogContent className="bg-gray-950 text-white max-w-lg border-1 border-gray-700 rounded-xl p-6">
				<DialogHeader>
					<DialogTitle className="text-lg font-bold text-white">
						Materials Used
					</DialogTitle>
				</DialogHeader>
				<ul className="text-gray-300 space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin">
					{materials.map((material, idx) => {
						const item = (materialLinks as Record<
							MaterialLinks,
							{ desc: string; img: string }
						>)[material as MaterialLinks];
						return (
							<li
								key={idx}
								className="flex flex-col sm:flex-row items-start sm:space-x-4 p-3 rounded-lg bg-gradient-to-r from-transparent via-gray-900 to-transparent transition"
							>
								{item?.img && (
									<img
										src={item.img}
										alt={material}
										className="w-24 h-24 object-cover rounded-lg border border-gray-800 mb-3 sm:mb-0"
									/>
								)}
								<div className="flex-1">
									<p className="font-semibold text-white">{material}</p>
									<p className="text-sm text-gray-400 mb-2">
										{item?.desc || "No description available."}
									</p>
									<a
										href={`https://www.google.com/search?q=${encodeURIComponent(
											material
										)}`}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
									>
										Search on Google
									</a>
								</div>
							</li>
						);
					})}
				</ul>
			</DialogContent>
		</Dialog>
	);
}
