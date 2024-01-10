import { Flex, Title, Text, Badge, Divider, TypographyStylesProvider } from "@mantine/core";
import { format } from "date-fns";
import { render } from "datocms-structured-text-to-html-string";
import { GetStaticProps } from "next";
import Head from "next/head";

import Social from "@/components/common/Social";

import { getChangelog } from "./api/changelog";

type ChangelogRecord = {
	title: string;
	version: string;
	date?: Date;
	id: string;
	content: any;
	items: any;
};

export const getStaticProps = (async () => {
	const data = (await getChangelog()) || [];

	const logs = await data?.data?.allChangelogs?.map((obj: ChangelogRecord) => ({
		...obj,
		date: format(new Date(obj?.date), "LLLL d, yyyy"),
	}));

	return {
		props: {
			data: logs || [],
		},
	};
}) satisfies GetStaticProps;

const Changelog = ({ data }) => {
	return (
		<>
			<Head>
				<title>Changelog | daily.place</title>
				<meta
					name="title"
					content="Changelog | daily.place"
				/>
				<meta
					name="description"
					content="The latest updates and changes from daily.place"
				/>
			</Head>
			<div>
				<Flex
					mb={50}
					justify="space-between"
					align="center"
					w="100%"
					wrap="wrap"
					sx={{
						"@media (max-width: 380px)": {
							flexDirection: "column",
							gap: 20,
						},
					}}
				>
					<Title order={3}>Changelog</Title>

					<Social />
				</Flex>

				{data?.map((data: ChangelogRecord, index: number) => (
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
								size="lg"
								radius="sm"
								variant={index > 0 ? "light" : "gradient"}
								color="gray"
								gradient={{
									from: "dark.7",
									to: "dark.4",
								}}
							>
								{data?.version}
							</Badge>
							<Text
								fz="sm"
								c="dimmed"
								component="p"
							>
								{data?.date?.toString()}
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
							<Title
								order={4}
								mb={25}
							>
								{data?.title}
							</Title>

							<TypographyStylesProvider
								fz="sm"
								c="inherit"
							>
								<div
									dangerouslySetInnerHTML={{
										__html: render(data?.content?.value || {}),
									}}
								/>
							</TypographyStylesProvider>

							<TypographyStylesProvider
								fz="sm"
								sx={theme => ({
									a: {
										color: theme.colors.orange[6],
									},
								})}
							>
								<div
									dangerouslySetInnerHTML={{
										__html: render(data?.items?.value || {}),
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
