import { useEffect } from "react";

export default function useOnce(callback) {
  useEffect(callback, []);
}
