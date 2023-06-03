import React, { useEffect, useState } from "react";
import { data } from "../data/wordData";
import { getHighlightedWord, getPreviousGuesses } from "../helper/functions";

function GameBox() {
  // List of secret words
  const [secretWords, setSecretWords] = useState(data);

  // State variables
  const [randomItem, setRandomItem] = useState("");
  const [robotGuess, setRobotGuess] = useState();
  const [mapWord, setMapWord] = useState([]);
  const [result, setResult] = useState();
  const [isStart, setIsStart] = useState(false);
  const [guess, setGuess] = useState("");
  const [previousGuess, setPreviousGuess] = useState([]);
  const [previousRobotGuess, setPreviousRobotGuess] = useState([]);
  const [showPreGuess, setShowPreGuess] = useState();
  const [showRobotPreGuess, setShowRobotPreGuess] = useState();
  const [msg, setMsg] = useState("");
  const [robotMsg, setRobotMsg] = useState("");
  const [error, setError] = useState("");
  const [saveLetter, setSaveLetter] = useState(["", "", "", "", ""]);
  const [level, setLevel] = useState("easy");

  // Function to start the game
  const startGame = () => {
    setSecretWords(data);
    const randomIndex = Math.floor(Math.random() * secretWords.length);
    const randomWord = secretWords[randomIndex];
    robotFindWord();
    setRandomItem(randomWord);
    setIsStart(true);
    setUnderScore(randomWord);
    setMsg("");
    setError("");
    setRobotMsg("");
  };

  // Function to handle form submission
  const submitHandler = (e) => {
    e.preventDefault();
    setResult(getHighlightedWord(randomItem, saveLetter, guess));
    if (guess.length === 0) {
      setError("Please enter your guess!");
      setMsg("");
    } else if (guess.toUpperCase() === randomItem) {
      setMsg("You win!");
      setError("");
      return;
    } else {
      setPreviousGuess([...previousGuess, guess.toUpperCase()]);
      setGuess("");
      setError("Wrong!");
      setMsg("");
    }
    robotSubmit(robotGuess);
  };

  // Function to set the initial underscored word
  const setUnderScore = (randomWord) => {
    let splittedWord = randomWord.split("");
    let mappedWord = splittedWord.map((letter) => " _ ");
    setMapWord(mappedWord);
    setResult(mappedWord.join(""));
  };

  // Robot guess
  const robotFindWord = () => {
    console.log(secretWords.length);
    if (saveLetter.join("") && level !== "easy") {
      for (let i = 0; i < saveLetter.length; i++) {
        if (saveLetter[i]) {
          const filterData = secretWords.filter(
            (word) => word[i] === saveLetter[i]
          );
          setSecretWords(filterData);
        }
        console.log(secretWords.length);
      }
    }
    const randomIndex = Math.floor(Math.random() * secretWords.length);
    let robotGuesses = secretWords[randomIndex];
    if (secretWords.length === 1) {
      robotGuesses = secretWords[0];
    }
    setRobotGuess(robotGuesses);
  };

  // Check robot guess
  const robotSubmit = (guess) => {
    robotFindWord();
    if (guess.toUpperCase() === randomItem) {
      setPreviousRobotGuess([...previousRobotGuess, guess.toUpperCase()]);
      setError("");
      setRobotMsg("robot Win!");
    } else if (saveLetter.join("") === randomItem && level == "hard") {
      guess = saveLetter.join("");
      setRobotGuess(saveLetter.join(""));
      setPreviousRobotGuess([...previousRobotGuess, guess.toUpperCase()]);
      setError("");
      setRobotMsg("robot Win!");
    } else {
      setPreviousRobotGuess([...previousRobotGuess, guess.toUpperCase()]);
      setRobotMsg("");
    }
  };

  useEffect(() => {
    // Update the previous guesses display
    setShowPreGuess(
      getPreviousGuesses(previousGuess, "user", randomItem, saveLetter)
    );
    setShowRobotPreGuess(
      getPreviousGuesses(previousRobotGuess, "robot", randomItem, saveLetter)
    );
    console.log(
      randomItem,
      previousGuess,
      previousRobotGuess,
      saveLetter,
      level
    );
  }, [randomItem, previousGuess, previousRobotGuess, robotGuess]);

  return (
    <div className="mb-10 container mx-auto flex justify-center max-w-xl my-8">
      <div className="bg-white rounded-lg shadow p-6 sm:w-full max-w-xl z-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-8 text-center">
          Guess the word! :)
        </h2>

        {!isStart ? (
          <div className="text-center">
            <div className="mb-4 justify-center items-center gap-3 flex">
              <label
                htmlFor="level"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Level
              </label>
              <select
                id="level"
                name="level"
                autoComplete="level-name"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <button
              className="px-6 py-3 cursor-pointer bg-indigo-500 rounded shadow text-white"
              onClick={startGame}
            >
              Start Game!
            </button>
          </div>
        ) : (
          <div>
            <p className="mx-2 md:mx-8 mb-6 text-center text-lg">
              {result ? result : setUnderScore(randomItem)}
            </p>
            <form
              action=""
              className="mx-2 md:mx-8 space-y-6"
              onSubmit={submitHandler}
            >
              <div>
                <label
                  htmlFor="guess"
                  className="text-gray-600 text-sm leading-5"
                >
                  Enter Word
                </label>
                <input
                  type="text"
                  name="guess"
                  id="guess"
                  autoComplete="guess"
                  autoFocus
                  value={guess}
                  maxLength="5"
                  minLength="5"
                  required
                  onChange={(e) => setGuess(e.target.value)}
                  className="border-0 shadow-sm w-full block ring-1 ring-inset ring-gray-300 rounded-md mt-2 py-1.5 px-3 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-indigo-600"
                />
              </div>
              <div>
                <p className="text-red-500 my-3">
                  {error && !robotMsg && !msg && error}
                </p>
                <p className="text-green-500 my-3">{msg && msg}</p>
                <p className="text-green-500 my-3">{robotMsg && robotMsg}</p>
                <p className="text-green-500 my-3 font-bold text-center">
                  {robotMsg && <span>Answer : {randomItem}</span>}
                </p>
              </div>

              {msg || robotMsg ? (
                <div className="flex items-center justify-between gap-2 pt-3">
                  {" "}
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white w-full rounded-md px-4 py-2 mb-8"
                    onClick={() => window.location.reload()}
                  >
                    Another round!
                  </button>{" "}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 pt-3">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white w-full rounded-md px-4 py-2 mb-8"
                  >
                    Guess
                  </button>
                  <button
                    type="submit"
                    className="bg-gray-200 text-gray-800 w-full rounded-md px-4 py-2 mb-8"
                    onClick={() => window.location.reload()}
                  >
                    Finish Game
                  </button>
                </div>
              )}

              <div className="flex justify-between  flex-col lg:flex-row">
                {previousGuess.length > 0 && (
                  <div>
                    Your Guess:
                    <div className="my-3 flex flex-col-reverse gap-2">
                      {showPreGuess}
                    </div>
                  </div>
                )}
                {previousRobotGuess.length > 0 && (
                  <div>
                    Robot Guess:
                    <div className="my-3 flex flex-col-reverse gap-2">
                      {showRobotPreGuess}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameBox;
