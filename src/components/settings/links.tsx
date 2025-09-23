import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import {
	SiGithub,
	SiLinkedin,
	SiFacebook,
	SiMinutemailer,
} from "react-icons/si";
import { useState } from "react";
import { removeToast, showToast } from "../toast";
import { useAuth } from "../../context/auth";
import RequestHandler from "../../lib/utilities/RequestHandler";
// import { toast } from "react-toastify";

export default function Links({
	user,
	selectedTab,
}: {
	user: any;
	selectedTab: string;
}) {
	const { login } = useAuth();
	const [socialLinks, setSocialLinks] = useState({
		facebook: user.socialLinks.facebook || "",
		linkedin: user.socialLinks.linkedin || "",
		github: user.socialLinks.github || "",
		email: user.email || "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setSocialLinks((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		const toastId = showToast("Updating user social links...", "loading");

		try {
			const response = await RequestHandler.fetchData(
				"post",
				`admin/update-social/${user.id}`,
				{ socialLinks }
			);
			if (response.success) {
				login(null, response.user);
				removeToast(toastId);
				showToast("Changes saved successfully!", "success");
			} else {
				throw new Error(response.message);
			}
		} catch (err: any) {
			removeToast(toastId);
			showToast("Failed to save changes.", "error");
		}
	};

	return (
		<>
			{selectedTab === "links" && (
				<Card className="bg-gray-900 shadow-lg rounded-lg border-0">
					<CardContent className="space-y-6">
						<h2 className="text-white text-xl font-semibold border-b border-gray-700 pb-2">
							Social Links
						</h2>
						<div>
							<label className="text-gray-400 text-sm flex items-center gap-2">
								<SiFacebook
									size={16}
									className="text-blue-500"
								/>
								Facebook
							</label>
							<Input
								type="url"
								name="facebook"
								value={socialLinks.facebook || ""}
								onChange={handleChange}
								style={{ backgroundColor: "#00000011" }}
								className="mt-1 text-gray-500 border-gray-600"
							/>
						</div>
						<div>
							<label className="text-gray-400 text-sm flex items-center gap-2">
								<SiMinutemailer
									size={16}
									className="text-blue-400"
								/>
								Email
							</label>
							<Input
								type="url"
								name="email"
								value={socialLinks.email || ""}
								onChange={handleChange}
								style={{ backgroundColor: "#00000011" }}
								className="mt-1 text-gray-500 border-gray-600"
							/>
						</div>
						<div>
							<label className="text-gray-400 text-sm flex items-center gap-2">
								<SiLinkedin
									size={16}
									className="text-blue-400"
								/>
								Linkedin
							</label>
							<Input
								type="url"
								name="linkedin"
								value={socialLinks.linkedin || ""}
								onChange={handleChange}
								style={{ backgroundColor: "#00000011" }}
								className="mt-1 text-gray-500 border-gray-600"
							/>
						</div>
						<div>
							<label className="text-gray-400 text-sm flex items-center gap-2">
								<SiGithub size={16} className="text-gray-300" />
								GitHub
							</label>
							<Input
								type="url"
								name="github"
								value={socialLinks.github || ""}
								onChange={handleChange}
								style={{ backgroundColor: "#00000011" }}
								className="mt-1 text-gray-500 border-gray-600"
							/>
						</div>

						<div className="flex justify-end">
							<Button
								onClick={handleSave}
								className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition"
							>
								Save
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</>
	);
}
