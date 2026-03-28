import { useContext } from "react";
import { AuthContext } from "./AuthContext"; // ✅ gunakan context, bukan provider

export const useAuth = () => useContext(AuthContext);
