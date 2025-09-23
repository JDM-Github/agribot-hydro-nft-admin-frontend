import React, { useState } from "react";
import { X, Check } from "lucide-react";

interface Spray {
	id: number;
	name: string;
}

interface EditSprayModalProps {
	sprays: Spray[];
	setSprays: any;
	isOpen: boolean;
	onClose: () => void;
	initialSprays: number[];
	onSave: (updatedSprays: number[]) => void;
}

const EditSprayModal: React.FC<EditSprayModalProps> = ({
	sprays,
	isOpen,
	onClose,
	initialSprays,
	onSave,
}) => {

	const [selected, setSelected] = useState<number[]>([...initialSprays]);

	const toggleSpray = (id: number) => {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};

	const handleSave = () => {
		onSave(selected);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
			<div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-lg border border-gray-700">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-white">
						Select Sprays
					</h2>
					<button onClick={onClose}>
						<X className="text-gray-400 hover:text-red-400" />
					</button>
				</div>

				<div className="space-y-2 max-h-64 overflow-y-auto pr-2">
					{sprays.map((spray: Spray) => (
						<div
							key={spray.id}
							onClick={() => toggleSpray(spray.id)}
							className={`flex items-center justify-between px-4 py-2 rounded-xl cursor-pointer border ${selected.includes(spray.id)
								? "bg-green-700 border-green-600"
								: "bg-gray-800 border-gray-700"
								}`}
						>
							<span className="text-white">{spray.name}</span>
							{selected.includes(spray.id) && (
								<Check className="text-white" size={18} />
							)}
						</div>
					))}
				</div>

				<div className="mt-6 flex justify-end gap-2">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditSprayModal;
