import { Flex } from "@mantine/core";

import Footer from "./Footer";
import NavBar from "./NavBar";

const Layout = ({ children }) => {
	return (
		<Flex
			direction="column"
			align="flex-start"
			justify="space-between"
			m="auto"
			mih="100%"
			maw={960}
			py={40}
			px={20}
			gap={20}
		>
			<NavBar />
			{children}
			<Footer />
		</Flex>
	);
};

export default Layout;
