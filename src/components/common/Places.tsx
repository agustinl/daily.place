import { Menu } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Action from './Action';
import Link from 'next/link';
import useLocalStorage from '@/hooks/useLocalStorage';
import { IconBrandX, IconDots, IconGitFork, IconTrash } from '@tabler/icons-react';
import ForkPlace from '../modals/ForkPlace';
import { useState } from 'react';
import { usePlausible } from 'next-plausible';

const Places = ({ name }: { name: string }) => {
    const router = useRouter();
    const [storage, setStorage] = useLocalStorage<string>('dailyPlaceNames', '');
	const [opened, setOpened] = useState(false);
	const plausible = usePlausible();

    const removePlace = () => {
		plausible('Place+deleted');
		const places = storage?.split(',') || [];
        const temporal_places = [...places];
        const idx = router?.query?.idx;

        temporal_places.splice(Number(idx), 1);

        setStorage(temporal_places?.toString());
        router?.push('/');
    };

    if (!storage || !storage?.split(',')?.length) return null;

    return (
		<>
        <Menu width={200} withArrow trigger="hover">
            <Menu.Target>
                <Action aria-label="Menu">
                    <IconDots size={18} />
                </Action>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>My places</Menu.Label>
                {storage?.split(',')?.map((place: string, index: number) => (
                    <Link
                        href={{
                            pathname: `/${place}`,
                            query: { idx: index }
                        }}
                        passHref
                        legacyBehavior
                        key={index}
                        as={`/${place}`}
                    >
                        <Menu.Item
                            component="a"
                            leftSection={
                                <Image
                                    alt="Place avatar"
                                    width="18"
                                    height="18"
                                    // eslint-disable-next-line max-len
                                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${place}&radius=50&backgroundColor=F9A88B,F78B64,F56D3B,E9470C,AF3509`}
                                />
                            }
                        >
                            {place}
                        </Menu.Item>
                    </Link>
                ))}

                {name && (
                    <>
                        <Menu.Divider />
						<Menu.Item
							onClick={() => setOpened(true)}
							leftSection={<IconGitFork size={16} />}
						>
							Fork this place
						</Menu.Item>
                        <Menu.Item
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://x.com/intent/tweet
							?text=${name}'s place by&url=https://daily.place/${name}`}
                            component="a"
                            leftSection={<IconBrandX size={16} />}
                        >
                            Share place
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Label>Danger zone</Menu.Label>
                        <Menu.Item
                            onClick={removePlace}
                            color="red"
                            leftSection={<IconTrash size={16} />}
                        >
                            Delete this place
                        </Menu.Item>
                    </>
                )}
            </Menu.Dropdown>
        </Menu>

		<ForkPlace name={name as string} open={opened} onClose={setOpened}/></>
    );
};

export default Places;
