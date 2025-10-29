const moves = document.getElementById("moves");
const timeValue = document.getElementById("time");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const gameContainer = document.querySelector(".game");
const result = document.getElementById("result");
const controls = document.querySelector(".controls");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items array
const items = [
  { name: "apple", symbol: "🍎" },
  { name: "crocodile", symbol: "🐊" },
  { name: "macaw", symbol: "🦜" },
  { name: "pizza", symbol: "🍕" },
  { name: "rain", symbol: "🌧️" },
  { name: "monkey", symbol: "🐒" },
  { name: "rainbow", symbol: "🌈" },
  { name: "piranha", symbol: "🐟" },
  { name: "anaconda", symbol: "🐍" },
  { name: "sloth", symbol: "🦥" },
  { name: "toucan", symbol: "🦢" },
  { name: "cheery", symbol: "🍒"},
  { name: "flower", symbol: "🌸"},
  { name: "burger", symbol: "🍔"}
];

//Initial Time
let seconds = 0, minutes = 0;
//Initial moves and win count
let movesCount = 0,winCount = 0;

const timeGenerator = () => {
  seconds += 1;
  if(seconds>=60){
    minutes += 1
    seconds =0;
  }
  let secValue = seconds<10 ? `0${seconds}` : seconds
  let minValue = minutes<10 ? `0${minutes}` : minutes
  timeValue.innerHTML = `<span>Time:</span>${minValue}:${secValue}`;
  console.log(secValue, minValue)
}
// setInterval(timeGenerator,1000)

//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

const generateRandom = (size =4)=>{
  let tempArr = [...items];
  let cardValues = []
  size = (size*size)/2
  for(let i=0; i<size;i++){
    const randomIndex = Math.floor(Math.random()* tempArr.length)
    cardValues.push(tempArr[randomIndex]);
    tempArr.splice(randomIndex,1)
  }
  return cardValues;
}
//Pick random objects from the items array

const matrixGenerator = function(cardValues, size =4){
  gameContainer.innerHTML = ""
  cardValues = [...cardValues, ...cardValues]
  cardValues.sort (()=> Math.random()-0.5);
  for(let i=0; i<size*size; i++){
    gameContainer.innerHTML += `
      <div class="card_container" data-card-value = "${cardValues[i].name}">
        <div class= "card-front">?</div>
        <div class="card-back">${cardValues[i].symbol}</div>
      </div>
    `;
  }
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
  let firstCardValue, secondCardValue;
  cards = document.querySelectorAll('.card_container');
  cards.forEach(card => {
    card.addEventListener('click', ()=>{
      console.log("clicked", card)
      if(!card.classList.contains("matched")){
        card.classList.add('flipped')
        if(!firstCard){
          firstCard = card
          firstCardValue = card.getAttribute("data-card-value")
        } else{
          // second card
          movesCounter()
          secondCard = card;
          secondCardValue = card.getAttribute("data-card-value")

          if (firstCard !== secondCard && firstCardValue === secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            secondCard = false;
            winCount++;

            if (winCount === Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2><h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else if (firstCard !== secondCard) {
            // Not a match
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    })
  });
}

//Start game
start.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls amd buttons visibility
  controls.classList.add("hide");
  stop.classList.remove("hide");
  start.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//Stop game
stop.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stop.classList.add("hide");
    start.classList.remove("hide");
    clearInterval(interval);
  })
);

// Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};