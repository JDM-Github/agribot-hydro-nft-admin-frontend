import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { removeToast, showToast } from "../toast";
import RequestHandler from "../../lib/utilities/RequestHandler";
import MessageEditor from "./messageeditor";

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
    fullName: string;
}



export default function MessageModal({ isOpen, onClose, userId, fullName }: MessageModalProps) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const buildEmailHtml = (fullName: string, message: string) => {
        return `
        <div style="max-width: 600px; margin: auto; background-color: #1f2937; padding: 28px; border-radius: 14px; border: 2px solid #34d399; color: #f3f4f6; font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #34d399; font-weight: bold; font-size: 26px; margin-bottom: 20px; letter-spacing: 0.5px;">ADMIN - AGRIBOT</h2>

            <p style="margin-bottom: 16px; color: #fff">Good day <strong>${fullName}</strong>,</p>

            <div style="color: #f9fafb; margin-bottom: 24px;">
                ${message}
            </div>

            <p style="margin-bottom: 12px; color: #fff">Thank you for your time and feedback. Your input helps us improve AGRIBOT and provide better service to all users.</p>
            <p style="font-weight: bold; color: #34d399; margin-bottom: 16px;">Best regards,<br/>The AGRIBOT Team</p>

            <hr style="border: 1px solid #34d399; margin: 20px 0;" />

            <p style="font-size: 0.9em; color: #9ca3af; margin-bottom: 4px;">
                For more information, questions, or assistance, feel free to email us at 
                <a href="mailto:support@agribot.com" style="color: #34d399; text-decoration: underline;">agribothydroteam@gmail.com</a>.
            </p>
            <p style="font-size: 0.8em; color: #6b7280;">Email sent on ${new Date().toLocaleDateString()}</p>
            </div>
        `;
    };


    const wrapSelection = (tag: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = message.slice(start, end) || "text";

        const before = message.slice(0, start);
        const after = message.slice(end);
        const wrapped = `<${tag}>${selected}</${tag}>`;

        setMessage(before + wrapped + after);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tag.length + 2, start + tag.length + 2 + selected.length);
        }, 0);
    };

    const handleSend = async () => {
        if (!message.trim()) return showToast("Message cannot be empty", "error");
        setLoading(true);

        const toastId = showToast("Sending email message...", "loading");
        try {
            const fullHtml = buildEmailHtml(fullName, message);
            const response = await RequestHandler.fetchData("post", "feedback/send-message", {
                userId,
                message,
                html: fullHtml
            });

            removeToast(toastId);
            if (response.success) {
                showToast("Message sent successfully", "success");
                setMessage("");
                onClose();
            } else {
                showToast(response.message || "Failed to send message", "error");
                throw new Error(response.message || "Failed to send message");
            }
        } catch (err: any) {
            removeToast(toastId);
            console.error("Send message error:", err);
            showToast(err.message || "Unknown error", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
                e.preventDefault();
                wrapSelection("b");
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
                e.preventDefault();
                wrapSelection("i");
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [message, isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-6xl h-[80vh] p-6 shadow-xl flex flex-col md:flex-row gap-6"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                    >
                        <div className="flex-1 flex flex-col">
                            <MessageEditor
                                message={message}
                                setMessage={setMessage}
                                textareaRef={textareaRef}
                                wrapSelection={wrapSelection}
                                onClose={onClose}
                                handleSend={handleSend}
                                loading={loading}
                            />
                        </div>

                        <div className="flex-1 flex flex-col">
                            <h4 className="text-xl font-bold text-green-400 mb-3">Preview</h4>
                            <div className="flex-1 overflow-auto">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: message ? `
                    <div style="max-width: 600px; margin: auto; background-color: #1f2937; padding: 28px; border-radius: 14px; border: 2px solid #34d399; color: #f3f4f6; font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2 style="color: #34d399; font-weight: bold; font-size: 26px; margin-bottom: 20px; letter-spacing: 0.5px;">ADMIN - AGRIBOT</h2>
                        
                        <p style="margin-bottom: 16px;">Good day <strong>${fullName}</strong>,</p>

                        <div style="color: #f9fafb; margin-bottom: 24px;">
                            ${message}
                        </div>

                        <p style="margin-bottom: 12px;">Thank you for your time and feedback. Your input helps us improve AGRIBOT and provide better service to all users.</p>
                        <p style="font-weight: bold; color: #34d399; margin-bottom: 16px;">Best regards,<br/>The AGRIBOT Team</p>

                        <hr style="border: 1px solid #34d399; margin: 20px 0;" />

                        <p style="font-size: 0.9em; color: #9ca3af; margin-bottom: 4px;">
                            For more information, questions, or assistance, feel free to email us at 
                            <a href="mailto:support@agribot.com" style="color: #34d399; text-decoration: underline;">agribothydroteam@gmail.com</a>.
                        </p>
                        <p style="font-size: 0.8em; color: #6b7280;">Email sent on ${new Date().toLocaleDateString()}</p>
                    </div>
                ` : `<i style="color: #6b7280;">Nothing to preview...</i>`
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
