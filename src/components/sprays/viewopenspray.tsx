import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "../ui/dialog";

export default function ViewOpenSpray({
    viewModalOpen, setViewModalOpen, spray
}: {
    viewModalOpen: any;
    setViewModalOpen: any;
    spray: any;
}) {
    return <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-lg bg-gray-900 text-gray-100 border border-gray-700">
            <DialogHeader>
                <DialogTitle className="text-white">
                    View Spray
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">
                        Spray Name
                    </label>
                    <p className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700">
                        {spray.name}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">
                        Description
                    </label>
                    <p className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 whitespace-pre-wrap">
                        {spray.description}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">
                        Active Ingredients
                    </label>
                    <p className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 whitespace-pre-wrap">
                        {spray.activeIngredients}
                    </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <DialogClose asChild>
                        <Button
                            variant="ghost"
                            className="text-gray-300 hover:bg-gray-700"
                        >
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </div>
        </DialogContent>
    </Dialog>
}