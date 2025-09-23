import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

export default function Logout({ selectedTab }: { selectedTab: string }) {
	const navigate = useNavigate();

	const handleLogout = () => {
		Cookies.remove("token");
		localStorage.removeItem("user");
		navigate("/");
	}

	return (
		<>
			{selectedTab === "logout" && (
				<div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center border-0">
					<h2 className="text-xl font-semibold text-red-400">
						Are you sure you want to log out?
					</h2>
					<p className="text-gray-400 mt-2">
						You will need to log in again to access your account.
					</p>
					<Button
						variant="destructive"
						className="mt-4 px-6 py-2"
						onClick={handleLogout}
					>
						Logout
					</Button>
				</div>
			)}
		</>
	);
}
