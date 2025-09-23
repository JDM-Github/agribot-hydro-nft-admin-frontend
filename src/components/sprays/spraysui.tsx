import { useState } from "react";
import { Button } from "../ui/button";
import EditSprayModal from "./spraymodal";
import { confirmToast, removeToast, showToast } from "../toast";
import RequestHandler from "../../lib/utilities/RequestHandler";
import HighlightOverlay from "../highlight";
import ViewOpenSpray from "./viewopenspray";

export default function SprayDetails({
	spray,
	fetchData,
}: {
	spray: any;
	fetchData: any;
}) {
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedSpray, setSelectedSpray] = useState(null);
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [showConfirmToast, setShowConfirmToast] = useState(false);

	const handleDelete = () => {
		setShowConfirmToast(true);
		confirmToast(
			"Are you sure you want to delete this spray?",
			async () => {
				const toastId = showToast("Deleting spray...", "loading");
				try {
					const response = await RequestHandler.fetchData(
						"delete",
						`spray/delete/${spray.id}`
					);
					removeToast(toastId);
					if (response.success) {
						showToast("Spray deleted successfully!", "success");
						fetchData();
					} else {
						throw new Error(response.message);
					}
					setShowConfirmToast(false);
				} catch (err) {
					removeToast(toastId);
					showToast("Failed to delete spray", "error");
					setShowConfirmToast(false);
				}
			},
			() => setShowConfirmToast(false)
		);
		
	};


	return (
		<>
			{showConfirmToast && <HighlightOverlay />}
			<tr className="bg-gray-950 border-gray-800 border">
				<td colSpan={4} className="p-4 w-full">
					<div className="flex flex-col md:flex-row justify-between w-full space-y-4 md:space-y-0">
						<div className="space-y-2 w-full md:w-2/3">
							<p className="text-gray-400">
								<strong className="text-blue-300">
									Description:
								</strong>{" "}
								{spray.description}
							</p>

							<p className="text-gray-400 mt-2">
								<strong className="text-green-300">
									Active Ingredients:
								</strong>{" "}
								{spray.activeIngredients}
							</p>
						</div>
						<Button
							className="w-full sm:w-auto min-w-[150px] text-white border-gray-600 hover:bg-gray-700"
							onClick={() => {
								setSelectedSpray(spray);
								setEditModalOpen(true);
							}}
						>
							Edit Spray
						</Button>
						<Button
							variant="destructive"
							className="text-white border-gray-600 hover:bg-red-700 bg-red-600"
							onClick={handleDelete}
						>
							Delete Spray
						</Button>

						<Button
							className="text-white border-gray-600 hover:bg-green-500 bg-green-700"
							onClick={() => setViewModalOpen(true)}
						>
							View Spray
						</Button>
					</div>

				</td>
			</tr>
			{selectedSpray && (
				<EditSprayModal
					spray={selectedSpray}
					open={editModalOpen}
					onClose={() => setEditModalOpen(false)}
					fetchData={fetchData}
				/>
			)}
			{viewModalOpen && (
				<ViewOpenSpray viewModalOpen={viewModalOpen} setViewModalOpen={setViewModalOpen} spray={spray}/>
			)}
		</>
	);
}
