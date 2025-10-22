import { Title } from "@mantine/core";
import { useTranslations } from "next-intl";

const Custom404 = () => {
	const t = useTranslations();

	return (
		<div>
			<Title>{t('404.title')}</Title>
		</div>
	);
};

export default Custom404;
