export const formatTime = seconds => {
	return `${Math.floor(seconds / 60)}:${
		seconds % 60 > 9 ? seconds % 60 : "0" + (seconds % 60)
	}`;
};
