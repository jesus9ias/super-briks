import colors from './colors';

export default () => {
  const random = Math.floor(Math.random() * (colors.length + 1));
  return colors[random];
};
