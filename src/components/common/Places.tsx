import { useState } from 'react';
import { Menu } from '@mantine/core';
import { IconBrandX, IconDots, IconGitFork, IconTrash, IconConfetti, IconConfettiOff } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import { useAnalytics } from '@/hooks/useAnalytics';
import { useConvexPlaces } from '@/hooks/useConvexPlaces';
import useLocalStorage from '@/hooks/useLocalStorage';
import ForkPlace from '../modals/ForkPlace';
import Action from './Action';

const Places = ({ name }: { name: string }) => {
    const router = useRouter();
    const [storage, setStorage] = useLocalStorage<string>('dailyPlaceNames', '');
	const [opened, setOpened] = useState(false);
	const { trackEvent } = useAnalytics();
    const t = useTranslations();
    const [confettiEnabled, setConfettiEnabled] = useLocalStorage<boolean>('confettiEnabled', true);
	const { deletePlace } = useConvexPlaces();

    const removePlace = async () => {
		trackEvent({
            action: 'place_deleted',
            category: 'place',
            label: `Place ${name} deleted`
        });
		const places = storage?.split(',') || [];
        const temporal_places = [...places];
        const idx = router?.query?.idx;

        temporal_places.splice(Number(idx), 1);

        setStorage(temporal_places?.toString());
		await deletePlace(name);
        router?.push('/');
    };

    const toggleConfetti = () => {
        const newValue = !confettiEnabled;
        setConfettiEnabled(newValue);

        trackEvent({
            action: newValue ? 'confetti_enabled' : 'confetti_disabled',
            category: 'settings',
            label: `Confetti ${newValue ? 'enabled' : 'disabled'}`
        });
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
                <Menu.Label>{t('places.myPlaces')}</Menu.Label>
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
                                    src={`https://api.dicebear.com/9.x/icons/svg?seed=${place}&radius=50&backgroundColor=F9A88B,F78B64,F56D3B,E9470C,AF3509`}
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
							{t('places.forkPlace')}
						</Menu.Item>
                        <Menu.Item
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://x.com/intent/tweet
							?text=${name}'s place by&url=https://daily.place/${name}`}
                            component="a"
                            leftSection={<IconBrandX size={16} />}
                        >
                            {t('places.sharePlace')}
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Label>{t('places.settings')}</Menu.Label>
                        <Menu.Item
                            onClick={toggleConfetti}
                            leftSection={confettiEnabled ? <IconConfettiOff size={16} /> : <IconConfetti size={16} />}
                            color={confettiEnabled ? 'gray' : 'green'}
                        >
                            {confettiEnabled ? t('places.confettiDisabled') : t('places.confettiEnabled')}
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Label>{t('places.dangerZone')}</Menu.Label>
                        <Menu.Item
                            onClick={removePlace}
                            color="red"
                            leftSection={<IconTrash size={16} />}
                        >
                            {t('places.deletePlace')}
                        </Menu.Item>
                    </>
                )}
            </Menu.Dropdown>
        </Menu>

		<ForkPlace name={name as string} open={opened} onClose={setOpened}/></>
    );
};

export default Places;
