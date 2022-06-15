import React, { createContext, useContext, useEffect, useState } from 'react';
import firebase from './firebase';

const authContext = createContext({
	user: null,
	signinWithGithub: null,
	signout: null,
});

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
	return useContext(authContext);
};

const useProvideAuth = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const handleUser = (rawUser: firebase.User | false) => {
		if (rawUser) {
			const user = formatUser(rawUser);

			setLoading(false);
			setUser(user);
			return user;
		} else {
			setLoading(false);
			setUser(false);
			return false;
		}
	};

	const signinWithGithub = () => {
		setLoading(true);
		return firebase
			.auth()
			.signInWithPopup(new firebase.auth.GithubAuthProvider())
			.then((response) => handleUser(response.user));
	};

	const signout = () => {
		return firebase
			.auth()
			.signOut()
			.then(() => handleUser(false));
	};

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged(handleUser);
		return () => unsubscribe();
	}, []);

	return {
		user,
		loading,
		signinWithGithub,
		signout,
	};
};

const formatUser = (user: firebase.User) => {
	return {
		uid: user.uid,
		email: user.email,
		name: user.displayName,
		provider: user.providerData[0].providerId,
		photoUrl: user.photoURL,
	};
};
