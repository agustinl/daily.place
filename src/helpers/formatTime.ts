export const formatTime = (seconds = 0) => {
	const isNegative = seconds < 0;
	const absSeconds = Math.abs(seconds);
	const minutes = Math.floor(absSeconds / 60);
	const secs = absSeconds % 60;
	const formattedTime = `${minutes}:${secs > 9 ? secs : "0" + secs}`;
	return isNegative ? `-${formattedTime}` : formattedTime;
};
