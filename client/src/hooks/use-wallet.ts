import { useState, useEffect, useCallback } from "react";

export function useWallet() {
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cv_mock_wallet");
    if (saved) {
      setWallet(saved);
    }
  }, []);

  const connect = useCallback(() => {
    const randomHex = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
    const newWallet = `cv_${randomHex}`;
    localStorage.setItem("cv_mock_wallet", newWallet);
    setWallet(newWallet);
    return newWallet;
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem("cv_mock_wallet");
    setWallet(null);
  }, []);

  return { wallet, connect, disconnect };
}
