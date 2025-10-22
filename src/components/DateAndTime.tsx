import { Text } from "@mantine/core";
import { format } from "date-fns";
import { es, pt, enUS } from "date-fns/locale";

import { useDateTime } from "@/hooks/useDateTime";
import { useLanguageContext } from "@/contexts/LanguageContext";

const DateAndTime = () => {
	const dateState = useDateTime();
	const { locale } = useLanguageContext();

	// Configure locale and format based on language
	const getDateConfig = () => {
		switch (locale) {
			case 'es':
				return {
					locale: es,
					format: "d 'de' MMMM, HH:mm"
				};
			case 'pt':
				return {
					locale: pt,
					format: "d 'de' MMMM, HH:mm"
				};
			default:
				return {
					locale: enUS,
					format: "MMMM do, hh:mm aaa"
				};
		}
	};

	const { locale: dateLocale, format: dateFormat } = getDateConfig();

	return (
		<Text
			m={0}
			c="dimmed"
			fz={14}
		>
			{format(dateState, dateFormat, { locale: dateLocale })}
		</Text>
	);
};

export default DateAndTime;
