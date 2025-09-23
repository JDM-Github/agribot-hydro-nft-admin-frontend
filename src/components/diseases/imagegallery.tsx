import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogOverlay,
} from "@radix-ui/react-dialog";

export default function ImageGallery({ disease }: { disease: any }) {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	return (
		<div className="w-full md:w-2/3 flex gap-2 flex-nowrap overflow-x-auto p-2 border border-gray-700 rounded-lg">
			{disease.all_images.map((img: any, index: any) => (
				<>
					<div key={index} className="min-w-[60px]">
						<button
							key={index}
							onClick={() => setSelectedImage(img)}
							className="focus:outline-none w-24 h-24 "
						>
							<img
								src={img}
								alt={`Sample ${index + 1}`}
								className="w-24 h-24 object-cover rounded-lg shadow-lg cursor-pointer transition-transform duration-200 hover:scale-105"
							/>
						</button>
					</div>
				</>
			))}

			<Dialog
				open={!!selectedImage}
				onOpenChange={() => setSelectedImage(null)}
			>
				<DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
				<DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-4 rounded-lg shadow-xl z-51">
					{selectedImage && (
						<img
							src={selectedImage}
							alt="Zoomed In"
							className="max-w-full max-h-[80vh] object-contain rounded-lg"
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
