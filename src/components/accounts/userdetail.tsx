import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { Avatar, AvatarFallback } from "../ui/avatar";

const UserDetailSheet = ({
	user,
}: {
	user: any;
}) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				
			</SheetTrigger>

			<SheetContent
				side="right"
				className="w-[420px] bg-gray-900 text-white border-l border-gray-800 shadow-xl animate-slide-in"
			>
				<div className="p-6 space-y-6">
					<div className="flex items-center justify-center gap-3">
						<Avatar className="w-12 h-12 bg-gray-700 text-white">
							<AvatarFallback className="bg-gray-700">
								{user?.name
									.split(" ")
									.map((n: string) => n[0])
									.join("")
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<h3 className="text-2xl font-semibold text-white tracking-wide">
							{user?.name}
						</h3>
					</div>

					<div className="space-y-4">
						<UserDetailRow
							label="Role"
							value={user?.role}
							color="text-blue-400"
						/>
						<UserDetailRow
							label="Model"
							value={user?.model}
							color="text-green-400"
						/>
						<UserDetailRow
							label="Configuration"
							value={user?.config}
							color="text-yellow-400"
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

const UserDetailRow = ({
	label,
	value,
	color,
}: {
	label: string;
	value: string;
	color: string;
}) => {
	return (
		<div className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all">
			<span className="text-sm font-medium text-gray-300">{label}:</span>
			<span className={`font-semibold ${color}`}>{value}</span>
		</div>
	);
};

export default UserDetailSheet;
