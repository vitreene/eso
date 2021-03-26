import { splitUnitValue } from '../../shared/utils';

function scaleDimensions(dimensions, original) {
	// fusionne les dimensions : met à l'echelle
	/* 
	X si seulement width : factor = width / imgDimensions.width
	X si seulement height : factor = height / imgDimensions.height
	si seulement ratio : déformation = imgDimensions.width/imgDimensions.height - ratio

	si width et height : -> utiliser ces valeurs
	si width et height et ratio : ignorer ratio
	si width et ratio : -> calculer height -> utiliser ces valeurs
	si height et ratio : -> calculer width -> utiliser ces valeurs


	
	*/
}

function only(property, obj) {
	const keys = Object.keys(obj);
	const one = keys.length === 1;
	const hasProperty = keys[0] === property;
	return one && hasProperty;
}

// TODO transformer les % en px
// si % lire les dimensions du node
export function doDimensions(_dimensions, original) {
	// dimensions ; width,height,ratio
	// ratio = w/h
	// units: w, h
	if (!_dimensions && !original) return null;
	let dimensions = !_dimensions && original ? original : _dimensions;

	if (only('width', _dimensions) && original?.width) {
		const scale = _dimensions.width / original.width;
		dimensions = {
			width: _dimensions.width,
			height: original.height * scale,
		};
	}
	if (only('height', _dimensions) && original?.height) {
		const scale = _dimensions.height / original.height;
		console.log('HEIGHT', _dimensions, original);
		dimensions = {
			width: original.width * scale,
			height: _dimensions.height,
		};
		console.log('SCALE', dimensions, scale);
	}

	const regW = splitUnitValue(dimensions.width);
	const regH = splitUnitValue(dimensions.height);

	const hasNoWidth = regW === null;
	const hasNoHeight = regH === null;
	const hasNoRatio = dimensions.ratio === undefined;

	// traiter toutes les combinaisons
	if (hasNoWidth && hasNoHeight && hasNoRatio)
		return { width: '100%', height: '100%' };

	// width ou height, et ratio : la valeur manquante est calc( v * ou / ratio)
	if (hasNoWidth && hasNoHeight)
		return dimensions.ratio > 1
			? {
					width: '100%',
					height: dimensions.ratio * 100 + '%',
			  }
			: {
					width: (1 / dimensions.ratio) * 100 + '%',
					height: '100%',
			  };
	let width = '';
	let height = '';

	const hasUnits = {
		w: regW && regW.unit,
		h: regH && regH.unit,
	};
	const suffix = {
		w: hasUnits.w || null, //|| "px",
		h: hasUnits.h || null, //|| "px"
	};

	width = hasNoWidth
		? Math.round(parseInt(regH.value) * dimensions.ratio * 100) / 100 + suffix.h
		: Math.round(parseInt(regW.value) * 100) / 100 + suffix.w;

	height = hasNoHeight
		? Math.round(parseInt(regW.value) * (1 / dimensions.ratio) * 100) / 100 +
		  suffix.w
		: Math.round(parseInt(regH.value) * 100) / 100 + suffix.h;

	// si w ou h, sans ratio
	if (hasNoWidth && hasNoRatio) width = '100%';
	if (hasNoHeight && hasNoRatio) height = '100%';

	console.log('pre-DIMENSIONS', dimensions, { width, height });

	return { classStyle: { width, height } };
}
