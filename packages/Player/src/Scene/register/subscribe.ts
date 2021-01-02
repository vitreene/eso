import { emitter } from '../../data/emitter';
import { ESO_Channel } from '../../../../types/ESO_enum';

import { scene } from '../index';

type Subscribe = {
	channel: ESO_Channel | string;
	name: string;
	data?: any;
};

export function subscribe({ channel, name, data = null }: Subscribe) {
	return emitter.on([channel, name], publish({ channel, ...data }));
}
function publish(data: any) {
	return (other: any) => scene.onSceneUpdateComponent({ ...data, ...other });
}
