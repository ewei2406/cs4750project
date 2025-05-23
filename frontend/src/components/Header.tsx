const Header = ({ text }: { text: string }) => (
	<div
	  style={{
		fontFamily: "'Libre Franklin', serif",
		fontSize: 30,
		fontWeight: 500,
		margin: "10px 0px",
		color: "#000",
	  }}
	>
	  {text}
	</div>
  );
  
  export default Header;