import { emitter } from '../src/App/emitter';
// import { scene } from '../index';

type Subscribe = {
	channel: string;
	name: string;
	data?: any;
};

// export function subscribe({ channel, name, data = null }: Subscribe) {
// 	return emitter.on([channel, name], publish({ channel, ...data }));
// }

// function publish(data: any) {
// 	return (other: any) => scene.onSceneUpdateComponent({ ...data, ...other });
// }

export function initSubscribe(publish) {
	return function subscribe({ channel, name, data = null }: Subscribe) {
		return emitter.on([channel, name], publish({ channel, ...data }));
	};
}
