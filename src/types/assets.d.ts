// Audio files are bundled by webpack as asset URLs (see next.config.js)
declare module '*.mp3' {
    const src: string;
    export default src;
}
