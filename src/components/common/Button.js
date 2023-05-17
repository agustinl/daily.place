import { Button as MantineButton } from "@mantine/core";

const Button = props => {
	return (
		<MantineButton
            variant="gradient"
            gradient={{
                from: "dark.7",
                to: "dark.4",
            }}
            /* radius="xl" */
			{...props}
		>
			{props.children}
		</MantineButton>
	);
};

export default Button;
