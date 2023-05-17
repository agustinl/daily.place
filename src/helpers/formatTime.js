export const formatTime = (seconds = 0) => {
	return `${Math.floor(seconds / 60)}:${
		seconds % 60 > 9 ? seconds % 60 : "0" + (seconds % 60)
	}`;
};
