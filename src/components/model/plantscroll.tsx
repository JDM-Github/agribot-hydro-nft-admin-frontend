import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogOverlay,
} from "@radix-ui/react-dialog";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export default function PlantScroll({ plants }: { plants: any }) {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	return (
		<>
			<ScrollArea className="w-full whitespace-nowrap bg-gray-900 rounded-2xl p-2 lg:min-h-32">
				<div className="flex space-x-4 p-2 min-w-max">
					{plants.map((plant: any) => (
						<div
							key={plant.id}
							className="flex flex-col items-center cursor-pointer hover:opacity-80 focus:outline-none"
							onClick={() => setSelectedImage(plant.image)}
						>
							<img
								src={plant.image}
								alt={plant.name}
								className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-lg"
							/>
							<p className="text-white text-xs lg:text-sm mt-2 font-semibold">
								{plant.name}
							</p>
							<p className="text-gray-400 text-xs">
								Accuracy:{" "}
								{(Number(plant.latest_precision) * 100).toFixed(2)}%
							</p>
						</div>
					))}
				</div>
				<ScrollBar
					orientation="horizontal"
					className="bg-gray-800 rounded-lg"
				/>
			</ScrollArea>

			<Dialog
				open={!!selectedImage}
				onOpenChange={() => setSelectedImage(null)}
			>
				<DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
				<DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-4 rounded-lg shadow-xl z-51 border-0 focus:outline-none">
					{selectedImage && (
						<img
							src={selectedImage}
							alt="Zoomed In"
							className="max-w-full max-h-[80vh] object-contain rounded-lg"
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
