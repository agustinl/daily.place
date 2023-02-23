import { useState, useRef, useEffect } from "react";
import {
	Stack,
	ActionIcon,
	Flex,
	Text,
	TextInput,
	RingProgress,
	Badge,
	useMantineTheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconCheckupList, IconPlus } from "@tabler/icons";

import Title from "./common/Title";
import Tasks from "./Tasks";

const Todo = ({ name }) => {
	const theme = useMantineTheme();
	const [storage, setStorage] = useLocalStorage({
		key: `dailyTodo_${name}`,
		defaultValue: [],
	});

	const [tasks, setTasks] = useState(storage);
	const [progress, setProgress] = useState({
		progress: 0,
		percentage: 0,
		total: 0,
	});

	const task = useRef("");

	useEffect(() => {
		setTasks(storage);
	}, [storage]);

	useEffect(() => {
		const progress =
			tasks?.filter(task => task.ready === true)?.length ?? 0;
		const percentage = Math.round((progress * 100) / tasks?.length) || 0;

		setProgress({
			progress,
			percentage,
			total: tasks?.length,
		});
	}, [tasks]);

	const addNewTask = e => {
		e && e?.preventDefault();

		if (task?.current?.value === "") return;

		const new_tasks = [
			...tasks,
			{
				text: task?.current?.value,
				ready: false,
			},
		];

		setStorage(new_tasks);

		task.current.value = "";
	};

	const markTaskAsReady = (taskIndex, readyBoolean) => {
		const temporal_tasks = [...tasks];
		temporal_tasks[taskIndex].ready = readyBoolean;

		setStorage(temporal_tasks);
	};

	const deleteTask = taskIndex => {
		const temporal_tasks = [...tasks];
		temporal_tasks.splice(taskIndex, 1);

		setStorage(temporal_tasks);
	};

	const moveTaskOrder = (fromIndex, toIndex) => {
		const temporal_tasks = [...tasks];
		const task = temporal_tasks[fromIndex];

		temporal_tasks?.splice(fromIndex, 1);
		temporal_tasks.splice(toIndex, 0, task);

		setStorage(temporal_tasks);
	};

	return (
		<Stack w="100%">
			<Title icon={<IconCheckupList />} text="To Do" />
			<Flex justify="space-between" align="center">
				<Text fz={14}>
					{Boolean(tasks?.length) && (
						<>
							<Badge color="green" variant="outline" radius="sm">
								{progress?.progress}/{progress?.total}
							</Badge>{" "}
							done
						</>
					)}
				</Text>
				<RingProgress
					sections={[
						{
							value: progress?.percentage,
							color: "green",
							tooltip: `${progress?.progress} task completed`,
						},
					]}
					size={60}
					thickness={6}
					roundCaps
					rootColor={
						theme.colorScheme === "dark"
							? theme.colors.dark[7]
							: theme.colors.gray[3]
					}
					label={
						<Text
							color="green"
							weight={700}
							align="center"
							size="xs"
						>
							{progress?.percentage}%
						</Text>
					}
				/>
			</Flex>
			<Stack>
				<Tasks
					tasks={tasks}
					markTaskAsReady={markTaskAsReady}
					deleteTask={deleteTask}
					moveTaskOrder={moveTaskOrder}
				/>
			</Stack>
			<form onSubmit={addNewTask}>
				<TextInput
					placeholder="Add new task..."
					ref={task}
					variant="unstyled"
					required
					rightSection={
						<ActionIcon
							variant="light"
							title="Add task"
							onClick={addNewTask}
						>
							<IconPlus size={16} />
						</ActionIcon>
					}
				/>
			</form>
		</Stack>
	);
};

export default Todo;
