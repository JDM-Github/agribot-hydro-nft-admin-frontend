import { toast, ToastOptions, Id } from "react-toastify";
import { CheckCircle, XCircle, Info, LoaderCircle, HelpCircle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const baseStyle = {
	background: "linear-gradient(to right, #030613, #0E1927)",
	color: "#EDEDED",
	border: "1px solid #EDEDED22",
	borderRadius: "8px",
	padding: "12px",
};

export const showToast = (
	message: string,
	type: "success" | "error" | "info" | "loading" = "success",
	timeout: number = 2000
): Id => {
	const icon =
		type === "success" ? (
			<CheckCircle className="text-green-500" size={20} />
		) : type === "error" ? (
			<XCircle className="text-red-500" size={20} />
		) : type === "loading" ? (
			<LoaderCircle className="text-yellow-500 animate-spin" size={20} />
		) : (
			<Info className="text-blue-400" size={20} />
		);

	const toastOptions: ToastOptions = {
		position: "top-right",
		autoClose: type === "loading" ? false : timeout,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		theme: "dark",
		style: {
			...baseStyle,
			borderLeft:
				type === "success"
					? "4px solid #4CAF50"
					: type === "error"
					? "4px solid #F44336"
					: type === "info"
					? "4px solid #2196F3"
					: "4px solid #FFB300",
		},
	};

	return toast(
		<div className="flex items-center gap-2">
			{icon}
			<span>{message}</span>
		</div>,
		toastOptions
	);
};

export const removeToast = (id: Id) => {
	toast.dismiss(id);
};

export const confirmToast = (
	message: string,
	onConfirm: () => void,
	onCancel?: () => void
): Id => {
	let confirmed = false;
	const toastId = toast(
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<HelpCircle className="text-yellow-400" size={20} />
				<span>{message}</span>
			</div>
			<div className="flex justify-end gap-2">
				<button
					onClick={() => {
						toast.dismiss(toastId);
					}}
					className="px-3 py-1 text-sm rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
				>
					Cancel
				</button>
				<button
					onClick={() => {
						confirmed = true;
						toast.dismiss(toastId);
						onConfirm();
					}}
					className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
				>
					Confirm
				</button>
			</div>
		</div>,
		{
			position: "top-right",
			autoClose: false,
			closeOnClick: false,
			draggable: false,
			hideProgressBar: true,
			theme: "dark",
			onClose: () => {
				if (!confirmed) onCancel?.();
			},
			style: {
				...baseStyle,
				borderLeft: "4px solid #FFB300",
			},
		}
	);
	return toastId;
};