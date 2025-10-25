import { memo } from "react";
import { ActionIcon, Flex, TypographyStylesProvider } from "@mantine/core";
import { IconGripVertical, IconTrash, IconCheck, IconPencil } from "@tabler/icons-react";
import linkifyHtml from "linkify-html";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { TaskType } from "@/types/task";
import Action from "./common/Action";

interface TasksProps {
	tasks: TaskType[];
	onTaskCheck: (index: number, ready: boolean) => void;
	onTaskDelete: (index: number) => void;
	onTaskMove: (sourceIndex: number, destinationIndex: number) => void;
	onTaskEdit: (index: number, text: string) => void;
}

const options = { defaultProtocol: "https", target: "_blank" } as const;

const Tasks = ({ tasks, onTaskCheck, onTaskDelete, onTaskMove, onTaskEdit }: TasksProps) => {

	if (!tasks?.length) return null;

	return (
		<DragDropContext onDragEnd={({ destination, source }) => {
			if (!destination) return;
			onTaskMove(source.index, destination.index);
		}}>
			<Droppable
				droppableId="droppable-1"
				type="TASKS"
			>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
					>
						{tasks?.map((task: TaskType, index: number) => (
							<Draggable
								draggableId={`draggable-${index}`}
								index={index}
								key={index}
							>
								{(provided) => (
									<Flex
										align="center"
										ref={provided.innerRef}
										{...provided.draggableProps}
										mb={10}
									>
										<Flex
											align="center"
											{...provided.dragHandleProps}
										>
											<IconGripVertical
												color="gray"
												size={14}
											/>
										</Flex>

										<ActionIcon
											color={task?.ready ? "green" : "gray"}
											aria-label={task?.ready ? "Mark task as unready" : "Mark task as ready"}
											variant="filled"
											onClick={() => onTaskCheck(index, !task?.ready)}
											size="xs"
											mx={10}
										>
											{task?.ready && <IconCheck size={14} />}
										</ActionIcon>

										<TypographyStylesProvider
											fz="sm"
											w="100%"
											mr={5}
											style={() => ({
												wordBreak: "break-all",
											})}
											c="inherit"
										>
											<div
												dangerouslySetInnerHTML={{
													__html: linkifyHtml(task?.text, options),
												}}
											/>
										</TypographyStylesProvider>
										<Flex
											align="center"
											gap={5}
										>
											<Action
												color="blue"
												aria-label="Edit task"
												onClick={() => onTaskEdit(index, task?.text)}
											>
												<IconPencil size={16} />
											</Action>
											<Action
												color="red"
												aria-label="Delete task"
												onClick={() => onTaskDelete(index)}
											>
												<IconTrash size={16} />
											</Action>
										</Flex>
									</Flex>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default memo(Tasks);
