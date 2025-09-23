import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { removeToast, showToast } from "../toast";
import RequestHandler from "../../lib/utilities/RequestHandler";

export default function EditSprayModal({
    spray,
    open,
    onClose,
    fetchData,
}: {
    spray: any;
    open: boolean;
    onClose: () => void;
    fetchData: () => void;
}) {
    const [form, setForm] = useState({
        name: spray?.name || "",
        description: spray?.description || "",
        activeIngredients: spray?.activeIngredients || "",
        targetDisease: spray?.targetDisease || "",
    });

    const handleSave = async () => {
        const toastId = showToast("Saving changes...", "loading");
        try {
            const response = await RequestHandler.fetchData(
                "post",
                `spray/update/${spray.id}`,
                form,
                {}
            );

            removeToast(toastId);
            if (response.success) {
                showToast("Spray updated successfully!", "success");
                fetchData();
                onClose();
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            removeToast(toastId);
            showToast("Failed to update spray", "error");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-gray-900 text-gray-100 border border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-white">Edit Spray</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">
                            Spray Name
                        </label>
                        <input
                            placeholder="Name"
                            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            placeholder="Description"
                            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">
                            Active Ingredients
                        </label>
                        <textarea
                            placeholder="List of active ingredients"
                            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={form.activeIngredients}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    activeIngredients: e.target.value,
                                })
                            }
                        />

                    </div>


                    <div className="flex justify-end gap-2 pt-2">
                        <DialogClose asChild>
                            <Button
                                variant="ghost"
                                className="text-gray-300 hover:bg-gray-700"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleSave}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
