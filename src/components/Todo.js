import { useState, useRef, useEffect } from "react";
import {
	Stack,
	Flex,
	Text,
	TextInput,
	Progress,
	ScrollArea,
	Tooltip,
} from "@mantine/core";
import { IconSortDescending2, IconPlus } from "@tabler/icons";

import Title from "./common/Title";
import Tasks from "./Tasks";
import EditTask from "./modals/EditTask";
import DeleteTasks from "./modals/DeleteTasks";
import Action from "./common/Action";

import useLocalStorage from "@/hooks/useLocalStorage";

const Todo = ({ name }) => {
	const [storage, setStorage] = useLocalStorage( `dailyTodo_${name}`, []);

	const [opened, setOpened] = useState(false);
	const [editedTask, setEditedTask] = useState({});
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

	const moveDoneTasksDown = () => {
		const temporal_tasks = [...tasks];
		temporal_tasks?.sort((a, b) => a?.ready - b?.ready);

		setStorage(temporal_tasks);
	};

	const handleEditTaskClick = taskIndex => {
		let temporal_edited_task = tasks[taskIndex];
		setEditedTask({ ...temporal_edited_task, i: taskIndex });
		setOpened(true);
	};

	const editTask = newValue => {
		const temporal_tasks = [...tasks];
		temporal_tasks[editedTask?.i].text = newValue;

		setStorage(temporal_tasks);
		setOpened(false);
	};

	const deleteAllTasks = () => {
		setStorage([]);
	};

	return (
		<>
			<Stack w="100%">
				<Title text="To Do">
					<Flex align="center" gap={10}>
						{tasks?.length >= 2 && (
							<>
								<DeleteTasks onDeleteTasks={deleteAllTasks} />
								<Tooltip label="Move done tasks down">
									<Action
										aria-label="Move done tasks down"
										onClick={moveDoneTasksDown}
									>
										<IconSortDescending2 size={18} />
									</Action>
								</Tooltip>
							</>
						)}
					</Flex>
				</Title>
				<Stack spacing={5}>
					<Flex justify="space-between" align="center">
						<Text fz={12} c="dimmed" component="p" m={0}>
							Progress
						</Text>
						<Text fz={14} c="dimmed" component="p" m={0}>
							{progress?.percentage}%
						</Text>
					</Flex>
					<Progress
						value={progress?.percentage}
						color="green"
						aria-label="Progress"
					/>
					<Text fz={12} c="dimmed" component="p" m={0} align="right">
						{progress?.progress}/{progress?.total} completed
					</Text>
				</Stack>
				<Stack mt={20}>
					<ScrollArea
						sx={_ => ({
							maxHeight: "25vw",
							"@media (max-width: 680px)": {
								maxHeight: "100%",
							},
						})}
						type="auto"
						offsetScrollbars
					>
						<Tasks
							tasks={tasks}
							onTaskCheck={markTaskAsReady}
							onTaskDelete={deleteTask}
							onTaskMove={moveTaskOrder}
							onTaskEdit={handleEditTaskClick}
						/>
					</ScrollArea>
				</Stack>
				<form onSubmit={addNewTask}>
					<TextInput
						placeholder="Add new task..."
						ref={task}
                        variant="unstyled"
						required
						rightSection={
							<Action
								aria-label="Add task"
								onClick={addNewTask}
							>
								<IconPlus size={16} />
							</Action>
						}
					/>
				</form>
			</Stack>
			<EditTask
				open={opened}
				onClose={() => setOpened(false)}
				task={editedTask}
				onTaskEdit={editTask}
			/>
		</>
	);
};

export default Todo;
