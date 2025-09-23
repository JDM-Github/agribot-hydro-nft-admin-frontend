import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface ReportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    jsonData: any;
}

export default function ReportModal({ open, onOpenChange, jsonData }: ReportModalProps) {
    const reportRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (reportRef.current) {
            const dataUrl = await htmlToImage.toPng(reportRef.current);
            const link = document.createElement("a");
            link.download = "agribot-report.png";
            link.href = dataUrl;
            link.click();
        }
    };
    const handleDownloadJSON = () => {
        if (!jsonData) return;
        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "agribot-report.json";
        link.click();
        URL.revokeObjectURL(url);
    };

    if (jsonData === null) {
        return null;
    }

    return (
        <AnimatePresence>
            {open && jsonData && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative bg-gray-950 text-gray-100 rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 border border-gray-700"
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
                        >
                            ✕
                        </button>

                        {/* Report HTML */}
                        <div ref={reportRef} className="border border-gray-700 bg-gray-800 text-gray-100">
                            <div
                                dangerouslySetInnerHTML={{
                            __html: `
<html>
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-800 text-gray-100 font-sans">

    <!-- Header -->
    <div class="bg-gray-900 py-4 px-6 mb-2 flex items-center justify-between rounded-b-lg shadow-md">
        <div class="flex items-center space-x-3">
            <img src="https://res.cloudinary.com/dy6z8wadm/image/upload/v1758607551/LOGO_abjkb1.ico" alt="AGRIBOT Logo" class="h-12 w-12">
            <span class="text-3xl font-bold">AGRIBOT</span>
        </div>
        <div class="text-right text-gray-200 text-sm">
            <div>Generated: ${new Date().toLocaleDateString()}</div>
            <div>Plants Detected: ${jsonData.detectedPlants.length}</div>
        </div>
    </div>

    <div class="border border-gray-600 p-2 rounded-lg">

        <div class="grid grid-cols-3 gap-4 mb-4">
            <!-- Object Detection -->
            <div class="relative bg-gray-900 rounded-lg p-4 shadow-inner border-l-4 border-purple-500 flex justify-between items-center overflow-hidden">
                <span class="text-sm font-semibold text-gray-100 z-10">Object Detection</span>
                <span class="text-sm font-bold text-gray-200 z-10">${jsonData.objectDetection} (${jsonData.objectDetectionConfidence})</span>
                <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
            </div>

            <!-- Stage Classification -->
            <div class="relative bg-gray-900 rounded-lg p-4 shadow-inner border-l-4 border-yellow-500 flex justify-between items-center overflow-hidden">
                <span class="text-sm font-semibold text-gray-100 z-10">Stage Classification</span>
                <span class="text-sm font-bold text-gray-200 z-10">${jsonData.stageClassification} (${jsonData.stageClassificationConfidence})</span>
                <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
            </div>

            <!-- Disease Segmentation -->
            <div class="relative bg-gray-900 rounded-lg p-4 shadow-inner border-l-4 border-red-500 flex justify-between items-center overflow-hidden">
                <span class="text-sm font-semibold text-gray-100 z-10">Disease Segmentation</span>
                <span class="text-sm font-bold text-gray-200 z-10">${jsonData.diseaseSegmentation} (${jsonData.diseaseSegmentationConfidence})</span>
                <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
            </div>
        </div>

        <div class="bg-gray-900 rounded-lg p-2 mb-2 shadow-inner">
            <div class="grid grid-cols-4 gap-2">
                ${jsonData.sprays.spray.map((s: any, i: number) => `
                    <div class="flex items-center space-x-2 text-sm border ${jsonData.sprays.active[i] ? 'border-blue-300' : 'border-gray-700'} rounded px-2 py-1">
                        <span>${s}</span>
                        <span class="text-gray-300">(${jsonData.sprays.duration[i]} secs)</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="bg-gray-900 rounded-lg p-4 mb-4 shadow-inner">
            <div class="flex flex-wrap gap-6 text-sm mb-3">
                <div><strong class="text-purple-300">Frequency:</strong> ${jsonData.schedule.frequency}</div>
                <div><strong class="text-purple-300">Days:</strong> ${jsonData.schedule.days.join(', ')}</div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-sm">
                ${jsonData.schedule.runs.map((run: any) => `
                    <div class="bg-gray-800 rounded px-2 py-1">
                        ⏰ ${run.time} - ${run.upto}
                    </div>
                `).join('')}
            </div>
        </div>

        ${jsonData.detectedPlants.map((p: any) => `
            <div class="bg-gray-900 rounded-lg p-4 mb-4 shadow-inner ${p.disabled ? 'opacity-60' : ''}">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <img src="${p.image}" alt="Plant Logo" class="h-10 w-10 rounded-full border border-gray-700">
                        <h2 class="text-green-400 text-xl font-bold">${p.key}</h2>
                    </div>
                    <p class="text-sm text-gray-200">
                        <strong>Timestamp:</strong> ${p.timestamp} | 
                        ${p.willSprayEarly ? '<strong>Spray Early:</strong> ✅' : ''}
                        ${p.disabled ? '<span class="ml-2 text-red-400 font-semibold">🚫 Disabled</span>' : ''}
                    </p>
                </div>

                <div class="grid grid-cols-3 gap-2">
                    ${Object.entries(p.disease)
                    .filter(([_, values]: [string, any]) => values.some((v: any) => v))
                    .map(([disease]) => {
                    const times = p.disease_time_spray[disease].join(', ');
                    return `<div class="bg-gray-800 text-sm rounded px-2 py-1 truncate">${disease} (${times})</div>`;
                }).join('')}
                </div>
            </div>
        `).join('')}
    </div>

    <div class="text-center text-gray-400 text-xs mt-6 py-4 bg-gray-900 rounded-t-lg shadow-md">
        © 2025 AGRIBOT. All Rights Reserved.
    </div>

</body>
</html>
                            `
                                }}
                            />
                        </div>

                        <div className="flex justify-end mt-4 gap-3">
                            <Button onClick={handleDownloadJSON}>Download JSON</Button>
                            <Button onClick={handleDownload}>Download as Image</Button>
                            <Button onClick={() => onOpenChange(false)}>Close</Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
