import { ActionIcon, Flex, Text, Checkbox, ThemeIcon } from "@mantine/core";
import { IconGripVertical, IconTrash } from "@tabler/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Tasks = ({ tasks, markTaskAsReady, deleteTask, moveTaskOrder }) => {
	return (
		<DragDropContext
			onDragEnd={({ destination, source }) =>
				moveTaskOrder(source.index, destination?.index || 0)
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
										mb={5}
									>
										<ThemeIcon
											variant="light"
											color="gray"
											title="Move task"
											mr={5}
											{...provided.dragHandleProps}
										>
											<IconGripVertical size={14} />
										</ThemeIcon>
										<Checkbox
											color="green"
											checked={task?.ready}
											label={<Text>{task?.text}</Text>}
											w="100%"
											onChange={event =>
												markTaskAsReady(
													index,
													event.currentTarget.checked
												)
											}
										/>
										<ActionIcon
											color="red"
											title="Delete task"
											onClick={() => deleteTask(index)}
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
