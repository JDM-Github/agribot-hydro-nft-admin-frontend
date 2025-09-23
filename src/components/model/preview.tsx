import { Package, Image, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import AgribotViewer from "../viewer";

export default function Preview({
	setShowMaterials,
}: {
	setShowMaterials: Function;
}) {
	const [isModelLoaded, setIsModelLoaded] = useState(false);
	const [isImageView, setIsImageView] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);

	const images = [
		"/AGRIBOT.png",
		"/AGRIBOT2.png",
		"/AGRIBOT-Body.png",
		"/AGRIBOT-Body2.png",
		"/AGRIBOT-HEAD.png",
		"/AGRIBOT-HEAD2.png",
	];

	const prevImage = () => {
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	const nextImage = () => {
		setCurrentIndex((prev) => (prev + 1) % images.length);
	};

	return (
		<Card className="relative bg-gradient-to-b from-gray-950 to-green-950/50 border-0 min-h-[400px] min-lg:h-[400px] mb-3 overflow-hidden p-2 height-auto">
			<div className="absolute right-4 flex space-x-2 z-10">
				<Button
					variant="outline"
					size="sm"
					className="text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white bg-transparent"
					onClick={() => setShowMaterials(true)}
				>
					<Package size={16} className="mr-2" />
					Materials
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white bg-transparent"
					onClick={() => setIsImageView(!isImageView)}
				>
					<Image size={16} className="mr-2" />
					{!isImageView ? "View 2D" : "View 3D"}
				</Button>
			</div>

			{!isModelLoaded && !isImageView ? (
				<div className="flex items-center justify-center h-full">
					<Button
						variant="outline"
						size="lg"
						className="text-white bg-transparent border-gray-700 hover:bg-gray-800 hover:text-white"
						onClick={() => setIsModelLoaded(true)}
					>
						Load 3D Model
					</Button>
				</div>
			) : isImageView ? (
				<div className="flex flex-col h-full">
					<div className="relative flex-1 flex items-center justify-center max-h-[400px]">
						<img
							src={images[currentIndex]}
							alt={`AGRIBOT Image ${currentIndex + 1}`}
							className="object-contain w-full h-full rounded"
						/>
						<Button
							variant="ghost"
							size="sm"
							className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
							onClick={prevImage}
						>
							<ChevronLeft size={20} />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
							onClick={nextImage}
						>
							<ChevronRight size={20} />
						</Button>
					</div>

					<div className="flex justify-center items-center gap-2 mt-2 overflow-x-auto">
						{images.map((img, index) => (
							<img
								key={index}
								src={img}
								alt={`Thumbnail ${index + 1}`}
								className={`w-16 h-16 bg-gray-900/80 object-contain rounded cursor-pointer border-2 ${currentIndex === index ? "border-green-500" : "border-transparent"
									}`}
								onClick={() => setCurrentIndex(index)}
							/>
						))}
					</div>
				</div>
			) : (
				<AgribotViewer />
			)}
		</Card>
	);
}
