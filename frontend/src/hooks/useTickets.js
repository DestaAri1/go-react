import { useEffect, useState } from "react"
import { getAllTickets } from "../services/tikcetService";

export default function useTicket() {
    const [ dataTicket, setTicket] = useState(null)

    useEffect(() => {
        getAllTickets()
        .then((r) => setTicket(r.data.data))
        .catch((error) => console.error("Failed to fetch user data:", error));
    }, [])
  return dataTicket
}
