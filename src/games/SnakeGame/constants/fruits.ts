export const FRUITS = [
  { emoji: "🍏", points: 5 }, // green apple
  { emoji: "🍎", points: 10 }, // red apple
  { emoji: "🍊", points: 15 }, // orange
  { emoji: "🫐", points: 20 }, // blueberries
  { emoji: "🍓", points: 25 }, // strawberry
  { emoji: "🥝", points: 30 }, // kiwi
];

export const getRandomFruit = () => {
  return FRUITS[Math.floor(Math.random() * FRUITS.length)];
}; 