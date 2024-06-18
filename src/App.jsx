import Dice from "../components/Dice";
import { nanoid } from "nanoid";
import Footer from "../components/Footer";
import Scoreboard from "../components/Scoreboard";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
const App = () => {
  const [dice, setDice] = useState(allNewDice);
  const [tenzies, setTenzies] = useState(false);
  const [lost, setLost] = useState(false);

  // Create and initialize states to hold rolls stats
  const [rolls, setRolls] = useState(0);
  const [bestRolls, setBestRolls] = useState(
    JSON.parse(localStorage.getItem("bestRolls")) || 0,
  );
  //time---------
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(true); //when timer to start
  const [bestTime, setBestTime] = useState(
    JSON.parse(localStorage.getItem("bestTime")) || 0,
  );

  useEffect(() => {
    let interval = null;
    if (start) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [start]);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      setStart(false);
      Record();
    } else if (time >= 59000) {
      setLost(true);
      setStart(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dice, time]);
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

  // Set bestTime to localStorage every item bestTime changes
  useEffect(() => {
    localStorage.setItem("bestTime", JSON.stringify(bestTime));
  }, [bestTime]);

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
    const timeFloored = Math.floor(time / 10);
    // Check if bestTime doesn't exist or newest time is lower than bestTime if so reassign the variable
    if (!bestTime || timeFloored < bestTime) {
      setBestTime(timeFloored);
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
    setTime(0); // Reset the timer
    setStart(true); // Start the timer when the new game starts
    setLost(false); // Reset the lost state
  }
  // Increase rolls counter updating previous state
  function updateRolls() {
    return setRolls((oldRolls) => oldRolls + 1);
  }
  return (
    <div className="app-container shadow-shorter">
      {tenzies && <Confetti className="confetti" />}
      <main>
        <h1 className="title">Tenzies</h1>
        {!tenzies && !lost && (
          <p className="instructions">
            Roll until all dice are the same.
            <br /> Click each die to freeze it at its current value between
            rolls.
          </p>
        )}
        {tenzies && <p className="winner gradient-text"> YOU WIN!</p>}
        {lost && <p className="loser"> YOU LOST!</p>}

        <div className="stats-container">
          <p>Rolls: {rolls}</p>
          <p>
            {/* This code displays the timer in the format ss:ms, 
            where ss is the seconds and ms is the hundredths of a second. */}
            Timer: {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
            {("0" + ((time / 10) % 1000)).slice(-2)}
          </p>
        </div>

        <div className="container">{dieElement}</div>
        <button onClick={rollDice} className="roll-dice">
          {tenzies ? "New Game" : "Roll"}
        </button>
        <Scoreboard bestRolls={bestRolls} bestTime={bestTime} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
