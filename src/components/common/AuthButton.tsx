import { forwardRef, useEffect, useState } from 'react';
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { Button, ButtonProps, Menu, Text, Group } from '@mantine/core';
import { IconLogout, IconMail } from '@tabler/icons-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Action from './Action';

const SignInTrigger = forwardRef<
    HTMLButtonElement,
    ButtonProps & { component?: unknown; onClick?: () => void; children: React.ReactNode }
>(({ component: _component, ...props }, ref) => <Button ref={ref} {...props} />);
SignInTrigger.displayName = 'SignInTrigger';

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
                {/* Clerk adds a `component` prop to its child; Mantine would render it as the tag */}
                <SignInTrigger
                    h={44}
                    px={18}
                    fz={14}
                    fw={500}
                    vars={() => ({
                        root: {
                            '--button-bg': 'var(--dp-inverse)',
                            '--button-hover': 'var(--dp-inverse)',
                            '--button-color': 'var(--dp-inverse-text)'
                        }
                    })}
                >
                    {t('auth.signIn')}
                </SignInTrigger>
            </SignInButton>
        );
    }

    return (
        <Menu shadow="md" width={200} withArrow trigger="hover">
            <Menu.Target>
                <Action aria-label={t('auth.userMenu')} size={44} radius="xl">
                    <Image
                        alt=""
                        width="40"
                        height="40"
                        src={`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${user.imageUrl}&radius=50&backgroundColor=F9A88B`}
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
