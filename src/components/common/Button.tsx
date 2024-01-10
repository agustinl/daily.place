import { forwardRef } from "react";

import { Button as MantineButton, ButtonProps, createPolymorphicComponent } from "@mantine/core";

// Create intermediate component with default ref type and props
const _Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...others }, ref) => (
	<MantineButton
		variant="gradient"
		gradient={{
			from: "dark.7",
			to: "dark.4",
		}}
		ref={ref}
		{...others}
	>
		{children}
	</MantineButton>
));

// createPolymorphicComponent accepts two types: default element and component props
// all other props will be added to component type automatically
const Button = createPolymorphicComponent<"button", ButtonProps>(_Button);

export default Button;

_Button.displayName = "Button";
