import { useRouter } from "next/router";
import Link from "next/link";
import { Menu } from "@mantine/core";
import Action from "./Action";
import { IconBookmarks, IconBookmarkOff } from "@tabler/icons";

const Places = ({ items, setItems, name }) => {
	const router = useRouter();

    const removePlace = () => {
		const temporal_places = [...items];
		const idx = router?.query?.idx;
		temporal_places.splice(idx, 1);

        setItems(temporal_places?.toString());
		router?.push("/");
	};

	if (!Boolean(items?.length)) return null;

	return (
		<Menu shadow="md" width={200} withArrow>
			<Menu.Target>
				<div
					style={{
						position: "relative",
					}}
				>
					<Action aria-label="Saved places">
						<IconBookmarks size={18} />
					</Action>
				</div>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Label>My places</Menu.Label>
				{Boolean(items?.length) &&
					items?.map((place, index) => (
						<Link
							href={{
								pathname: `/${place}`,
								query: { idx: index },
							}}
							passHref
							legacyBehavior
							key={index}
							as={`/${place}`}
						>
							<Menu.Item
								component="a"
								icon={
									<img
										alt="Place avatar"
										src={`https://source.boringavatars.com/marble/20/${place}?colors=F9A88B,F78B64,F56D3B,E9470C,AF3509`}
									/>
								}
							>
								{place}
							</Menu.Item>
						</Link>
					))}

				{ name && <>
                    <Menu.Divider />
                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item
                        onClick={removePlace}
                        color="red"
                        py={4}
                        rightSection={
                            <Action aria-label="Delete place" color="red">
                                <IconBookmarkOff size={16} />
                            </Action>
                        }
                    >
                        Delete this place
                    </Menu.Item>
                </> }
			</Menu.Dropdown>
		</Menu>
	);
};

export default Places;