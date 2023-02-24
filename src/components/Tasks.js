import { ActionIcon, Flex, Text, ThemeIcon } from "@mantine/core";
import { IconGripVertical, IconTrash, IconCheck } from "@tabler/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Tasks = ({ tasks, onTaskCheck, onTaskDelete, onTaskMove }) => {
	return (
		<DragDropContext
			onDragEnd={({ destination, source }) =>
				onTaskMove(source.index, destination?.index || 0)
			}
		>
			<Droppable droppableId="droppable-1" type="PERSON">
				{(provided, _) => (
					<div ref={provided.innerRef} {...provided.droppableProps}>
						{tasks?.map((task, index) => (
							<Draggable
								draggableId={`draggable-${index}`}
								index={index}
								key={index}
							>
								{(provided, _) => (
									<Flex
										align="center"
										ref={provided.innerRef}
										{...provided.draggableProps}
										mb={10}
									>
										<ThemeIcon
											variant="light"
											color="gray"
											title="Move task"
											{...provided.dragHandleProps}
										>
											<IconGripVertical size={14} />
										</ThemeIcon>

										<ActionIcon
											color={
												task?.ready ? "green" : "gray"
											}
											title={
												task?.ready
													? "Mark task as unready"
													: "Mark task as unready"
											}
											variant="filled"
											onClick={() =>
												onTaskCheck(index, !task?.ready)
											}
											size="xs"
											mx={10}
										>
											{task?.ready && (
												<IconCheck size={14} />
											)}
										</ActionIcon>

										<Text
											size="sm"
											w="100%"
											mr={5}
											style={{
												wordBreak: "break-all",
											}}
										>
											{task?.text}
										</Text>
										<ActionIcon
											color="red"
											title="Delete task"
											onClick={() => onTaskDelete(index)}
										>
											<IconTrash size={16} />
										</ActionIcon>
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

export default Tasks;
