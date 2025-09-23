import { Search, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function SprayHeader({
	searchTerm,
	setSearchTerm,
	onAddSpray,
}: {
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	onAddSpray?: () => void;
}) {
	return (
		<>
			<div className="flex justify-between items-center bg-gray-800 px-6 py-3 rounded-lg">
				<h2 className="text-lg lg:text-2xl font-bold">All Sprays</h2>

				<div className="flex items-center space-x-3">
					<div className="relative">
						<Search
							className="absolute left-2 top-2.5 text-gray-500"
							size={16}
						/>
						<Input
							type="text"
							placeholder="Search sprays..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							style={{ backgroundColor: "#00000011" }}
							className="pl-8 w-48 border-gray-500"
						/>
					</div>

					<Button
						onClick={onAddSpray}
						className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
					>
						<Plus size={16} />
						Add Spray
					</Button>
				</div>
			</div>
		</>
	);
}
