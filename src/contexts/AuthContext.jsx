import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  updateProfile,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { useContext } from "react";
import axiosInstance from "../hooks/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const firebaseErrors = [
    { code: "auth/invalid-email", message: "Invalid email address format." },
    {
      code: "auth/user-disabled",
      message: "This account has been disabled. Please contact support.",
    },
    {
      code: "auth/user-not-found",
      message: "No account found with this email.",
    },
    {
      code: "auth/wrong-password",
      message: "Incorrect password. Try again or reset it.",
    },
    {
      code: "auth/email-already-in-use",
      message: "This email is already registered. Try logging in instead.",
    },
    {
      code: "auth/weak-password",
      message: "Password should be at least 6 characters.",
    },
    { code: "auth/missing-password", message: "Please enter a password." },
    {
      code: "auth/invalid-credential",
      message: "Invalid credentials. Please try again.",
    },
    {
      code: "auth/popup-closed-by-user",
      message: "Popup closed before completing the sign-in.",
    },
    {
      code: "auth/cancelled-popup-request",
      message: "Another popup is already open. Please close it first.",
    },
    {
      code: "auth/network-request-failed",
      message: "Network error. Please check your internet connection.",
    },
    {
      code: "auth/too-many-requests",
      message: "Too many attempts. Please try again later.",
    },
  ];

  const [user, setUser] = useState({});
  const [role, setRole] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  const signInUsingEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInUsingGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const registerUsingEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  const logOut = () => {
    signOut(auth);
    setUser({});
  };

  const addUserToDB = (userData) => {
    axiosInstance
      .post("/users", userData)
      .then((data) => {
        console.log("User added to DB:", data);
      })
      .catch((err) => {
        console.error("Error adding user to DB:", err);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        try {
          const response = await axiosInstance.get(
            `users/role/${currentUser.email}`
          );
          setRole(response.data.role); // store role in state
        } catch (error) {
          console.error("Failed to fetch role:", error);
          setRole("");
        }
      } else {
        setRole("");
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authData = {
    user,
    setUser,
    signInUsingEmail,
    signInUsingGoogle,
    registerUsingEmail,
    updateUserProfile,
    logOut,
    role,
    addUserToDB,
    firebaseErrors,
    loading: authLoading,
  };
  return <AuthContext value={authData}>{children}</AuthContext>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
