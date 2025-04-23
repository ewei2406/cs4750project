import { API_ENDPOINT_BASE } from "@/util/constants";
import { useCallback, useEffect, useState } from "react";
import { authStore, useAuth } from "./useAuth";
import { useQuery } from "@tanstack/react-query";
import { AResult } from "@/util/types";

export type RequestErr = {
	error: string;
	statusCode: number;
	detail?: string;
};

type GetResult<T> =
	| {
			variant: "loading";
	  }
	| {
			variant: "error";
			error: RequestErr;
	  }
	| {
			variant: "ok";
			value: T;
	  };

export const fetchWithResult = async <T>(
	path: string,
	init?: RequestInit
): AResult<T, RequestErr> => {
	const user = authStore.getUser();
	const authHeaders: Record<string, string> = {};
	if (user.type === "user") {
		authHeaders["X-Username"] = user.username;
		authHeaders["X-Password"] = user.password;
	}

	const response = await fetch(API_ENDPOINT_BASE + path, {
		...init,
		headers: {
			...authHeaders,
			...init?.headers,
		},
	});

	if (!response.ok) {
		let errorDetail: string | undefined;
		try {
			errorDetail = (await response.json()).detail;
		} catch {
			errorDetail = "Unknown error";
		}
		return {
			variant: "error",
			error: {
				statusCode: response.status,
				detail: errorDetail,
				error: response.statusText,
			},
		};
	}

	const data = await response.json();
	return {
		variant: "ok",
		value: data,
	};
};

const useAuthFetch = () => {
	const user = useAuth();
	const authFetch = useCallback(
		async (path: string, init?: RequestInit): AResult<any, RequestErr> => {
			return await fetchWithResult(path, init);
		},
		[user]
	);
	return { authFetch };
};

export const useGet = <T>({
	path,
	queryKey,
	staleTime,
	disabled,
}: {
	path: string;
	queryKey: string[];
	staleTime?: number;
	disabled?: boolean;
}) => {
	const [dataResult, setDataResult] = useState<GetResult<T>>({
		variant: "loading",
	});
	const { authFetch } = useAuthFetch();
	const { data, status, error, refetch } = useQuery<T, RequestErr>({
		enabled: !disabled,
		queryKey,
		queryFn: async () => {
			const result = await authFetch(path);
			if (result.variant === "ok") {
				return result.value as T;
			}
			throw result.error;
		},
		staleTime: staleTime ?? 0,
	});

	useEffect(() => {
		if (status === "pending") {
			setDataResult({
				variant: "loading",
			});
		}
		if (status === "error") {
			setDataResult({
				variant: "error",
				error,
			});
		}
		if (status === "success") {
			setDataResult({
				variant: "ok",
				value: data,
			});
		}
	}, [status, data, error]);

	return { dataResult, refresh: refetch };
};
