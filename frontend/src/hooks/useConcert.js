import { useEffect, useState } from "react"
import { getAllConcert } from "../services/concertServices"

export default function useConcert() {
    const [ dataConcert, setConcert] = useState(null)

    useEffect(() => {
        getAllConcert()
        .then((r) => setConcert(r.data.data))
        .catch((error) => console.error("Failed to fetch user data:", error));
    }, [])
  return dataConcert
}
