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

function getElement(id) {
  return document.getElementById(id);
}

function showElement(element) {
  if (!element.classList.contains("invisible")) {
    return;
  }
  element.classList.remove("invisible");
}

function hideElement(element) {
  if (element.classList.contains("invisible")) {
    return;
  }
  element.classList.add("invisible");
}

function updateCardContent(cardEl, card) {
  var questionEl = cardEl.getElementsByClassName("question")[0];
  questionEl.textContent = card.question;
  var sourceEl = cardEl.getElementsByClassName("source")[0];
  sourceEl.textContent = card.source;
}

function isInvisible(element) {
  return element.classList.contains("invisible");
}

function isVisible(element) {
  return !isInvisible(element);
}

function getCardElement(filterFn) {
  var cards = document.getElementsByClassName("card front");
  cards = Array.prototype.slice.call(cards);
  cards = cards.filter(filterFn);
  if (cards.length === 0) {
    return null;
  }
  return cards[0];
}

function updateCurrCardUI() {
  var invisibleCardEl = getCardElement(isInvisible);
  var visibleCardEl = getCardElement(isVisible);
  if (visibleCardEl !== null) {
    hideElement(visibleCardEl);
  }
  if (state.currCard === -1) {
    return;
  }
  updateCardContent(invisibleCardEl, state.deck[state.currCard]);
  showElement(invisibleCardEl);
}

function currentDeckSize() {
  return state.deck.length - state.currCard - 1;
}

function updateDeckHeight(deckEl) {
  var shadowSize = 10 * currentDeckSize() / state.deck.length;
  var boxShadow = "0 " + shadowSize + "px #b0b0b0, 0 2px 6px 2px rgba(0, 0, 0, 0.15)";
  deckEl.style.boxShadow = boxShadow;
}

function updateCounter() {
  var content = currentDeckSize() + " / " + state.deck.length;
  getElement("deck-counter").textContent = content;
}

function updateDeckUI() {
  var deckEl = getElement("deck");
  if (state.currCard === state.deck.length - 1) {
    hideElement(deckEl);
  } else {
    showElement(deckEl);
    updateDeckHeight(deckEl);
  }
  updateCounter();
}

function showNextCard() {
  if (state.currCard === state.deck.length - 1) {
    return;
  }
  updateCurrCard(state.currCard + 1);
}

function showPrevCard() {
  if (state.currCard === -1) {
    return;
  }
  updateCurrCard(state.currCard - 1);
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

function openInstructions() {
  showElement(getElement("instructions-container"));
}

function closeInstructions() {
  hideElement(getElement("instructions-container"));
}

function updateDeck(deck) {
  state.deck = deck;
  onStateChanged();
}

function updateCurrCard(currCard) {
  state.currCard = currCard;
  onStateChanged();
}

function onStateChanged() {
  updateCurrCardUI();
  updateDeckUI();
}

// deck: array of cards in the deck
// currCard: index of the current card shown
var state = {
  deck: [],
  currCard: -1
};

function main() {
  // Initialize state.
  // cards is defined globally in cards.js
  updateDeck(createDeck(cards));

  // Initialize event listeners.
  getElement("deck").addEventListener("click", showNextCard);
  document.addEventListener("keydown", keydownHandler);
  getElement("open-instructions").addEventListener("click", openInstructions);
  getElement("close-instructions").addEventListener("click", closeInstructions);
}

main();
