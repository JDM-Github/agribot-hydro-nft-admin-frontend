import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
	Menu,
	Home,
	Package,
	Leaf,
	AlertTriangle,
	Users,
	Settings,
	MessageSquareMore,
	Droplet,
	FileText,
} from "lucide-react";

const navItems = [
	{ name: "Dashboard", icon: <Home size={20} />, path: "/" },
	{ name: "Model", icon: <Package size={20} />, path: "/model" },
	{ name: "Plants", icon: <Leaf size={20} />, path: "/plants" },
	{ name: "Diseases", icon: <AlertTriangle size={20} />, path: "/diseases" },
	{ name: "Sprays", icon: <Droplet size={20} />, path: "/sprays" },
	{ name: "Logs", icon: <FileText size={20} />, path: "/logs" },
	{ name: "Accounts", icon: <Users size={20} />, path: "/accounts" },
	{
		name: "Feedback",
		icon: <MessageSquareMore size={20} />,
		path: "/feedback",
	},
	{ name: "Settings", icon: <Settings size={20} />, path: "/settings" },
];

export default function Navbar() {
	const [active, setActive] = useState("Dashboard");
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="z-50">
			<aside className="hidden lg:flex h-screen w-80 bg-gradient-to-b from-gray-900 to-green-900/20 text-white flex-col shadow-lg transition-all duration-300 ease-in-out">
				<div className="flex flex-col items-center mb-8 mt-3 animate-fade-in">
					<img
						src="/LOGO TEXT.webp"
						alt="Logo"
						className="w-full h-full"
					/>
				</div>

				<nav className="flex-1">
					<ul>
						{navItems.map((item) => (
							<li key={item.name} className="py-1">
								<NavLink
									to={item.path}
									className={({ isActive }) =>
										`flex items-center w-full py-3 p-5 border-green-400 transition-all ${
											isActive
												? "border-r-4 bg-gradient-to-r from-gray-900 to-green-900 text-white"
												: "hover:bg-gray-800"
										}`
									}
								>
									<span className="text-green-400 mr-4 transition-all duration-300 ease-in-out transform hover:scale-110">
										{item.icon}
									</span>
									<span className="text-gray-200 text-md">
										{item.name}
									</span>
								</NavLink>
							</li>
						))}
					</ul>
				</nav>
			</aside>

			<aside className="hidden md:flex lg:hidden h-screen w-20 bg-gray-900 text-white flex-col items-center shadow-lg transition-all duration-300 ease-in-out">
				<div className="flex flex-col items-center mb-8 mt-3 animate-fade-in">
					<img src="/public/LOGO.ico" alt="Logo" className="w-10" />
				</div>

				<nav className="flex-1 space-y-4">
					{navItems.map((item) => (
						<button
							key={item.name}
							onClick={() => setActive(item.name)}
							className={`relative flex justify-center p-3 w-full group rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-110 ${
								active === item.name
									? "bg-gradient-to-r from-gray-900 to-green-900"
									: "hover:bg-gray-800"
							}`}
						>
							<span className="text-green-400">{item.icon}</span>
							<span className="absolute left-16 bg-gray-800 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								{item.name}
							</span>
						</button>
					))}
				</nav>
			</aside>

			<div className="inline-block md:hidden lg:hidden min-w-screen bg-gray-900">
				<div className="container mx-auto py-1 flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<img
							src="/public/LOGO TEXT.webp"
							alt="Logo"
							className="h-10 w-auto"
						/>
					</div>

					<div>
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className="p-2 text-white transition-transform duration-300 ease-in-out transform hover:scale-110"
						>
							<Menu size={28} />
						</button>
					</div>
				</div>

				{menuOpen && (
					<div className="bg-gray-800 absolute top-16 left-0 w-full lg:hidden animate-slide-in z-20">
						<ul className="flex flex-col items-start">
							{navItems.map((item) => (
								<li key={item.name} className="w-full">
									<button
										onClick={() => {
											setActive(item.name);
											setMenuOpen(false);
										}}
										className={`flex items-center w-full px-5 py-3 transition-all duration-300 ease-in-out ${
											active === item.name
												? "bg-gradient-to-r from-gray-900 to-green-900 text-white"
												: "hover:bg-gray-700"
										}`}
									>
										<span className="text-green-400 mr-4">
											{item.icon}
										</span>
										<span className="text-gray-200 text-md">
											{item.name}
										</span>
									</button>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</header>
	);
}
