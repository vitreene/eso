import { splitUnitValue } from "./helpers";

export const doDimensions = {
  update(dimensions) {
    // dimensions ; width,height,ratio
    // ratio = w/h
    // units: w, h
    if (!dimensions) return null;

    const regW = splitUnitValue(dimensions.width);
    const regH = splitUnitValue(dimensions.height);

    const hasNoWidth = regW === null;
    const hasNoHeight = regH === null;
    const hasNoRatio = dimensions.ratio === undefined;

    // traiter toutes les combinaisons
    if (hasNoWidth && hasNoHeight && hasNoRatio)
      return { width: "100%", height: "100%" };

    // width ou height, et ratio : la valeur manquante est calc( v * ou / ratio)
    if (hasNoWidth && hasNoHeight)
      return dimensions.ratio > 1
        ? {
            width: "100%",
            height: dimensions.ratio * 100 + "%",
          }
        : {
            width: (1 / dimensions.ratio) * 100 + "%",
            height: "100%",
          };
    let width = "";
    let height = "";

    const hasUnits = {
      w: regW && regW.unit,
      h: regH && regH.unit,
    };
    const suffix = {
      w: hasUnits.w || null, //|| "px",
      h: hasUnits.h || null, //|| "px"
    };

    width = hasNoWidth
      ? Math.round(parseInt(regH.value) * dimensions.ratio * 100) / 100 +
        suffix.h
      : Math.round(parseInt(regW.value) * 100) / 100 + suffix.w;

    height = hasNoHeight
      ? Math.round(parseInt(regW.value) * (1 / dimensions.ratio) * 100) / 100 +
        suffix.w
      : Math.round(parseInt(regH.value) * 100) / 100 + suffix.h;

    // si w ou h, sans ratio
    if (hasNoWidth && hasNoRatio) width = "100%";
    if (hasNoHeight && hasNoRatio) height = "100%";

    // console.log("dimensions", dimensions, { width, height });
    return { width, height };
  },
  prerender() {},
};
