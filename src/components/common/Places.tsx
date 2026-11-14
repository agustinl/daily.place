import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button, Menu } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconBrandX,
    IconLayoutGrid,
    IconGitFork,
    IconTrash,
    IconConfetti,
    IconConfettiOff
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { placePath } from '@/helpers/placeName';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useConvexPlaces } from '@/hooks/useConvexPlaces';
import useLocalStorage from '@/hooks/useLocalStorage';
import { getSyncErrorMessage } from '@/lib/syncError';
import ForkPlace from '../modals/ForkPlace';

export const getShareUrl = (name: string) =>
    `https://x.com/intent/tweet?${new URLSearchParams({
        text: `${name}'s place by`,
        url: `https://daily.place/${encodeURIComponent(name)}`
    })}`;

const Places = ({ name }: { name: string }) => {
    const router = useRouter();
    const [storage, setStorage] = useLocalStorage<string>(STORAGE_KEYS.placeNames, '');
    const [opened, setOpened] = useState(false);
    const { trackEvent } = useAnalytics();
    const t = useTranslations();
    const [confettiEnabled, setConfettiEnabled] = useLocalStorage<boolean>(
        STORAGE_KEYS.confetti,
        true
    );
    const { deletePlace } = useConvexPlaces();
    const { isSignedIn } = useUser();

    const removePlace = async () => {
        trackEvent({
            action: 'place_deleted',
            category: 'place',
            label: `Place ${name} deleted`
        });
        const places = storage?.split(',') || [];
        setStorage(places.filter((place) => place !== name).toString());

        // The local copy is the source of truth; the cloud copy only exists for signed-in users
        if (isSignedIn) {
            try {
                await deletePlace(name);
            } catch (error) {
                notifications.show({
                    title: t('places.deleteCloudError'),
                    message: getSyncErrorMessage(error, t),
                    color: 'red',
                    autoClose: 4000
                });
            }
        }
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
                    <Button
                        aria-label="Menu"
                        variant="default"
                        h={44}
                        px={12}
                        fz={14}
                        fw={500}
                        leftSection={<IconLayoutGrid size={16} />}
                    >
                        {t('places.myPlaces')}
                    </Button>
                </Menu.Target>

                <Menu.Dropdown>
                    {storage?.split(',')?.map((place: string) => (
                        <Menu.Item
                            key={place}
                            component={Link}
                            href={placePath(place)}
                            leftSection={
                                <Image
                                    alt="Place avatar"
                                    width="18"
                                    height="18"
                                    // eslint-disable-next-line max-len
                                    src={`https://api.dicebear.com/9.x/icons/svg?seed=${encodeURIComponent(place)}&radius=50&backgroundColor=F9A88B,F78B64,F56D3B,E9470C,AF3509`}
                                />
                            }
                        >
                            {place}
                        </Menu.Item>
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
                                href={getShareUrl(name)}
                                component="a"
                                leftSection={<IconBrandX size={16} />}
                            >
                                {t('places.sharePlace')}
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Label>{t('places.settings')}</Menu.Label>
                            <Menu.Item
                                onClick={toggleConfetti}
                                leftSection={
                                    confettiEnabled ? (
                                        <IconConfettiOff size={16} />
                                    ) : (
                                        <IconConfetti size={16} />
                                    )
                                }
                                color={confettiEnabled ? 'gray' : 'green'}
                            >
                                {confettiEnabled
                                    ? t('places.confettiDisabled')
                                    : t('places.confettiEnabled')}
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

            <ForkPlace name={name as string} open={opened} onClose={setOpened} />
        </>
    );
};

export default Places;
