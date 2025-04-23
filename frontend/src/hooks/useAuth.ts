import { useSyncExternalStore } from "react";
import { fetchWithResult } from "./useGet";

export type User =
	| {
			type: "user";
			userId: number;
			username: string;
			password: string;
			isAdmin: boolean;
	  }
	| {
			type: "guest";
	  };

class AuthStore {
	user: User = {
		type: "guest",
	};
	listeners: Set<() => void> = new Set();

	constructor() {
		const storedUser = localStorage.getItem("authUser");
		if (storedUser) {
			try {
				this.user = JSON.parse(storedUser);
			} catch {
				localStorage.removeItem("authUser");
			}
		}

		this.subscribe(() => {
			if (this.user.type === "guest") {
				localStorage.removeItem("authUser");
			} else {
				localStorage.setItem("authUser", JSON.stringify(this.user));
			}
		});
	}

	subscribe = (callback: () => void) => {
		this.listeners.add(callback);
		return () => {
			this.listeners.delete(callback);
		};
	};

	notify = () => {
		this.listeners.forEach((callback) => callback());
	};

	login = async () => {
		const username = prompt("Username");
		if (username === null) return;
		const password = prompt("Password");
		if (password === null) return;

		if (!username || !password) {
			alert("Username and password are required!");
			return;
		}

		const result = await fetchWithResult<any>("users/me", {
			headers: {
				"X-Username": username,
				"X-Password": password,
			},
		});

		if (result.variant === "error") {
			alert("Login failed. Please check your credentials.");
			return;
		}

		const user: User = {
			type: "user",
			isAdmin: result.value.isAdmin,
			userId: result.value.userId,
			username: result.value.username,
			password,
		};
		this.user = user;
		this.notify();
		return;
	};

	signup = async () => {
		const username = prompt("Username");
		if (username === null) return;
		const password = prompt("Password");
		if (password === null) return;

		if (!username || !password) {
			alert("Username and password are required!");
			return;
		}

		const response = await fetchWithResult<any>("users/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
			}),
		});

		if (response.variant === "error") {
			alert("Sign up failed: " + response.error.detail);
			return;
		}

		const user: User = {
			type: "user",
			isAdmin: response.value.isAdmin,
			userId: response.value.userId,
			username: response.value.username,
			password,
		};
		this.user = user;
		this.notify();
		return;
	};

	logout = () => {
		this.user = { type: "guest" };
		this.notify();
	};

	getUser = () => {
		return this.user;
	};
}

export const authStore = new AuthStore();

export const useAuth = () => {
	const user = useSyncExternalStore(authStore.subscribe, authStore.getUser);

	return user;
};
