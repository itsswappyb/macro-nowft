export const shortenAddress = (str, n = 5) => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n + 1)}`;
  }
  return "";
};