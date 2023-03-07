import { useState, useEffect } from "react";
import {
	Stack,
	ActionIcon,
	Flex,
	Text,
	Badge,
	SegmentedControl,
} from "@mantine/core";
import { showNotification, cleanNotifications } from "@mantine/notifications";
import {
	IconPlayerPlay,
	IconPlayerPause,
	IconReload,
	IconSettings,
	IconAlarm,
} from "@tabler/icons";
import { useLocalStorage, useHotkeys } from "@mantine/hooks";

import Title from "./common/Title";
import PomodoroSettings from "./modals/PomodoroSettings";

import { formatTime } from "@/helpers/formatTime";

import pomodoroSound from "../../public/sounds/pomodoro-timer.mp3";

const POMODORO_MODES = [
	{ label: "Pomodoro", value: "pomodoro" },
	{ label: "Short break", value: "short" },
	{ label: "Long break", value: "long" },
];

const Pomodoro = ({ name }) => {
	const [storage, setStorage] = useLocalStorage({
		key: `dailyPomodoro_${name}`,
		defaultValue: {
			pomodoro: 25,
			shortBreak: 5,
			longBreak: 10,
			pomodoroToday: 0,
		},
	});

    useHotkeys([
        ['mod+P', () => setIsActive(!isActive)],
        ['mod+1', () => setMode("pomodoro")],
        ['mod+2', () => setMode("short")],
        ['mod+3', () => setMode("long")]
    ]);

	const [mode, setMode] = useState(POMODORO_MODES[0].value);
	const [secondsLeft, setSecondsLeft] = useState(storage?.pomodoro * 60);
	const [isActive, setIsActive] = useState(false);
	const [opened, setOpened] = useState(false);
	const [sound, setSound] = useState(null);

	useEffect(() => {
		var sound = new Audio(pomodoroSound);

		setSound(sound);
	}, []);

	useEffect(() => {
		restartPomodoro();
	}, [storage, mode]);

	useEffect(() => {
		if (isActive) {
			cleanNotifications();

			const interval = setInterval(() => {
				setSecondsLeft(secondsLeft => secondsLeft - 1);
			}, 1000);

			if (secondsLeft === 0) {
				sound.play();
				clearInterval(interval);
				restartPomodoro();

				let notif_text = POMODORO_MODES.find(
					elem => elem?.value === mode
				);

				showNotification({
					title: `${notif_text?.label} time is over`,
					icon: <IconAlarm size={20} />,
				});
			}

			if (secondsLeft === 0 && mode == "pomodoro") {
				/*setPomodorosToday(prevState => prevState + 1);*/
				setStorage({
					...storage,
					pomodoroToday: storage?.pomodoroToday + 1,
				});
			}

			return () => clearInterval(interval);
		}
	}, [isActive, secondsLeft]);

	const restartPomodoro = () => {
		setIsActive(false);

		switch (mode) {
			case "short":
				setSecondsLeft(storage?.shortBreak * 60);
				break;
			case "long":
				setSecondsLeft(storage?.longBreak * 60);
				break;
			default:
				setSecondsLeft(storage?.pomodoro * 60);
		}
	};

	const savePomodoroConfiguration = newValues => {
		switch (mode) {
			case "short":
				setSecondsLeft(newValues?.shortBreak * 60);
				break;
			case "long":
				setSecondsLeft(newValues?.longBreak * 60);
				break;
			default:
				setSecondsLeft(newValues?.pomodoro * 60);
		}
		setStorage({
			...storage,
			pomodoro: newValues?.pomodoro,
			shortBreak: newValues?.shortBreak,
			longBreak: newValues?.longBreak,
		});
		setOpened(false);
		setIsActive(false);
	};

	const restartPomodorosToday = () => {
		setStorage({
			...storage,
			pomodoroToday: 0,
		});
	};

	return (
		<>
			<Stack w="100%">
				<Title text="Pomodoro">
					<ActionIcon
						variant="light"
						aria-label="Pomodoro settings"
						onClick={() => setOpened(true)}
					>
						<IconSettings size={18} />
					</ActionIcon>
				</Title>
				<Flex
					w="100%"
					sx={_ => ({
						"@media (max-width: 768px)": {
							justifyContent: "center",
						},
					})}
				>
					<SegmentedControl
						size="xs"
						value={mode}
						data={POMODORO_MODES}
						onChange={value => setMode(value)}
					/>
				</Flex>
				<Flex
					align="center"
					justify="space-between"
					sx={_ => ({
						"@media (max-width: 768px)": {
							justifyContent: "center",
							gap: 20,
						},
					})}
				>
					<Text fz={48} fw={600}>
						{formatTime(secondsLeft)}
					</Text>
					<Flex gap="xs">
						{isActive ? (
							<ActionIcon
								color="red"
								variant="light"
								onClick={() => setIsActive(false)}
								aria-label="Pause pomodoro"
							>
								<IconPlayerPause size={18} />
							</ActionIcon>
						) : (
							<ActionIcon
								color="green"
								variant="light"
								onClick={() => setIsActive(true)}
								aria-label="Play pomodoro"
							>
								<IconPlayerPlay size={18} />
							</ActionIcon>
						)}

						<ActionIcon
							variant="light"
							aria-label="Restart pomodoro"
							onClick={restartPomodoro}
						>
							<IconReload size={18} />
						</ActionIcon>
					</Flex>
				</Flex>
				<Flex align="center" justify="space-between">
					<Text
						fz={14}
						sx={_ => ({
							"@media (max-width: 768px)": {
								textAlign: "center",
							},
						})}
					>
						<Badge radius="sm" size="sm" mr={5}>
							{storage?.pomodoroToday}
						</Badge>
						completed today
					</Text>
					<ActionIcon
						variant="light"
						aria-label="Restart pomodoros today"
						onClick={restartPomodorosToday}
					>
						<IconReload size={18} />
					</ActionIcon>
				</Flex>
			</Stack>

			<PomodoroSettings
				open={opened}
				onClose={() => setOpened(false)}
				settings={storage}
				onSaveSettings={savePomodoroConfiguration}
			/>
		</>
	);
};

export default Pomodoro;
