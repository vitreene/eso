import { ESO_Lang, ESO_Namespace } from '../../../types/ESO_Namespace';

export const APP_ID = 'app';
export const CONTAINER_ESO = ESO_Namespace.CONTAINER_ESO;

export const MAIN = ESO_Namespace.MAIN;
export const TELCO = ESO_Namespace.TELCO;
export const PLAY = ESO_Namespace.PLAY;
export const PAUSE = ESO_Namespace.PAUSE;
export const STOP = ESO_Namespace.STOP;
export const REWIND = ESO_Namespace.REWIND;

export const STRAP = ESO_Namespace.STRAP;
export const TEMPO = ESO_Namespace.TEMPO;

export const SUPPORT = 'support';
export const ACTOR = 'actor';

export const DRAG = 'drag';
export const MOVE = 'move';
export const STATIC_TO_ABSOLUTE = 'staticToAbsolute';
export const TOGGLE = ESO_Namespace.TOGGLE;
export const TICK = 100;
export const DEFAULT_VOLUME = 0.1;

export const EV = 'eventList';
export const TC = TELCO;
export const DEFAULT_NS = MAIN;

export const DEFAULT_TRANSITION_IN = 'fadeIn';
export const DEFAULT_TRANSITION_OUT = 'fadeOut';

export const DEFAULT_DURATION = 500;

//Langues
export const FR = ESO_Lang.FR;
export const EN = ESO_Lang.EN;

export const DEFAULT_SIZE_SCENE = {
	'16/9': {
		w: 1600,
		h: 900,
		r: 16 / 9,
	},
	'4/3': {
		w: 1200,
		h: 900,
		r: 4 / 3,
	},
};

export const DEFAULT_STYLES = {
	x: 0,
	y: 0,
	dX: 0,
	dY: 0,
	s: 1,
	r: 0,
	skew: 1,
	skewX: 1,
	skewY: 1,
	scale: 1,
	scaleX: 1,
	scaleY: 1,
	scaleZ: 1,
	rotate: 0,
	rotateX: 0,
	rotateY: 0,
	rotateZ: 0,
	opacity: 1,
	color: '#000',
};
export const SHORT_STYLES = {
	s: 'scale',
	r: 'rotate',
};

export const pointerEventList = [
	'onClick',
	'onContextMenu',
	'onDoubleClick',
	'onDrag',
	'onDragEnd',
	'onDragEnter',
	'onDragExit',
	'onDragLeave',
	'onDragOver',
	'onDragStart',
	'onDrop',
	'onMouseDown',
	'onMouseEnter',
	'onMouseLeave',
	'onMouseMove',
	'onMouseOut',
	'onMouseOver',
	'onMouseUp',
	'onPointerDown',
	'onPointerMove',
	'onPointerUp',
	'onPointerCancel',
	'onGotPointerCapture',
	'onLostPointerCapture',
	'onPointerEnter',
	'onPointerLeave',
	'onPointerOver',
	'onPointerOut',
	'onTouchCancel',
	'onTouchEnd',
	'onTouchMove',
	'onTouchStart',
];

export const positionCssProps = ['top', 'left', 'right', 'bottom'];
export const whiteListCssProps = new Set([
	'backgroundPosition',
	'borderBottom',
	'borderBottomWidth',
	'borderLeft',
	'borderLeftWidth',
	'borderRight',
	'borderRightWidth',
	'borderTop',
	'borderTopWidth',
	'borderWidth',
	'borderRadius',
	'flexBasis',
	'fontSize',
	'height',
	'left',
	'letterSpacing',
	'listStylePosition',
	'margin',
	'marginBottom',
	'marginLeft',
	'marginRight',
	'marginTop',
	'padding',
	'minWidth',
	'maxWidth',
	'minHeight',
	'maxHeight',
	'objectPosition',
	'paddingBottom',
	'paddingLeft',
	'paddingRight',
	'paddingTop',
	'perspective',
	'strokeDasharray',
	'strokeDashoffset',
	'strokeWidth',
	'textIndent',
	'top',
	'width',
]);