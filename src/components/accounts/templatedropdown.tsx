import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";

const templates = [
    {
        title: "Thank You",
        content: `Thank you for your valuable feedback! We truly appreciate your time and input.`
    },
    {
        title: "Follow-Up",
        content: `We wanted to follow up regarding your recent feedback to ensure everything is going smoothly.`
    },
    {
        title: "Apology",
        content: `We sincerely apologize for any inconvenience you may have experienced and appreciate your understanding.`
    },
    {
        title: "Information Request",
        content: `We need a bit more information regarding your feedback to assist you effectively.`
    }
];


export default function TemplateDropdown({ insertTemplate }: { insertTemplate: (text: string) => void }) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex items-center gap-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-white">
                Templates <ChevronDown size={14} />
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className="bg-gray-800 border border-gray-700 rounded-md shadow-lg w-64">
                {templates.map((t, i) => (
                    <DropdownMenu.Item
                        key={i}
                        className="px-3 py-2 hover:bg-green-600 cursor-pointer text-white rounded-md"
                        onClick={() => insertTemplate(t.content)}
                    >
                        {t.title}
                    </DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}
