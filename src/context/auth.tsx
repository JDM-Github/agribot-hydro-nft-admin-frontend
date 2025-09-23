import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import Cookies from "js-cookie";

interface AuthContextType {
	isLoggedIn: boolean;
	isLoading: boolean;
	login: (token: string | null, user: any) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = Cookies.get("token");
		if (token) {
			setIsLoggedIn(true);
		}
		setIsLoading(false);
	}, []);

	const login = (token: string | null, user: any) => {
		localStorage.setItem("user", JSON.stringify(user));
		if (token !== null) Cookies.set("token", token, { expires: 1 / 12 });
		setIsLoggedIn(true);
	};

	const logout = () => {
		Cookies.remove("token");
		setIsLoggedIn(false);
	};

	return (
		<AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
