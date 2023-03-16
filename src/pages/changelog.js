import Head from "next/head";
import {
	Flex,
	Title,
	Text,
	Badge,
	Divider,
	TypographyStylesProvider,
} from "@mantine/core";
import GoBack from "@/components/layout/GoBack";

import { render } from "datocms-structured-text-to-html-string";
import { format, addDays } from "date-fns";

import { getChangelog } from "./api/changelog";

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
				<GoBack />
				<div>
                    <Title order={1} fw={500} mb={50}>
                        Changelog
                    </Title>

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
			</div>

			<Flex
				align="center"
				gap={25}
				mb={25}
				sx={_ => ({
					"@media (max-width: 560px)": {
						flexDirection: "column",
					},
				})}
			>
				<a
					href="https://www.producthunt.com/posts/daily-place?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-daily&#0045;place"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=380723&theme=light"
						alt="daily&#0046;place - Create&#0032;your&#0032;perfect&#0032;space&#0032;to&#0032;focus&#0032;on&#0032;your&#0032;daily&#0032;tasks | Product Hunt"
						style={{
							width: "250px",
							height: "54px",
						}}
						width="250"
						height="54"
					/>
				</a>
			</Flex>
		</>
	);
};

export default Changelog;
