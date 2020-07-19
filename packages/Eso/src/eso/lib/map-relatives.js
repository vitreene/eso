/* 
TODO 
- valeurs relatives pour les styles
expression +=, -=, *=, /= avant la valeur
unités acceptées: px, u.
comparer avec la valeur précedente : quelle unité ?
  - si unités différentes = convertir vers px avec getComputedStyle
  - si meme unités : opération normale.
  
restreindre les unités acceptées pour eviter trop de calculs à cet endroit
les valeurs précédentes sont elles des nombres ou bien des strings ?  
*/

const rgxRelatives = /^([+\-*/])=(\d*\.?\d*)(\D*)/;
// ^([\+\-\*\/])= capture l'opérateur
// (\d*\.?\d*) capture le nombre decimal
//  (\D*) capture les unités

const rgxUnits = /[-+]?\d*(\D+)$/;
// [-+]?\d* un nombre, positif ou negatif
//  (\D+)$ capture un mot en fin de chaine

const operate = {
  "+"(a, b = 0) {
    return a + b;
  },
  "-"(a, b = 0) {
    return b - a;
  },
  "*"(a, b = 1) {
    return a * b;
  },
  "/"(a, b = 1) {
    return b / a;
  }
};

// TODO implementer la fonction
// identifier la valeur via un convertisseur
// au lancement un objet DOm est créé avec une valeur en unité, puis lue en px, et mise en cache
function convertVal(val) {
  return parseInt(val);
}

export function mapRelatives(prec) {
  return function mapProps(props) {
    const newProps = {};
    for (const p in props) {
      const value =
        typeof props[p] === "string" && props[p].match(rgxRelatives);
      if (value) {
        const propMatchU = props[p].match(rgxUnits);
        const precMatchU =
          prec && typeof prec[p] === "string" && prec[p].match(rgxUnits);
        const propU = propMatchU && propMatchU[1];
        const precU = precMatchU && precMatchU[1];
        const operateur = value[1];

        // valeurs en nombre
        const valA = parseFloat(value[2]);
        const valB = prec && prec[p] && parseFloat(prec[p]);
        // comparer unités
        // - si aucun, operation
        if (!propU && !precU) newProps[p] = operate[operateur](valA, valB);
        // - si identiques, operation, puis appliquer unité
        else if (propU && propU === precU) {
          newProps[p] = operate[operateur](valA, valB) + propU;
        }
        // - sinon, convertir en px, operation, puis appliquer px
        else if ((propU || precU) && propU !== precU) {
          console.warn("not effective : ", propU, " -> ", precU);
          const convertedValA = convertVal(props[p].slice(2));
          const convertedValB = convertVal(prec[p]);
          newProps[p] = operate[operateur](convertedValA, convertedValB) + "px";
        }
      }
    }
    //   console.log("props, newProps", props, newProps);
    return { ...prec, ...props, ...newProps };
  };
}
