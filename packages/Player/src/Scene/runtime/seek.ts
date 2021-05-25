export function findByTime(time: number, times: number[]) {
	if (times.includes(time)) return time;

	return times.reduce(function (prev, curr) {
		if (curr > time) return prev;
		return Math.abs(curr - time) < Math.abs(prev - time) ? curr : prev;
	}, 0);
}
