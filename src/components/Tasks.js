import {
    ActionIcon,
	Flex,
	TypographyStylesProvider,
} from "@mantine/core";
import {
	IconGripVertical,
	IconTrash,
	IconCheck,
	IconPencil,
} from "@tabler/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import linkifyHtml from "linkify-html";
import Action from "./common/Action";

const options = { defaultProtocol: "https", target: "_blank" };

const Tasks = ({
	tasks,
	onTaskCheck,
	onTaskDelete,
	onTaskMove,
	onTaskEdit,
}) => {
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

										<TypographyStylesProvider
											fz="sm"
											w="100%"
											mr={5}
											sx={(theme) => ({
												wordBreak: "break-all",
                                                a: {
                                                    color: theme.colors.orange[6]
                                                }
											})}
											c="inherit"
										>
											<div
												dangerouslySetInnerHTML={{
													__html: linkifyHtml(
														task?.text,
														options
													),
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
                                                onClick={() =>
                                                    onTaskEdit(index, task?.text)
                                                }
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

export default Tasks;
