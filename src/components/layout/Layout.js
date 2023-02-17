import { Flex, Container } from "@mantine/core";

import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = ({ children }) => {
	return (
		<Container size="md" w="100%" h="100%" py="sm">
            <Flex
                direction="column"
                align="flex-start"
                justify="space-between"
                h="100%"
            >
                <NavBar />
                {children}
                <Footer />
            </Flex>
        </Container>
	);
};

export default Layout;
