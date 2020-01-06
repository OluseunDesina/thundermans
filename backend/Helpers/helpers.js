module.exports = {
  lowerCase: string => {
    return string.toLowerCase();
  },

  firstUpper: string => {
    const username = string.toLowerCase();
    return `${username.charAt(0).toUpperCase()}${username.slice(1)}`;
  }
};
