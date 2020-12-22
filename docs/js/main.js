var CARDS_SOURCE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5OnXLZyogXjLSenOoBtOzqCamqwWdeNNCBTOmN9gqf5rC8I35kx-c8JfZxmw4iB4P4suRJW9fpn7x/pub?gid=167052444&single=true&output=csv";
var PROXIED_CARDS_SOURCE = "https://www.larryxu.com/helloneighbor.json";

function getCardsFromSource() {
  return new Promise(function(resolve, reject) {
    Papa.parse(CARDS_SOURCE, {
      download: true,
      header: true,
      skipEmptyLines: "greedy",
      complete: function(results) {
        var cards = results.data.filter(function(d) {
          return d["Online"] === "Active";
        }).map(function(d) {
          return {
            question: d["Question"],
            source: d["Submitted By"]
          };
        });
        resolve(cards);
      },
      error: reject
    });
  });
}

function getCardsFromProxy() {
  return fetch(PROXIED_CARDS_SOURCE)
    .then(function(resp) { return resp.json(); });
}

function getCardsFromFile(cb) {
  return fetch("js/cards.json")
    .then(function(resp) { return resp.json(); });
}

function getCards(cb) {
  getCardsFromSource()
    .then(cb)
    .catch(function(error) {
      getCardsFromProxy()
        .then(cb)
        .catch(function(error) {
          getCardsFromFile(cb)
            .then(cb);
        })
    });
}

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

function updateCounter() {
  var content = (state.currCard + 1) + " / " + state.deck.length;
  getElement("deck-counter").textContent = content;
}

function updateDeckUI() {
  var buttonEl = getElement("add-button");
  if (state.currCard === state.deck.length - 1) {
    hideElement(buttonEl);
  } else {
    showElement(buttonEl);
  }
  updateCounter();
  if (state.currCard === 0) {
    var deckEl = getElement("deck");
    hideElement(deckEl);
    var counterEl = getElement("deck-counter");
    showElement(counterEl);
  }
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
  showInstructionsTab();
  showElement(getElement("instructions-modal-container"));
}

function closeInstructions() {
  hideElement(getElement("instructions-modal-container"));
}

function openRules() {
  showTipsTab();
  showElement(getElement("instructions-modal-container"));
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
  getCards(function(cards) {
    updateDeck(createDeck(cards));
  });

  // Initialize event listeners.
  getElement("add-button").addEventListener("click", showNextCard);
  getElement("open-instructions").addEventListener("click", openInstructions);
  getElement("open-rules").addEventListener("click", openRules);
  getElement("close-instructions").addEventListener("click", closeInstructions);
  getElement("instructions-modal-container").addEventListener("click", instructionsModalClick);
  getElement("instructions-tab").addEventListener("click", showInstructionsTab);
  getElement("tips-tab").addEventListener("click", showTipsTab);
}

main();
