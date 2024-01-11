import { PomodoroSetting } from "@/types/pomodoro";

export const dailyPlaceExist = (name: string) => {
	try {
		const storage = localStorage.getItem("dailyPlaceNames");

		// Local storage "dailyPlaceNames" exist
		if (storage) {
			const found = storage?.split(",")?.find(element => element === name);

			// @name not exist
			if (!found) {
				return false;
			}

			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.error(error);
	}
};

export const forkDailyPlaceConfiguration = (
	from: string,
	to: string,
	defaultValue: [] | PomodoroSetting,
	type: string
) => {
	try {
		const fromPlace = type === "todo" ? `dailyTodo_${from}` : `dailyPomodoro_${from}`;
		const toPlace = type === "todo" ? `dailyTodo_${to}` : `dailyPomodoro_${to}`;

		const value = localStorage.getItem(fromPlace) ?? JSON.stringify(defaultValue);

		if (value) {
			localStorage.setItem(toPlace, value);
		}
	} catch (error) {
		console.error(error);
	}
};
