export type TaskType = {
	text: string;
	ready: boolean;
};

export type EditedTaskType = {
	i: number;
} & TaskType;
