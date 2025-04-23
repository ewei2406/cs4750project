const Button = ({
	text,
	onClick,
	disabled,
	backgroundColor,
}: {
	text: string;
	onClick: () => void;
	disabled?: boolean;
	backgroundColor?: string;
}) => {
	const fontSize = 11; 

	return (
		<button
			className="button"
			onClick={onClick}
			disabled={disabled}
			style={{
				opacity: disabled ? 0.2 : undefined,
				fontSize, 
				fontWeight: 600,
				padding: "0.8em 1.0em",
				borderRadius: "4px",
				whiteSpace: "nowrap",
				color: "white",
				backgroundColor: backgroundColor ?? "#5e7a92",
				cursor: disabled ? "not-allowed" : "pointer",
				border: "none",
				fontFamily: "'Libre Franklin', serif", // Add font family here
			}}
		>
			{text}
		</button>
	);
};

export default Button;
