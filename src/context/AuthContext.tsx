// src/context/AuthContext.tsx
import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isCoffeeMaker: boolean;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Check if user has additional profile info
        const userData: User = {
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          isCoffeeMaker: false, // Default role
        };
        
        try {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          
          if (userDoc.exists()) {
            const dbData = userDoc.data();
            userData.isCoffeeMaker = dbData.isCoffeeMaker || false;
            userData.name = dbData.name || authUser.displayName;
          } else {
            // Create a new user document if it doesn't exist
            await setDoc(doc(db, 'users', authUser.uid), {
              email: authUser.email,
              name: authUser.displayName,
              isCoffeeMaker: false,
              createdAt: serverTimestamp()
            });
          }
          
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Route protection middleware for App Router
export function withAuth<P extends object>(
    Component: React.ComponentType<P>
  ): React.FC<P> {
    return function WithAuth(props: P) {
      const { user, loading } = useAuth();
      const router = useRouter();
  
      useEffect(() => {
        if (!loading && !user) {
          router.push("/login");
        }
      }, [loading, user, router]);
  
      if (loading) {
        return <div>Loading...</div>;
      }
  
      if (!user) {
        return null;
      }
  
      return <Component {...props} />;
    };
  }
  
  // Middleware for coffee maker role
  export function withCoffeeMakerRole<P extends object>(
    Component: React.ComponentType<P>
  ): React.FC<P> {
    return function WithCoffeeMakerRole(props: P) {
      const { user, loading } = useAuth();
      const router = useRouter();
  
      useEffect(() => {
        if (!loading) {
          if (!user) {
            router.push("/login");
          } else if (!user.isCoffeeMaker) {
            router.push("/unauthorized");
          }
        }
      }, [loading, user, router]);
  
      if (loading) {
        return <div>Loading...</div>;
      }
  
      if (!user || !user.isCoffeeMaker) {
        return null;
      }
  
      return <Component {...props} />;
    };
  }
  