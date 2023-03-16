import { useState, useEffect } from "react";
import { Text } from "@mantine/core";

import { format } from "date-fns";

const DateAndTime = () => {
	const [dateState, setDateState] = useState(new Date());

	useEffect(() => {
        const interval = setInterval(() => {
            setDateState(new Date());
        }, 60000);

        return () => clearInterval(interval);
	}, []);

	return (
		<Text m={0} c="dimmed" fz={14}>
			{format(dateState, "LLLL do, hh:mm aaa")}
		</Text>
	);
};

export default DateAndTime;
