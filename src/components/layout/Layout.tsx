import { useRouter } from 'next/router';

import BuyMeACoffeeWidget from '../BuyMeACoffeeWidget';
import Footer from './Footer';
import classes from './Layout.module.css';
import NavBar from './NavBar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { pathname } = useRouter();
    const isPlace = pathname === '/[name]';
    const isHome = pathname === '/';
    const variant = isPlace ? 'place' : isHome ? 'home' : undefined;

    return (
        <div className={classes.layout}>
            <NavBar />
            <main className={classes.main} data-variant={variant}>
                {children}
            </main>
            <BuyMeACoffeeWidget />
            <Footer variant={isPlace ? 'minimal' : 'full'} showPlaces={isHome} />
        </div>
    );
};

export default Layout;
