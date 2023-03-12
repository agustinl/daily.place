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
		<Text fz={14} fw={300} component="p" m={0}>
			{format(dateState, "LLLL do, hh:mm aaa")}
		</Text>
	);
};

export default DateAndTime;
