import { useState } from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "../ui/dialog";

export default function CreateSprayModal({
    open,
    setOpen,
    onCreate,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
    onCreate: (spray: {
        name: string;
        description: string;
        activeIngredients: string;
    }) => void;
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [activeIngredients, setActiveIngredients] = useState("");

    const handleSubmit = () => {
        if (!name.trim()) return; 
        onCreate({ name, description, activeIngredients });
        setOpen(false);
        setName("");
        setDescription("");
        setActiveIngredients("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg bg-gray-900 text-gray-100 border border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-white">Add New Spray</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">
                            Spray Name
                        </label>
                        <input
                            placeholder="Set Name"
                            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">
                            Active Ingredients
                        </label>
                        <textarea
                            value={activeIngredients}
                            onChange={(e) => setActiveIngredients(e.target.value)}
                            placeholder="List active ingredients"
                            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Create
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
