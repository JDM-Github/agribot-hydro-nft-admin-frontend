import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ImagePlus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import RequestHandler from "../../lib/utilities/RequestHandler";
import { removeToast, showToast } from "../toast";

export default function EditPlantModal({
	plant,
	open,
	onClose,
	fetchData,
}: {
	plant: any;
	open: any;
	onClose: any;
	fetchData: any
}) {
	const [name, setName] = useState(plant.name);
	const [description, setDescription] = useState(plant.description);
	const [images, setImages] = useState<(string | File)[]>([
		...plant.all_images,
	]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleRemoveImage = (index: number) => {
		if (isUploading) return;
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleAddImage = (file: File) => {
		if (isUploading) return;
		if (!file.type.startsWith("image/")) return;
		setImages((prev) => [...prev, file]);
	};

	const handleDrop = (e: React.DragEvent) => {
		if (isUploading) return;
		e.preventDefault();
		if (e.dataTransfer.files.length > 0) {
			Array.from(e.dataTransfer.files).forEach((file) => {
				handleAddImage(file as File);
			});
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		if (isUploading) return;
		e.preventDefault();
		const items = e.clipboardData.items;
		for (const item of items) {
			if (item.type.startsWith("image")) {
				const file = item.getAsFile();
				if (file) handleAddImage(file);
			}
		}
	};

	useEffect(() => {
		return () => {
			images.forEach((img) => {
				if (typeof img !== "string") {
					URL.revokeObjectURL(URL.createObjectURL(img));
				}
			});
		};
	}, [images]);

	return (
		<Dialog open={open} onOpenChange={isUploading ? null : onClose}>
			<DialogContent
				className="max-w-2xl bg-gray-900 text-gray-100 border border-gray-700"
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}
				onPaste={handlePaste}
			>
				<DialogHeader>
					<DialogTitle className="text-white">Edit Plant</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div className="mb-4">
						<label className="block text-sm font-semibold text-gray-300 mb-1">
							Plant Name
						</label>
						<input
							type="text"
							placeholder="Enter plant name"
							className="w-full px-4 py-2 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500 transition-all duration-200"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-sm font-medium text-gray-300">
							Description
						</label>
						<Textarea
							className="mt-1 bg-gray-800 text-white border border-gray-700 placeholder:text-gray-400"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div className="grid grid-cols-3 gap-4">
						{images.map((img, index) => {
							const src =
								typeof img === "string"
									? img
									: URL.createObjectURL(img);
							return (
								<div key={index} className="relative group">
									<img
										src={src}
										alt={`plant-${index}`}
										className="rounded-lg object-cover h-32 w-full"
									/>
									<button
										onClick={() => handleRemoveImage(index)}
										className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-80"
									>
										<X size={16} />
									</button>
								</div>
							);
						})}

						<div
							onClick={() => fileInputRef.current?.click()}
							className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-600 bg-gray-800 rounded-lg cursor-pointer hover:border-gray-500"
						>
							<ImagePlus
								className="text-gray-400 mb-1"
								size={24}
							/>
							<span className="text-xs text-gray-400">
								Add Image
							</span>
							<input
								disabled={isUploading}
								ref={fileInputRef}
								type="file"
								accept="image/*"
								hidden
								multiple
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>
								) => {
									const files = e.target.files;
									if (files && files.length > 0) {
										Array.from(files).forEach(
											(file: File) => {
												handleAddImage(file);
											}
										);
									}
								}}
							/>
						</div>
					</div>

					<div className="flex justify-end gap-2 pt-2">
						<DialogClose asChild>
							<Button
								disabled={isUploading}
								variant="ghost"
								className="text-gray-300 hover:bg-gray-700"
							>
								Cancel
							</Button>
						</DialogClose>
						<Button
							disabled={isUploading}
							className="bg-blue-600 hover:bg-blue-700 text-white"
							onClick={async () => {
								setIsUploading(true);
								const toastId = showToast(
									"Uploading images...",
									"loading"
								);
								const formData = new FormData();

								formData.append("name", name);
								formData.append("description", description);
								for (const img of images) {
									if (typeof img !== "string") {
										formData.append("images", img);
									} else {
										formData.append("existingImages", img);
									}
								}

								try {
									const response =
										await RequestHandler.fetchData(
											"post",
											`plant/update/${plant.id}`,
											formData,
											{}
										);
									if (response.success) {
										removeToast(toastId);
										showToast(
											"Changes saved successfully!",
											"success"
										);
									} else {
										throw new Error(response.message);
									}
								} catch (err: any) {
									if (err.message === "timeout") {
										removeToast(toastId);
										showToast(
											"Please wait, the upload is in progress...",
											"info"
										);
									} else {
										removeToast(toastId);
										showToast(
											"Failed to save changes.",
											"error"
										);
									}
								} finally {
									setIsUploading(false);
									onClose();
									fetchData();
								}
							}}
						>
							Save Changes
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
