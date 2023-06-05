// Function to get the previous guesses with highlighting
export const getPreviousGuesses = (previousGuess, user, randomItem, saveLetter) => {
  return previousGuess.map((word, index) => (
    <p key={index}>
      {word.split("").map((letter, index) => {
        const guessedLetter = letter;
        const isCorrectGuess =
          guessedLetter.toUpperCase() === randomItem[index];
        for (let i = 0; i <= index; i++) {
          isCorrectGuess ? (saveLetter[index] = letter) : null;
        }
        const myClassName = isCorrectGuess
          ? user === "user"
            ? "text-green-600 bg-green-200 p-2 rounded-sm m-1 inline-block"
            : "text-gray-500 bg-green-200 p-2 rounded-sm m-1 inline-block"
          : "text-gray-500 bg-gray-200 p-2 rounded-sm m-1 inline-block";
        return (
          <span key={index} className={myClassName}>
            {letter}
          </span>
        );
      })}
    </p>
  ));
};

// Function to get the highlighted word for display
export const getHighlightedWord = (randomWord,saveLetter,guess) => {
  return randomWord.split("").map((letter, index) => {
    const guessedLetter = guess[index];
    const isCorrectGuess =
      guessedLetter && guessedLetter.toUpperCase() === letter;
    for (let i = 0; i <= index; i++) {
      isCorrectGuess ? (saveLetter[index] = letter) : null;
    }
    const myClassName = isCorrectGuess ? "text-green-500" : "text-red-500";
    const myLetter = isCorrectGuess ? letter : " _ ";
    return (
      <span key={index} className={myClassName}>
        {myLetter}
      </span>
    );
  });
};
