import { ActionIcon } from "@mantine/core";

const Action = props => {
	return (
		<ActionIcon radius="xl" {...props}>
			{props.children}
		</ActionIcon>
	);
};

export default Action;
