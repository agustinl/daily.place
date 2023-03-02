import { ActionIcon, Flex, Text } from "@mantine/core";
import { IconGripVertical, IconTrash, IconCheck, IconPencilMinus } from "@tabler/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Tasks = ({ tasks, onTaskCheck, onTaskDelete, onTaskMove, onTaskEdit }) => {
	return (
		<DragDropContext
			onDragEnd={({ destination, source }) =>
				onTaskMove(source.index, destination?.index || 0)
			}
		>
			<Droppable droppableId="droppable-1" type="TASKS">
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
											color={
												task?.ready ? "green" : "gray"
											}
											aria-label={
												task?.ready
													? "Mark task as unready"
													: "Mark task as ready"
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
                                            color="blue"
											aria-label="Edit task"
											onClick={() => onTaskEdit(index, task?.text)}
										>
											<IconPencilMinus size={16} />
										</ActionIcon>
                                        
										<ActionIcon
											color="red"
											aria-label="Delete task"
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
