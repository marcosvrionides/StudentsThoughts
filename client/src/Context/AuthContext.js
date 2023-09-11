import React, { Component, useState, useEffect } from 'react';
import { useContext, createContext } from "react";
import {
    createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword,
    GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged, sendEmailVerification
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState({});

    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signUp = (email, password, fullName) => {
        createUser(email, password).then(
            (userCred) => {
                updateProfile(userCred.user, { displayName: fullName });
                sendEmailVerification(userCred.user);
            }
        );
    }

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    }

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () => {
        signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            try {
                if (user.emailVerified) {
                    fetch("/setUser", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            user
                        })
                    })
                }
            } catch (error) {
                console.log("logged out")
            }
        })
        return () => {
            unsubscribe();
        }
    });

    return (

        <AuthContext.Provider value={{ signUp, signIn, googleSignIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}