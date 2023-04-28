import { Alert as MantineAlert, TypographyStylesProvider } from "@mantine/core";
import { IconSeeding } from "@tabler/icons";
import { useLocalStorage } from "@mantine/hooks";
import { render } from "datocms-structured-text-to-html-string";

const Alert = ({ alert }) => {
	const [showAlert, setShowAlert] = useLocalStorage({
		key: "dailyPlace_ShowAlert",
		defaultValue: true,
	});

	const closeAlert = () => {
		setShowAlert(false);
	};

	return (
		<>
			{showAlert &&
				alert?.map((data, index) => (
					<MantineAlert
						icon={<IconSeeding size={16} />}
						title={data?.title}
						color="green"
						withCloseButton
						w="100%"
						onClose={closeAlert}
						key={index}
					>
						<TypographyStylesProvider fz="sm" c="inherit">
							<div
								dangerouslySetInnerHTML={{
									__html: render(
										data?.description?.value || {}
									),
								}}
							/>
						</TypographyStylesProvider>
					</MantineAlert>
				))}
		</>
	);
};

export default Alert;
