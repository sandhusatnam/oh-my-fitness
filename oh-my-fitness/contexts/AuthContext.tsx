import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

let auth: any = null;
let firebaseAuth: any = null;

if (Platform.OS !== 'web') {
  try {
    auth = require('@react-native-firebase/auth').default;
    firebaseAuth = require('@react-native-firebase/auth');
  } catch (error) {
    console.warn('Firebase Auth not available on this platform');
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  hasCompletedSurvey: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  register: (name: string, email: string, password: string) => Promise<{ user: User; token: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    restoreSession();
    
    if (Platform.OS !== 'web' && auth) {
      const unsubscribe = auth().onAuthStateChanged(async (firebaseUser: any) => {
        if (firebaseUser) {
          try {
            const token = await firebaseUser.getIdToken();
            const userData = await AsyncStorage.getItem('user_data');
            
            if (userData) {
              const user = JSON.parse(userData);
              dispatch({ type: 'RESTORE_SESSION', payload: { user, token } });
            }
          } catch (error) {
            console.error('Error restoring Firebase session:', error);
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      });

      return unsubscribe;
    }
  }, []);

  const restoreSession = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        dispatch({ type: 'RESTORE_SESSION', payload: { user, token } });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error restoring session:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      let firebaseUser: any;
      let token: string;

      if (Platform.OS !== 'web' && auth) {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        firebaseUser = userCredential.user;
        token = await firebaseUser.getIdToken();
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        token = 'web_mock_token_' + Date.now();
      }
      
      const user: User = {
        id: firebaseUser?.uid || 'web_user_' + Date.now(),
        name: firebaseUser?.displayName || 'John Doe',
        email,
        hasCompletedSurvey: true, // Set to true to skip survey for existing users
      };
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      
      const authResult = { user, token };
      dispatch({ type: 'LOGIN_SUCCESS', payload: authResult });
      
      return authResult;
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Handle Firebase Auth errors
      let errorMessage = 'Login failed';
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later';
            break;
          default:
            errorMessage = error.message || 'Login failed';
        }
      }
      
      throw new Error(errorMessage);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      let firebaseUser: any;
      let token: string;

      if (Platform.OS !== 'web' && auth) {
        // Use Firebase Auth for native platforms
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        firebaseUser = userCredential.user;
        
        // Update display name
        await firebaseUser.updateProfile({
          displayName: name,
        });
        
        token = await firebaseUser.getIdToken();
      } else {
        // Fallback for web platform
        await new Promise(resolve => setTimeout(resolve, 2000));
        token = 'web_mock_token_' + Date.now();
      }
      
      // Create user object
      const user: User = {
        id: firebaseUser?.uid || 'web_user_' + Date.now(),
        name,
        email,
        hasCompletedSurvey: false, // New users need to complete survey
      };
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      
      const authResult = { user, token };
      dispatch({ type: 'LOGIN_SUCCESS', payload: authResult });
      
      return authResult;
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Handle Firebase Auth errors
      let errorMessage = 'Registration failed';
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'An account with this email already exists';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled';
            break;
          default:
            errorMessage = error.message || 'Registration failed';
        }
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase if available
      if (Platform.OS !== 'web' && auth) {
        await auth().signOut();
      }
      
      // Clear local storage
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    
    // Update AsyncStorage
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};