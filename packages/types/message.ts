export interface Message {
	[lang: string]: Lang;
}

interface Lang {
	[fr: string]: { [entry: string]: string };
}
