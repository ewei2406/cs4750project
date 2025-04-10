import "./Button.css"

const Button = ({ text, onClick, disabled, backgroundColor }: { 
text: string,
onClick: () => void,
disabled?: boolean,
backgroundColor?: string
}) => {
    return <button className="button" onClick={onClick} disabled={disabled} style={{
        fontSize: "14px",
        fontWeight: 600,
        padding: "0.5rem 1rem",
        borderRadius: "0.375rem",
        color: "white",
        backgroundColor: backgroundColor ?? "#555",
        cursor: "pointer",
        border: "none" 
    }}>
        {text}
    </button>
}

export default Button