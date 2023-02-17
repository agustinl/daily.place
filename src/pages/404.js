
import { IconUfo } from "@tabler/icons";
import GoBack from "@/components/layout/GoBack";

const Custom404 = () => {
	return (
		<div>
            <GoBack />
			<IconUfo color="gray" size={18} />
			<h1>404 - Page Not Found</h1>
		</div>
	);
};

export default Custom404;
