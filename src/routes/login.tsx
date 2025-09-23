import { useState,  } from "react";
import { useNavigate } from "react-router-dom";
import RequestHandler from "../lib/utilities/RequestHandler";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../components/toast";
import { useAuth } from "../context/auth";

export default function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		if (!email || !password) {
			setError("Please enter both email and password.");
			setLoading(false);
			return;
		}
		try {
			const response = await RequestHandler.fetchData(
				"post",
				"admin/login",
				{
					email: email,
					password: password,
				}
			);
			if (!response.success) {
				setError(response.message || "Invalid email or password.");
				showToast(response.message || "Invalid credentials", "error");
				setLoading(false);
				return;
			}
			login(response.token, response.user);
			showToast(response.message || "Login successful!", "success");
			setTimeout(() => navigate("/"), 1500);
		} catch (error: any) {
			console.error("Login error:", error);
			setError("Something went wrong. Please try again.");
			showToast("Something went wrong. Please try again.", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="relative min-h-screen flex items-center justify-center text-white">
				<div className="w-full max-w-sm p-8 bg-gradient-to-b from-gray-900 to-transparent rounded-lg shadow-lg">
					<h1 className="text-4xl font-bold text-center mb-6">
						<img
							src="/LOGO TEXT.webp"
							alt="Logo"
							className="w-full h-full"
						/>
					</h1>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="flex flex-col">
							<label
								htmlFor="email"
								className="text-sm font-medium mb-1"
							>
								Email
							</label>
							<input
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="p-2 bg-gray-800 text-white rounded-lg border-0"
								placeholder="Enter your email"
								required
								disabled={loading}
							/>
						</div>
						<div className="flex flex-col">
							<label
								htmlFor="password"
								className="text-sm font-medium mb-1"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="p-2 bg-gray-800 text-white rounded-lg border-0"
								placeholder="Enter your password"
								required
								disabled={loading}
							/>
						</div>

						{error && (
							<p className="text-red-500 text-sm mt-2">{error}</p>
						)}

						<button
							type="submit"
							className="w-full p-2 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex justify-center items-center"
							disabled={loading}
						>
							{loading ? (
								<span className="animate-spin mr-2 border-2 border-t-transparent border-white rounded-full w-5 h-5"></span>
							) : (
								"Login"
							)}
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
