
import { Search } from "lucide-react";
import { Input } from "../ui/input";

export default function DiseaseHeader({ searchTerm, setSearchTerm }: { searchTerm: string, setSearchTerm: React.Dispatch<React.SetStateAction<string>> }) {
	return (
		<>
			<div className="flex justify-between items-center bg-gray-800 px-6 py-3 rounded-lg">
				<h2 className="text-lg lg:text-2xl font-bold">Detectable Diseases</h2>
				<div className="relative">
					<Search
						className="absolute left-2 top-2.5 text-gray-500"
						size={16}
					/>
					<Input
						type="text"
						placeholder="Search diseases..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						style={{backgroundColor: "#00000011"}}
						className="pl-8 w-48 border-gray-500"
					/>
				</div>
			</div>
		</>
	);
}