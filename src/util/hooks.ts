import { useLocalStorage } from "usehooks-ts";

export const useLevel = () => useLocalStorage("level", 0)
export const useFails = () => useLocalStorage("fails", 0)