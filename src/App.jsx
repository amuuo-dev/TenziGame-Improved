import Dice from "../components/Dice";
import { nanoid } from "nanoid";
import Footer from "../components/Footer";
import Scoreboard from "../components/Scoreboard";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
const App = () => {
  const [dice, setDice] = useState(allNewDice);
  const [tenzies, setTenzies] = useState(false);

  // Create and initialize states to hold rolls stats
  const [rolls, setRolls] = useState(0);
  const [bestRolls, setBestRolls] = useState(
    JSON.parse(localStorage.getItem("bestRolls")) || 0,
  );

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      Record();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dice]);
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }
  // Set bestRolls to localStorage every item bestRolls changes
  useEffect(() => {
    localStorage.setItem("bestRolls", JSON.stringify(bestRolls));
  }, [bestRolls]);

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }
  function Record() {
    if (!bestRolls || rolls < bestRolls) {
      setBestRolls(rolls);
    }
  }
  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        }),
      );
      updateRolls();
    } else {
      resetGame();
    }
  }
  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      }),
    );
  }
  const dieElement = dice.map((die) => (
    <Dice
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));
  function resetGame() {
    setTenzies(false);
    setDice(allNewDice());
    setRolls(0);
  }
  // Increase rolls counter updating previous state
  function updateRolls() {
    return setRolls((oldRolls) => oldRolls + 1);
  }
  return (
    <div className="app-container shadow-shorter">
      {tenzies && <Confetti />}
      <main>
        <h1 className="title">Tenzies</h1>
        {!tenzies && (
          <p className="instructions">
            Roll until all dice are the same.
            <br /> Click each die to freeze it at its current value between
            rolls.
          </p>
        )}
        {tenzies && <p className="winner gradient-text"> YOU WON!</p>}

        <div className="stats-container">
          <p>Rolls: {rolls}</p>
        </div>

        <div className="container">{dieElement}</div>
        <button onClick={rollDice} className="roll-dice">
          {tenzies ? "New Game" : "Roll"}
        </button>
        <Scoreboard bestRolls={bestRolls} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
