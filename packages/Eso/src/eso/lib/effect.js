export const effect = {
  fromLeft: {
    from: {
      opacity: 0,
      x: -250
    },
    to: {
      opacity: 1,
      x: 0
    },
    duration: 600
  },
  fromRight: {
    from: {
      opacity: 0,
      x: 250
    },
    to: {
      opacity: 1,
      x: 0
    },
    duration: 600
  },
  fadeIn: {
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    },
    duration: 600
  },
  fadeInScale: {
    from: {
      opacity: 0,
      scale: 0.2
    },
    to: {
      opacity: 1,
      scale: 1
    },
    duration: 600
  },
  fadeOut: {
    from: {
      opacity: 1
    },
    to: {
      opacity: 0.15
    },
    duration: 300
  },
  fadeOutScale: {
    from: {
      opacity: 1,
      scale: 1
    },
    to: {
      opacity: 0.15,
      scale: 0.25
    },
    duration: 600
  },
  fadeIn2: {
    opacity: [{ 0: 0 }, { 100: 1 }, { duration: 1 }],
    scale: [{ 0: 0.9 }, { 100: 1 }, { duration: 1 }]
  },
  default: {
    duration: 600
  }
};
