// setupTypingHighlight.js
export const setupTypingHighlight = (elapsedTimeGetter) => {
  const textContent = document.getElementById("text-content");
  const textInput = document.getElementById("typing-input");
  const originalText = textContent.innerText;

  const wpmArea = document.querySelector(".wpm-area");
  const wpmArea2 = document.querySelector(".raw-WPM");
  //const timeArea = document.querySelector(".time-area");
  const accuracyArea = document.querySelector(".accuracy");

  const correctWord = document.querySelector(".CorCha");
  const incorrectWord = document.querySelector(".inCorCha");

  textInput.addEventListener("input", () => {
    const typedText = textInput.value;

    // const typedTextClean = typedText.replace(/\s+/g, " ");
    // const originalTextClean = originalText.replace(/\s+/g, " ");

    const typedTextClean = typedText;
    const originalTextClean = originalText;

    const elapsedTime = elapsedTimeGetter();

    let mistakes = 0;
    let correct = 0;

    for (let i = 0; i < typedTextClean.length; i++) {
      if (typedTextClean[i] === originalTextClean[i]) {
        correct++;
      } else {
        mistakes++;
      }
    }

    let accuracy = 100;
    if (typedTextClean.length > 0) {
      accuracy = Math.round((correct / typedTextClean.length) * 100);
    }

    const wpm = calculateWPM(typedTextClean.length, elapsedTime);

    wpmArea.textContent = `${wpm} WPM`;
    wpmArea2.textContent = `${wpm} WPM`;
    accuracyArea.textContent = `${accuracy}%`;

    correctWord.textContent = correct;
    incorrectWord.textContent = mistakes;

    highlightText(typedTextClean, originalTextClean, textContent);
  });
};

export function calculateWPM(typedLength, elapsedTime) {
  if (elapsedTime <= 0) return 0;
  const words = typedLength / 5;
  const minutes = elapsedTime / 60;
  return Math.round(words / minutes);
}

function highlightText(typed, original, element) {
  let highlightedHTML = "";
  for (let i = 0; i < original.length; i++) {
    if (i < typed.length) {
      if (typed[i] === original[i]) {
        highlightedHTML += `<span class="correct">${original[i]}</span>`;
      } else {
        highlightedHTML += `<span class="incorrect">${original[i]}</span>`;
      }
    } else {
      highlightedHTML += `<span>${original[i]}</span>`;
    }
  }
  element.innerHTML = highlightedHTML;
}
