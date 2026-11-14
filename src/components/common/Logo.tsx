import { Box } from '@mantine/core';
import Image from 'next/image';

type LogoProps = {
    size?: number;
    /** Use the dark-scheme logo in both color schemes (for surfaces that are always dark). */
    onDark?: boolean;
};

// Both files are rendered and toggled with CSS, so the logo is right before hydration
const Logo = ({ size = 32, onDark = false }: LogoProps) => (
    <>
        {!onDark && (
            <Box component="span" lh={0} darkHidden>
                <Image alt="" src="/logo-light.svg" width={size} height={size} />
            </Box>
        )}
        <Box component="span" lh={0} lightHidden={!onDark}>
            <Image alt="" src="/logo-dark.svg" width={size} height={size} />
        </Box>
    </>
);

export default Logo;
