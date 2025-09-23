import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { FileTextIcon, MailIcon, UserIcon, CameraIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import RequestHandler from "../../lib/utilities/RequestHandler";
import { removeToast, showToast } from "../toast";
import { useAuth } from "../../context/auth";

export default function Profile({
	user,
	selectedTab,
}: {
	user: any;
	selectedTab: string;
}) {
	const { login } = useAuth();
	const [username, setUsername] = useState(user.username);
	const [email, setEmail] = useState(user.email);
	const [bio, setBio] = useState(user.bio);
	const [profileImage, setProfileImage] = useState<string | null>(
		user.profileImage
	);
	const [profileFile, setProfileFile] = useState<File | null>(null);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setProfileFile(file);
			const reader = new FileReader();
			reader.onload = () => {
				setProfileImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = async () => {
		const toastId = showToast("Updating user information...", "loading");

		const formData = new FormData();
		formData.append("username", username);
		formData.append("email", email);
		formData.append("bio", bio);
		if (profileFile) {
			formData.append("profileImage", profileFile);
		}
		try {
			const response = await RequestHandler.fetchData(
				"post",
				`admin/update/${user.id}`,
				formData,
				{}
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
			{selectedTab === "profile" && (
				<Card className="bg-gray-900 shadow-lg rounded-lg border-0 p-6">
					<CardContent className="space-y-6">
						<h2 className="text-xl font-semibold border-b border-gray-700 pb-2 text-white flex items-center justify-between">
							Profile
						</h2>

						<div className="flex flex-col items-center gap-3">
							<div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-600">
								<img
									src={profileImage || "/default-profile.png"}
									alt="Profile"
									className="w-full h-full object-cover"
								/>
							</div>

							<label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm">
								<CameraIcon size={16} />
								Change Profile Picture
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageChange}
								/>
							</label>
						</div>

						<div>
							<label className="text-gray-400 text-sm flex items-center gap-2">
								<UserIcon size={16} className="text-gray-500" />
								Username
							</label>
							<Input
								type="text"
								value={username || ""}
								onChange={(e) => setUsername(e.target.value)}
								style={{ backgroundColor: "#00000011" }}
								className="mt-1 text-gray-500 border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
							/>
						</div>

						<div>
							<label className="text-gray-400 text-sm flex items-center gap-2">
								<MailIcon size={16} className="text-gray-500" />
								Email
							</label>
							<Input
								type="email"
								value={email || ""}
								onChange={(e) => setEmail(e.target.value)}
								style={{ backgroundColor: "#00000011" }}
								className="mt-1 text-gray-500 border-gray-600"
							/>
						</div>

						<div>
							<label className="text-gray-400 text-sm flex items-center gap-2">
								<FileTextIcon
									size={16}
									className="text-gray-500"
								/>
								Bio
							</label>
							<Textarea
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								rows={5}
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
