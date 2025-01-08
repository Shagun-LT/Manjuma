import LottieView from 'lottie-react-native';

const lottieCache = new Map();

export const loadAnimation = async (source) => {
  if (!lottieCache.has(source)) {
    const animation = JSON.parse(JSON.stringify(source));
    lottieCache.set(source, animation);
  }
  return lottieCache.get(source);
};

export const clearCache = () => {
  lottieCache.clear();
}; 