import { IconHeadphones } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import classes from './HeroPreview.module.css';

const TASKS = [
    { key: 'task1', done: true },
    { key: 'task2', done: true },
    { key: 'task3', done: false },
    { key: 'task4', done: false }
] as const;

/** Static, decorative mock of a place page shown next to the home hero. */
const HeroPreview = () => {
    const t = useTranslations();

    return (
        <div aria-hidden="true" className={classes.preview}>
            <div className={classes.top}>
                <span>{t('home.preview.date')}</span>
                <span className={classes.name}>
                    {t('home.preview.name')}&apos;s <span>place</span>
                </span>
            </div>

            <div className={classes.grid}>
                <div className={`${classes.card} ${classes.timerCard}`}>
                    <div className={classes.modes}>
                        <span>{t('pomodoro.pomodoro')}</span>
                        <span>{t('home.preview.short')}</span>
                        <span>{t('home.preview.long')}</span>
                    </div>
                    <div className={classes.ring}>
                        <div className={classes.time}>15:32</div>
                    </div>
                    <span className={classes.completed}>
                        <b>3</b> {t('pomodoro.completedToday')}
                    </span>
                </div>

                <div className={classes.card}>
                    <div className={classes.tasksHeader}>
                        <b>{t('todo.title')}</b>
                        <span className={classes.muted}>2/4</span>
                    </div>
                    <div className={classes.track}>
                        <span />
                    </div>
                    {TASKS.map(({ key, done }) => (
                        <div key={key} className={classes.task} data-done={done || undefined}>
                            {t(`home.preview.${key}`)}
                        </div>
                    ))}
                </div>
            </div>

            <div className={`${classes.card} ${classes.sounds}`}>
                <span className={classes.soundIcon}>
                    <IconHeadphones size={20} />
                </span>
                <div className={classes.soundInfo}>
                    {t('home.preview.sounds')}
                    <div className={classes.volume}>
                        <span />
                    </div>
                </div>
                <span className={classes.playing}>{t('home.preview.playing')}</span>
            </div>
        </div>
    );
};

export default HeroPreview;
