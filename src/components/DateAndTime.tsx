import { Text } from '@mantine/core';
import { format } from 'date-fns';
import { es, pt, enUS } from 'date-fns/locale';

import { useDateTime } from '@/hooks/useDateTime';
import { useLanguageContext } from '@/contexts/LanguageContext';

const DateAndTime = () => {
    const dateState = useDateTime();
    const { locale } = useLanguageContext();

    // Configure locale and format based on language
    const getDateConfig = () => {
        switch (locale) {
            case 'es':
                return {
                    locale: es,
                    date: "EEEE d 'de' MMMM",
                    time: 'HH:mm'
                };
            case 'pt':
                return {
                    locale: pt,
                    date: "EEEE, d 'de' MMMM",
                    time: 'HH:mm'
                };
            default:
                return {
                    locale: enUS,
                    date: 'EEEE, MMMM do',
                    time: 'hh:mm aaa'
                };
        }
    };

    const { locale: dateLocale, date, time } = getDateConfig();

    return (
        <Text m={0} c="var(--dp-text-secondary)" fz={14}>
            {format(dateState, date, { locale: dateLocale })} ·{' '}
            <Text span inherit fw={600} c="var(--dp-text)">
                {format(dateState, time, { locale: dateLocale })}
            </Text>
        </Text>
    );
};

export default DateAndTime;
