export const counter = (function () {
  let i = 0;

  return {
    get() {
      return i++;
    },

    reset() {
      i = 0;
    },
  };
})();
