const Button = ({
	text,
	onClick,
	disabled,
	backgroundColor,
	size,
}: {
	text: string;
	onClick: () => void;
	disabled?: boolean;
	backgroundColor?: string;
	size?: "sm" | "md" | "lg";
}) => {
	const buttonSize = {
		sm: 12,
		md: 15,
		lg: 20,
	};
	const fontSize = buttonSize[size ?? "md"];

	return (
		<button
			className="button"
			onClick={onClick}
			disabled={disabled}
			style={{
				opacity: disabled ? 0.2 : undefined,
				fontSize,
				fontWeight: 600,
				padding: "0.2em 0.4em",
				borderRadius: fontSize / 2,
				whiteSpace: "nowrap",
				color: "white",
				backgroundColor: backgroundColor ?? "#555",
				cursor: disabled ? "not-allowed" : "pointer",
				border: "none",
			}}
		>
			{text}
		</button>
	);
};

export default Button;
