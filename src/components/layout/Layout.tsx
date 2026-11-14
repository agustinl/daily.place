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

    return (
        <div className={classes.layout}>
            <NavBar />
            <main className={classes.main} data-variant={isPlace ? 'place' : undefined}>
                {children}
            </main>
            <BuyMeACoffeeWidget />
            <Footer variant={isPlace ? 'minimal' : 'full'} showPlaces={pathname === '/'} />
        </div>
    );
};

export default Layout;
