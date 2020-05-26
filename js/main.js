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
  var cards = getElement("current-card").getElementsByClassName("card front");
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
  if (state.revealedCard === -1) {
    return;
  }
  updateCardContent(invisibleCardEl, state.revealedCards[state.revealedCard]);
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
  var deckSize = currentDeckSize();
  if (deckSize === 0) {
    getElement("deck-counter").textContent = "";
    return;
  }
  var content = deckSize + " / " + state.deck.length;
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

function createCardElement(card) {
  var cardEl = document.createElement("div");
  cardEl.className = "card front";
  var questionEl = document.createElement("div");
  questionEl.className = "question";
  questionEl.textContent = card.question;
  cardEl.appendChild(questionEl);
  var sourceContainerEl = document.createElement("div");
  sourceContainerEl.className = "source-container";
  var fromEl = document.createElement("span");
  fromEl.className = "italic";
  fromEl.textContent = "from";
  sourceContainerEl.appendChild(fromEl);
  var sourceEl = document.createElement("div");
  sourceEl.className = "source";
  sourceEl.textContent = card.source;
  sourceContainerEl.appendChild(sourceEl);
  cardEl.appendChild(sourceContainerEl);
  return cardEl;
}

function createCardContainerElement(revealedCard) {
  var cardContainerEl = document.createElement("div");
  cardContainerEl.className = "card-container small";
  var card = state.revealedCards[revealedCard];
  var cardEl = createCardElement(card);
  cardContainerEl.appendChild(cardEl);
  return cardContainerEl;
}

function updateRevealedCardsUI() {
  var revealedCard = state.revealedCards.length - 1;
  var cardContainerEl = createCardContainerElement(revealedCard);
  getElement("revealed-cards").appendChild(cardContainerEl);
  cardContainerEl.addEventListener("click", function() {
    updateRevealedCard(revealedCard);
  });
}

function updateRevealedCardFocusUI() {
  var containerEl = getElement("revealed-cards");
  var revealedCardsEls = Array.from(
    containerEl.getElementsByClassName("card-container")
  );
  revealedCardsEls.forEach(function(el, idx) {
    if (idx === state.revealedCard) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

function showNextCard() {
  if (state.currCard === state.deck.length - 1) {
    return;
  }
  updateCurrCard(state.currCard + 1);
  updateRevealedCards(
    state.revealedCards.concat(state.deck[state.currCard])
  );
  updateRevealedCard(state.revealedCards.length - 1);
}

function openInstructions() {
  showElement(getElement("instructions-modal-container"));
}

function closeInstructions() {
  hideElement(getElement("instructions-modal-container"));
}

function instructionsModalClick(e) {
  if (getElement("instructions-modal").contains(e.target)) {
    return;
  }
  closeInstructions();
}

function unfadeElement(element) {
  if (!element.classList.contains("faded")) {
    return;
  }
  element.classList.remove("faded");
}

function fadeElement(element) {
  if (element.classList.contains("faded")) {
    return;
  }
  element.classList.add("faded");
}

function showInstructionsTab() {
  fadeElement(getElement("tips-tab"));
  unfadeElement(getElement("instructions-tab"));
  hideElement(getElement("tips-body"));
  showElement(getElement("instructions-body"));
}

function showTipsTab() {
  fadeElement(getElement("instructions-tab"));
  unfadeElement(getElement("tips-tab"));
  hideElement(getElement("instructions-body"));
  showElement(getElement("tips-body"));
}

function updateDeck(deck) {
  state.deck = deck;
  updateDeckUI();
}

function updateCurrCard(currCard) {
  state.currCard = currCard;
  updateDeckUI();
}

function updateRevealedCards(revealedCards) {
  if (revealedCards === state.revealedCards) {
    return;
  }
  state.revealedCards = revealedCards;
  updateRevealedCardsUI();
}

function updateRevealedCard(revealedCard) {
  state.revealedCard = revealedCard;
  updateCurrCardUI();
  updateRevealedCardFocusUI();
}

// deck: array of cards in the deck
// currCard: index of the current card shown
// revealedCards: array of revealed cards
// revealedCard: index of the revealed card shown
var state = {
  deck: [],
  currCard: -1,
  revealedCards: [],
  revealedCard: -1
};

function main() {
  // Initialize state.
  // cards is defined globally in cards.js
  updateDeck(createDeck(CARDS));

  // Initialize event listeners.
  getElement("deck").addEventListener("click", showNextCard);
  getElement("open-instructions").addEventListener("click", openInstructions);
  getElement("close-instructions").addEventListener("click", closeInstructions);
  getElement("instructions-modal-container").addEventListener("click", instructionsModalClick);
  getElement("instructions-tab").addEventListener("click", showInstructionsTab);
  getElement("tips-tab").addEventListener("click", showTipsTab);
}

main();
