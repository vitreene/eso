import { emitter } from '../../data/emitter';
import { onSceneUpdateComponent } from '../../init/scene-update-handler';
import { ESO_Channel } from '../../../../types/ESO_enum';

type Subscribe = {
	channel: ESO_Channel | string;
	name: string;
	data?: any;
};
export function subscribe({ channel, name, data = null }: Subscribe) {
	return emitter.on([channel, name], publish({ channel, ...data }));
}
function publish(data: any) {
	return (other: any) => onSceneUpdateComponent({ ...data, ...other });
}
