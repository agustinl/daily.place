import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Kbd, Modal } from '@mantine/core';
import { IconKeyboard } from '@tabler/icons-react';

import Action from '../common/Action';
import classes from './Shortcuts.module.css';

const SHORTCUTS = [
    { keys: ['Ctrl/⌘', 'P'], description: 'shortcuts.playPause' },
    { keys: ['Ctrl/⌘', 'Alt', '1'], description: 'shortcuts.changePomodoro' },
    { keys: ['Ctrl/⌘', 'Alt', '2'], description: 'shortcuts.changeShort' },
    { keys: ['Ctrl/⌘', 'Alt', '3'], description: 'shortcuts.changeLong' },
    { keys: ['Ctrl/⌘', 'J'], description: 'shortcuts.toggleTheme' }
] as const;

const Shortcuts = () => {
    const [opened, setOpened] = useState(false);
    const t = useTranslations();

    return (
        <>
            <Action aria-label={t('shortcuts.title')} onClick={() => setOpened(true)} size={40}>
                <IconKeyboard size={18} />
            </Action>

            <Modal opened={opened} onClose={() => setOpened(false)} title={t('shortcuts.title')}>
                <dl className={classes.list}>
                    {SHORTCUTS.map(({ keys, description }) => (
                        <div key={description} className={classes.row}>
                            <dt className={classes.description}>{t(description)}</dt>
                            <dd className={classes.keys}>
                                {keys.map((key, index) => (
                                    <span key={key} className={classes.key}>
                                        {index > 0 && (
                                            <span aria-hidden="true" className={classes.plus}>
                                                +
                                            </span>
                                        )}
                                        <Kbd>{key}</Kbd>
                                    </span>
                                ))}
                            </dd>
                        </div>
                    ))}
                </dl>
            </Modal>
        </>
    );
};

export default Shortcuts;
