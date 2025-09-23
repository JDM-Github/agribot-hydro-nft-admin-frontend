import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./layout/header.tsx";
import Navbar from "./layout/nav.tsx";
import { AuthProvider } from "./context/auth.tsx";
import PrivateRoute from "./middleware/private.tsx";
import FeedbackPage from "./routes/feedback.tsx";
import SprayPage from "./routes/sprays.tsx";
import LogsPage from "./routes/logs.tsx";
import { ToastContainer } from "react-toastify";

const Dashboard = lazy(() => import("./routes/dashboard.tsx"));
const Plants = lazy(() => import("./routes/plants.tsx"));
const ModelPage = lazy(() => import("./routes/model.tsx"));
const DiseasePage = lazy(() => import("./routes/diseases.tsx"));
const AccountsPage = lazy(() => import("./routes/accounts.tsx"));
const AccountSettings = lazy(() => import("./routes/settings.tsx"));

export default function App() {
	return (
		<AuthProvider>
			<PrivateRoute>
				<div className="relative lg:flex md:flex sm:inline-block scrollbar-thin bg-transparent w-[100vw] min-h-[100vh]">
					<Navbar />
					<div className="flex-1 flex flex-col h-screen overflow-y-auto scrollbar-thin overflow-x-hidden">
						<Header />

						<Suspense
							fallback={<div className="p-4">Loading...</div>}
						>
							<Routes>
								<Route path="/" element={<Dashboard />} />
								<Route path="/plants" element={<Plants />} />
								<Route path="/model" element={<ModelPage />} />
								<Route
									path="/diseases"
									element={<DiseasePage />}
								/>
								<Route
									path="/sprays"
									element={<SprayPage />}
								/>
								<Route
									path="/logs"
									element={<LogsPage />}
								/>
								<Route
									path="/accounts"
									element={<AccountsPage />}
								/>
								<Route
									path="/feedback"
									element={<FeedbackPage />}
								/>
								<Route
									path="/settings"
									element={<AccountSettings />}
								/>
							</Routes>
						</Suspense>
					</div>
				</div>
				<Header />
				<ToastContainer />
			</PrivateRoute>
		</AuthProvider>
	);
}
