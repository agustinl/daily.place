import { useState, useEffect } from "react";
import {
	Stack,
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
import { useHotkeys } from "@mantine/hooks";

import Title from "./common/Title";
import PomodoroSettings from "./modals/PomodoroSettings";
import Shortcuts from "./modals/Shortcuts";
import Action from "./common/Action";

import { formatTime } from "@/helpers/formatTime";

import pomodoroSound from "../../public/sounds/pomodoro-timer.mp3";

import useLocalStorage from "@/hooks/useLocalStorage";

import { POMODORO_SETTINGS, POMODORO_MODES } from "@/constants/PomodoroConstants";

const Pomodoro = ({ name, title }) => {
	const [storage, setStorage] = useLocalStorage(`dailyPomodoro_${name}`, POMODORO_SETTINGS);

    useHotkeys([
        ['mod+P', () => setIsActive(!isActive)],
        ['mod+alt+1', () => setMode("pomodoro")],
        ['mod+alt+2', () => setMode("short")],
        ['mod+alt+3', () => setMode("long")]
    ]);

	const [mode, setMode] = useState(POMODORO_MODES[0].value);
	const [secondsLeft, setSecondsLeft] = useState(storage?.pomodoro * 60);
	const [isActive, setIsActive] = useState(false);
	const [opened, setOpened] = useState(false);
	const [sound, setSound] = useState(null);
	const [previousTimestamp, setPreviousTimestamp] = useState(null);

    useEffect(() => {
		var sound = new Audio(pomodoroSound);

		setSound(sound);
	}, []);
	
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
				/* 
					On first run and after resets, `previousTimestamp` will
					be null and we have to artificially  subtract one second
					to trigger a change in delta.
				*/
				const refTimestamp = previousTimestamp === null? (Date.now()-1000):previousTimestamp

				/* 
					CPU time vs Wall time
					When a browser tab or window is off-screen
					or in a tab that isn't focused, the scheduler
					doesn't execute the JS engine every
					tick/second. Instead, the process is scheduled
					to run in less frequent intervals. This means
					that one can't assume that the interval timer
					will execute once every wall time second, but
					rather once every "JS engine active" second.
					Since the countdown should count wall time, 
					we need to calculate a delta for when the 
					function last ran.
				*/
				const delta = Math.round((Date.now()-refTimestamp)/1000)

				/* 
					We then subtract the delta time i.e. the
					time that has passed since last function
					execution.
				*/
				setSecondsLeft(secondsLeft => secondsLeft - delta);
                document.title = formatTime(secondsLeft - delta);

				// Update timestamp for last execution
				setPreviousTimestamp(Date.now())
			}, 1000);

			/* 
				secondsLeft can be less than 0 if the
				browser tab/window is running in the background
			*/
			if (secondsLeft <= 0) {
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

			if (secondsLeft <= 0 && mode == "pomodoro") {
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
		setPreviousTimestamp(null);
        document.title = title;

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
                    <Flex align="center" gap={10}>
                        <Shortcuts />
                        <Action
                            aria-label="Pomodoro settings"
                            onClick={() => setOpened(true)}
                        >
                            <IconSettings size={18} />
                        </Action>
                    </Flex>
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
						{formatTime(secondsLeft || 0)}
					</Text>
					<Flex gap="xs">
						{isActive ? (
							<Action
								color="red"
								variant="light"
								onClick={() => {
									setIsActive(false)
									setPreviousTimestamp(null)
								}}
								aria-label="Pause pomodoro"
							>
								<IconPlayerPause size={18} />
							</Action>
						) : (
							<Action
								color="green"
								variant="light"
								onClick={() => setIsActive(true)}
								aria-label="Play pomodoro"
							>
								<IconPlayerPlay size={18} />
							</Action>
						)}

						<Action
							variant="light"
							aria-label="Restart pomodoro"
							onClick={restartPomodoro}
						>
							<IconReload size={18} />
						</Action>
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
						<Badge
                            radius="sm"
                            size="sm"
                            mr={5}
                            color={storage?.pomodoroToday === 0 ? "gray" : "green"}
                        >
							{storage?.pomodoroToday}
						</Badge>
						completed today
					</Text>
					<Action
						variant="light"
						aria-label="Restart pomodoros today"
						onClick={restartPomodorosToday}
					>
						<IconReload size={18} />
					</Action>
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
