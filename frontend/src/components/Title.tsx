const Header = ({ text }: { text: string }) => (
	<div
	  style={{
		fontFamily: "'Jacquard 24', serif",
		fontSize: 14,
		fontWeight: 500,
		margin: "10px 0px",
		color: "#000",
	  }}
	>
	  {text}
	</div>
  );
  
  export default Header;