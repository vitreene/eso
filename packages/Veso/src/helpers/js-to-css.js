import { DEFAULT_STYLES } from '../helpers/constantes';

export const JSONtoCSS = (JSON) => {
  let cssString = '';
  for (const objectKey in JSON) {
    cssString +=
      objectKey.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`) +
      ': ' +
      JS[objectKey] +
      ';\n';
  }

  return cssString;
};

export function keyToLowercase(obj) {
  const objLc = {};
  for (const prop in obj) objLc[stringToLowercase(prop)] = obj[prop];
  return objLc;
}

const exceptions = new Set(Object.keys(DEFAULT_STYLES));
export function stringToLowercase(str) {
  return exceptions.has(str)
    ? str
    : str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}
