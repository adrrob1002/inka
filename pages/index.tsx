import { useAuth } from '../lib/auth';
import { Text, Button, Flex } from '@chakra-ui/react';

export default function Index() {
	const auth = useAuth();

	return auth.user ? (
		<Flex flexDirection="column" maxWidth={800} alignItems="center" p={4}>
			<Text>Email: {auth.user.email}</Text>
			<Button onClick={(e) => auth.signout()} mt={4}>
				Sign Out
			</Button>
		</Flex>
	) : (
		<Button onClick={(e) => auth.signinWithGithub()}>Sign In</Button>
	);
}
