//options :  remplace, /=force-remplace, +=add, -=remove, :=toggle

export function setClassNames(
	getClasses: string,
	_classNames: string | string[],
	_defaultClassNames: string | string[] = []
): string[] {
	const classNames: string[] = Array.isArray(_classNames)
		? _classNames
		: [_classNames];
	const defaultClassNames: string[] = Array.isArray(_defaultClassNames)
		? _defaultClassNames
		: [_defaultClassNames];

	let newClassNames: string[] = classNames || [];

	for (const getClass of getClasses.split(' ').filter(Boolean)) {
		const newClass = typeof getClass === 'string' && {
			operator: getClass.substr(0, 2),
			name: getClass.slice(2),
		};

		if (newClass) {
			const isInList: boolean = classNames.indexOf(newClass.name) > -1;
			switch (newClass.operator) {
				// ajouter class
				case '+=':
					!isInList && (newClassNames = newClassNames.concat(newClass.name));
					break;
				// remove class
				case '-=':
					newClassNames = newClassNames.filter((cl) => cl !== newClass.name);
					break;
				//toggle class
				case ':=':
					newClassNames = isInList
						? newClassNames.filter((cl) => cl !== newClass.name)
						: newClassNames.concat(newClass.name);
					break;
				// ?? uniquement cette classe
				case '/=':
					newClassNames = [newClass.name];
					break;
				// sinon remplacer tout
				default:
					newClassNames = newClassNames.concat(getClass);
					break;
			}
		}
	}

	return defaultClassNames.concat(newClassNames);
}
