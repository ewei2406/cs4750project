const Paragraph = ({ text }: { text: string }) => (
	<div
	  style={{
		fontFamily: "'Libre Franklin', serif",
		fontSize: 14,
		fontWeight: 500,
		margin: "10px 0px",
		color: "#000",
	  }}
	>
	  {text}
	</div>
  );
  
  export default Paragraph;