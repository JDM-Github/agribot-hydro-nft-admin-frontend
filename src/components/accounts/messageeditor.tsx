import { useState } from "react";
import { Bold, Italic, Underline, Palette, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import TemplateDropdown from "./templatedropdown";

export default function MessageEditor({
    message,
    setMessage,
    textareaRef,
    wrapSelection,
    onClose,
    handleSend,
    loading,
}: any) {
    const [pendingColor, setPendingColor] = useState<string | null>(null);
    const [selectedText, setSelectedText] = useState<string>("");

    const insertTemplate = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = message.slice(0, start);
        const after = message.slice(end);

        setMessage(before + text + after);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    };

    const applyColor = () => {
        if (!pendingColor || !selectedText) return;
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const coloredText = `<span style="color:${pendingColor}">${selectedText}</span>`;
        const before = message.slice(0, start);
        const after = message.slice(end);

        setMessage(before + coloredText + after);

        const cursorPos = before.length + coloredText.length;
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(cursorPos, cursorPos);
        }, 0);

        setPendingColor(null);
        setSelectedText("");
    };

    return (
        <div className="flex-1 flex flex-col gap-4 bg-gray-950 p-4 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-white">Message</h3>

            <div className="flex flex-wrap gap-2 items-center bg-gray-900 p-2 rounded-md shadow-inner">
                <button onClick={() => wrapSelection("b")} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white">
                    <Bold size={16} />
                </button>
                <button onClick={() => wrapSelection("i")} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white">
                    <Italic size={16} />
                </button>
                <button onClick={() => wrapSelection("u")} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white">
                    <Underline size={16} />
                </button>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white flex items-center gap-1">
                        <Palette size={16} /> Color
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="bg-gray-800 border border-gray-700 rounded-md shadow-lg p-2">
                        <input
                            type="color"
                            value={pendingColor || "#FFFFFF"}
                            onChange={(e) => {
                                const textarea = textareaRef.current;
                                if (!textarea) return;
                                const selText = message.slice(textarea.selectionStart, textarea.selectionEnd) || "text";
                                setSelectedText(selText);
                                setPendingColor(e.target.value);
                            }}
                            className="w-10 h-10 cursor-pointer border-0 p-0 rounded-md"
                        />
                        <button
                            onClick={applyColor}
                            className="mt-2 w-full py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                        >
                            Apply
                        </button>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                <TemplateDropdown insertTemplate={insertTemplate}/>

                <button
                    onClick={() => setMessage("")}
                    className="ml-auto p-2 bg-red-600 hover:bg-red-700 rounded-md text-white flex items-center gap-1"
                >
                    <Trash2 size={16} /> Clear
                </button>
            </div>

            <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 w-full p-4 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={10}
                placeholder="Write your message here with HTML tags..."
            />

            <div className="flex justify-end gap-2 mt-2">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    );
}
