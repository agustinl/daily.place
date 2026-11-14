const PROJECT_ID = '6a0ab10df6a57f';
const SCRIPT_URL = `https://feedback.fish/ff.js?pid=${PROJECT_ID}`;

// Once loaded, the widget script binds `[data-feedback-fish]` elements on a one-second interval
export const BIND_DELAY_MS = 1100;

let loading: Promise<void> | null = null;
let ready = false;

/** Whether the widget script is loaded and has bound the trigger elements. */
export const isFeedbackFishReady = () => ready;

/**
 * Loads the feedback widget script once. It also creates the widget iframe, so it is only
 * requested when someone shows interest in a feedback button, not on every page load.
 */
export const loadFeedbackFish = (): Promise<void> => {
    if (!loading) {
        loading = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = SCRIPT_URL;
            script.defer = true;
            script.addEventListener('load', () => {
                setTimeout(() => {
                    ready = true;
                    resolve();
                }, BIND_DELAY_MS);
            });
            // Blocked or offline: allow a later attempt
            script.addEventListener('error', () => {
                script.remove();
                loading = null;
                reject(new Error('Feedback widget failed to load'));
            });
            document.body.appendChild(script);
        });
    }
    return loading;
};

/** Test helper: forget the loaded state. */
export const resetFeedbackFish = () => {
    loading = null;
    ready = false;
};
