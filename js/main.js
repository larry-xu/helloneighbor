function shuffle(array) {
  var i, j, t;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
}

function createDeck(cards) {
  var shuffledCards = cards.slice()
  shuffle(shuffledCards)
  return shuffledCards;
}

function showCard(card) {
  var cardEl = document.getElementById("current-card");
  showElement(cardEl);
  var questionEl = document.getElementById("question");
  questionEl.textContent = card.question;
  var sourceEl = document.getElementById("source");
  sourceEl.textContent = card.source;
}

function showElement(element) {
  if (element.classList.contains("invisible")) {
    element.classList.remove("invisible");
  }
}

function hideElement(element) {
  element.classList.add("invisible");
}

function currentDeckSize() {
  return deck.length - currCardIndex - 1;
}

function setDeckHeight(deckEl) {
  var shadowSize = 10 * currentDeckSize() / deck.length;
  deckEl.style.boxShadow = "0 " + shadowSize + "px #b0b0b0, 0 2px 6px 2px rgba(0, 0, 0, 0.15)"
}

function updateDeckStyle() {
  var deckEl = getDeckElement()
  if (currCardIndex === deck.length - 1) {
    hideElement(deckEl);
  } else {
    showElement(deckEl);
    setDeckHeight(deckEl);
  }
}

function updateCounter() {
  var counterEl = document.getElementById("deck-counter");
  counterEl.textContent = currentDeckSize() + " / " + deck.length;
}

function updateUI() {
  if (currCardIndex === -1) {
    var cardEl = document.getElementById("current-card");
    hideElement(cardEl);
  } else {
    showCard(deck[currCardIndex]);
  }
  updateDeckStyle();
  updateCounter();
}

function showNextCard() {
  if (currCardIndex === deck.length - 1) {
    return;
  }
  currCardIndex++;
  updateUI();
}

function showPrevCard() {
  if (currCardIndex === -1) {
    return;
  }
  currCardIndex--;
  updateUI();
}

function keydownHandler(event) {
  if (event.keyCode === 37) {
    // left arrow
    showPrevCard();
  } else if (event.keyCode === 39) {
    // right arrow
    showNextCard();
  }
}

function getDeckElement() {
  return document.getElementById("deck");
}

var deck, currCardIndex;

function main() {
  deck = createDeck(cards);
  currCardIndex = -1;

  var deckEl = getDeckElement();
  deckEl.addEventListener("click", showNextCard);

  document.addEventListener("keydown", keydownHandler);

  updateCounter();
}

main();
