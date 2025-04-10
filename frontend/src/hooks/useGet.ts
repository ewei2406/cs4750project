import { API_ENDPOINT_BASE } from "@/util/constants"
import { useEffect, useState } from "react"

type GetResult<T> = {
    status: "loading"
} | {
    status: "error"
    detail: string
} | {
    status: "success"
    data: T
}

export const useGet = <T>({ path }: { path: string }) => {
    const [result, setResult] = useState<GetResult<T>>({
        status: "loading"
    })

    useEffect(() => {
        const fetchPuzzles = async () => {
            try {
                const response = await fetch(API_ENDPOINT_BASE + path);
                const data = await response.json();

                if (!response.ok) {
                    setResult({
                        status: "error",
                        detail: data?.detail ?? "An unknown error ocurred."
                    })
                    return
                }

                setResult({
                    status: "success",
                    data
                })
            } catch (error) {
                setResult({
                    status: "error",
                    detail: "An unknown error ocurred."
                })
            }
        };

        fetchPuzzles();
    }, []);   

    return { result }
}