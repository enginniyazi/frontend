// src/context/AuthContext.tsx

"use client"; // Context ve Hook'lar istemci tarafında çalışır.

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import type { User } from "@/types/user.types";

// Login fonksiyonunun API'den alacağı veri tipi
type AuthResponse = {
  user: User;
  token: string;
};

// Context'te saklayacağımız ve dışarıya açacağımız verilerin ve fonksiyonların tipi
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

// Context'i oluşturuyoruz
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider bileşeni: Bu, uygulamamızı sarmalayacak.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Başlangıçta auth durumu kontrol ediliyor

  // Uygulama ilk yüklendiğinde, tarayıcı deposunda token var mı diye kontrol et.
  useEffect(() => {
    // Bu kodun sadece tarayıcıda çalıştığından emin ol
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("yowa_token");
        const userDataString = localStorage.getItem("yowa_user");

        if (token && userDataString) {
          const userData: User = JSON.parse(userDataString);
          setIsAuthenticated(true);
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to parse auth data from localStorage", error);
        // Hata durumunda depoyu temizle
        localStorage.removeItem("yowa_token");
        localStorage.removeItem("yowa_user");
      } finally {
        setLoading(false); // Kontrol bitti, yükleme durumu sona erdi
      }
    } else {
      setLoading(false); // Sunucu tarafında render ediliyorsa, yüklemeyi bitir
    }
  }, []); // Boş dizi, bu efektin sadece bileşen ilk yüklendiğinde çalışmasını sağlar.

  const login = (data: AuthResponse) => {
    // Karmaşık 'destructuring' yerine, ihtiyacımız olanları doğrudan alıyoruz.
    const token = data.token;

    const userToStore: User = data.user;

    localStorage.setItem("yowa_token", token);
    localStorage.setItem("yowa_user", JSON.stringify(userToStore));
    setIsAuthenticated(true);
    setUser(userToStore);
  };

  const logout = () => {
    localStorage.removeItem("yowa_token");
    localStorage.removeItem("yowa_user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = { isAuthenticated, user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Özel Hook: Bu, diğer bileşenlerde context'e daha temiz bir şekilde erişmemizi sağlar.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
