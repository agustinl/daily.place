declare module '@vercel/og' {
    export class ImageResponse {
        constructor(content: React.ReactNode, options?: { width?: number; height?: number });
    }
}
