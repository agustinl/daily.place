import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { Flex } from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';

import Pomodoro from "@/components/Pomodoro";
import Todo from "@/components/Todo";
import Playlist from "@/components/Playlist";
import SecondaryNavBar from "@/components/layout/SecondaryNavBar";

const Place = () => {
	const router = useRouter();
    const { height } = useViewportSize();
	const { name } = router.query;
	const title = `${name}'s place | daily.place`;
	const place = `${name}'s place`;    

	useEffect(() => {
		const storage = localStorage.getItem("dailyPlaceNames");

		if (storage) {
			const found = storage?.split(",").find(element => element == name);

			if (!found) {
				localStorage.setItem(
					"dailyPlaceNames",
					storage?.concat(",", name)
				);
			}
		} else {
			localStorage.setItem("dailyPlaceNames", name);
		}
	}, [name]);

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
            
			<Flex
                mih={`calc(${height}px - 190px)`}
                direction="column"
                justify="space-between"
                w="100%"
            >
                <SecondaryNavBar place={place} />

				<div>
                    <Flex
                        gap={50}
                        my={50}
                        w="100%"
                        sx={_ => ({
                            "@media (max-width: 680px)": {
                                flexDirection: "column",
                            },
                        })}
                    >
                        <Pomodoro name={name} title={title} />
                        <Todo name={name} />
                    </Flex>

                    <Flex w="100%">
                        <Playlist />
                    </Flex>
                </div>

                <div></div>
			</Flex>
		</>
	);
};

export default Place;
