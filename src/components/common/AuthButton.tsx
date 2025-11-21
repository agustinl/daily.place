import { useEffect, useState } from 'react';
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { Menu, Text, Group } from '@mantine/core';
import { IconLogin2, IconLogout, IconMail } from '@tabler/icons-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Action from './Action';

const AuthButton = () => {
    const { isSignedIn, user } = useUser();
    const t = useTranslations();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration problems with SSR
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    if (!isSignedIn) {
        return (
            <SignInButton mode="modal">
                <Action aria-label="Sign in" variant="light" color="orange">
                    <IconLogin2 size={18} />
                </Action>
            </SignInButton>
        );
    }

    return (
        <Menu shadow="md" width={200} withArrow trigger="hover">
            <Menu.Target>
                <Action aria-label="User menu">
                    <Image
                        alt={user.fullName || user.emailAddresses[0]?.emailAddress || 'User'}
                        width="24"
                        height="24"
                        src={`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${user.imageUrl}&radius=50&backgroundColor=EAEAEA`}
                    />
                </Action>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>
                    <Group gap={5}>
                        <IconMail size={16} />
                        <Text size="xs" truncate>
                            {user.emailAddresses[0]?.emailAddress}
                        </Text>
                    </Group>
                </Menu.Label>
                <Menu.Divider />
                <Menu.Item leftSection={<IconLogout size={16} />} color="red">
                    <SignOutButton>
                        <span>{t('auth.signOut')}</span>
                    </SignOutButton>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default AuthButton;
