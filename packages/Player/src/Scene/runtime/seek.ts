export function findByTime(time: number, times: number[]) {
	if (times.includes(time)) return time;

	return times.reduce(function (prev, curr) {
		if (curr > time) return prev;
		return Math.abs(curr - time) < Math.abs(prev - time) ? curr : prev;
	}, 0);
}

export const seek = () => {
	const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const goal1 = 5.8;
	const goal2 = 1099;
	let res = findByTime(goal1, arr);
	console.log('findByTime', res);
	res = findByTime(goal2, arr);
	console.log('findByTime', res);
};
