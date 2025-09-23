import { Card, CardContent } from "../ui/card";
import { Leaf, AlertTriangle, Cpu } from "lucide-react";

export default function CardSection({
	plantCount,
	diseaseCount,
}: {
	plantCount: number;
	diseaseCount: number;
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 flex-1">
			<Card className="bg-gray-900 shadow-lg border-0 py-2 px-2 relative overflow-hidden">
				<CardContent className="py-1 px-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Leaf size={32} className="text-green-500" />
							<div>
								<p className="text-gray-400 text-xs md:text-sm">
									Detectable Plants
								</p>
								<p className="text-xl md:text-2xl font-bold text-white">
									{plantCount}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
				<div className="absolute top-0 rounded-2xl right-0 h-full w-1/4 bg-gradient-to-b from-green-500/30 to-transparent"></div>
			</Card>

			<Card className="bg-gray-900 shadow-lg border-0 py-2 px-2 relative overflow-hidden">
				<CardContent className="py-1 px-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<AlertTriangle size={32} className="text-red-500" />
							<div>
								<p className="text-gray-400 text-xs md:text-sm">
									Detectable Diseases
								</p>
								<p className="text-xl md:text-2xl font-bold text-white">
									{diseaseCount}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
				<div className="absolute top-0 rounded-2xl right-0 h-full w-1/4 bg-gradient-to-b from-red-500/30 to-transparent"></div>
			</Card>

			<Card className="bg-gray-900 shadow-lg border-0 py-2 px-2 relative overflow-hidden">
				<CardContent className="py-1 px-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Cpu size={32} className="text-purple-500" />
							<div>
								<p className="text-gray-400 text-xs md:text-sm">
									Latest AGRIBOT Version
								</p>
								<p className="font-bold text-xl md:text-2xl text-white">
									Version 1.0.2
								</p>
								<p className="text-[10px] md:text-xs text-gray-300">
									AI for plant disease detection
								</p>
							</div>
						</div>
					</div>
				</CardContent>
				<div className="absolute top-0 rounded-2xl right-0 h-full w-1/4 bg-gradient-to-b from-purple-500/30 to-transparent"></div>
			</Card>
		</div>
	);
}
