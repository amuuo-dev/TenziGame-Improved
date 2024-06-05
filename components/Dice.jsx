const Dice = (prop) => {
  const styles = {
    backgroundColor: prop.isHeld ? "#59E391" : "white",
  };
  return (
    <div className="die-face" style={styles} onClick={prop.holdDice}>
      <h2 className="die-num">{prop.value}</h2>
    </div>
  );
};

export default Dice;
