import Head from "next/head";
import {
	Flex,
	Title,
	Text,
	Badge,
	Divider,
	TypographyStylesProvider
} from "@mantine/core";

import { render } from "datocms-structured-text-to-html-string";
import { format, addDays } from "date-fns";

import { getChangelog } from "./api/changelog";

import Social from "@/components/common/Social";

export async function getStaticProps() {
	const data = (await getChangelog()) || [];

	return {
		props: {
			data: data?.data?.allChangelogs || [],
		},
	};
}

const Changelog = ({ data }) => {
	return (
		<>
			<Head>
				<title>Changelog | daily.place</title>
				<meta name="title" content="Changelog | daily.place" />
				<meta
					name="description"
					content="The latest updates and changes from daily.place"
				/>
			</Head>
			<div>
				<Flex
                    mt={25}
                    mb={50}
                    justify="space-between"
                    align="center"
                    w="100%"
                    wrap="wrap"
                    sx={{                
                        '@media (max-width: 380px)': {
                          flexDirection: "column",
                          gap: 20
                        },
                    }}
                >
                    <Title order={1}>
                        Changelog
                    </Title>

					<Social />
				</Flex>

				{data?.map((data, index) => (
					<Flex
						key={index}
						gap={25}
						sx={_ => ({
							"@media (max-width: 768px)": {
								flexDirection: "column",
								gap: 10,
							},
						})}
					>
						<Flex
							w="20%"
							direction="column"
							align="start"
							gap={10}
							sx={_ => ({
								"@media (max-width: 768px)": {
									width: "100%",
								},
							})}
						>
							<Badge
								color={index > 0 && "gray"}
								size="lg"
								radius="sm"
							>
								{data?.version}
							</Badge>
							<Text fz="sm" c="dimmed" component="p">
								{format(
									addDays(new Date(data?.date), 1),
									"LLLL d, yyyy"
								)}
							</Text>
						</Flex>
						<Flex
							gap={0}
							direction="column"
							w="80%"
							sx={_ => ({
								"@media (max-width: 768px)": {
									width: "100%",
								},
							})}
						>
							<Title order={3} mb={25}>
								{data?.title}
							</Title>

							<TypographyStylesProvider fz="sm" c="inherit">
								<div
									dangerouslySetInnerHTML={{
										__html: render(
											data?.content?.value || {}
										),
									}}
								/>
							</TypographyStylesProvider>

							<TypographyStylesProvider fz="sm" c="inherit">
								<div
									dangerouslySetInnerHTML={{
										__html: render(
											data?.items?.value || {}
										),
									}}
								/>
							</TypographyStylesProvider>
							<Divider my={25} />
						</Flex>
					</Flex>
				))}
			</div>
		</>
	);
};

export default Changelog;
