import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import clsx from "clsx";

export default function ManageDiseaseModal({
	open,
	onClose,
	allDiseases,
	plantDiseases,
	onSave,
}: {
	open: boolean;
	onClose: () => void;
	allDiseases: string[];
	plantDiseases: string[];
	onSave: (selected: string[]) => void;
}) {
	const [selectedDiseases, setSelectedDiseases] = useState<string[]>([
		...plantDiseases,
	]);

	const toggleDisease = (disease: string) => {
		setSelectedDiseases((prev) =>
			prev.includes(disease)
				? prev.filter((d) => d !== disease)
				: [...prev, disease]
		);
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-xl bg-gray-900 text-gray-100 border border-gray-700">
				<DialogHeader>
					<DialogTitle>Manage Disease</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div className="text-sm text-gray-400">
						Toggle diseases to add or remove them from this plant.
					</div>

					<div className="flex flex-wrap gap-3">
						{allDiseases.map((disease) => {
							const isSelected =
								selectedDiseases.includes(disease);
							return (
								<button
									key={disease}
									onClick={() => toggleDisease(disease)}
									className={clsx(
										"px-4 py-2 rounded-xl text-sm font-medium transition-colors",
										isSelected
											? "bg-green-600 text-white hover:bg-green-700"
											: "bg-gray-800 text-gray-300 hover:bg-gray-700"
									)}
								>
									{disease}
								</button>
							);
						})}
					</div>

					<div className="flex justify-end gap-2 mt-4">
						<DialogClose asChild>
							<Button variant="ghost">Cancel</Button>
						</DialogClose>
						<Button
							className="bg-blue-600 hover:bg-blue-700 text-white"
							onClick={() => {
								onSave(selectedDiseases);
								onClose();
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
