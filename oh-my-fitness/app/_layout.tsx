import { useEffect } from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { AuthProvider } from '@/contexts/AuthContext';
import { SurveyProvider } from '@/contexts/SurveyContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import CustomToast from '@/components/common/CustomToast';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  useFrameworkReady();

  return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SurveyProvider>    
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="survey" />
              <Stack.Screen name="loading" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
            <Toast
              config={{
                error: (props) => <CustomToast {...props} type="error" text1={props.text1 ?? ''} text2={props.text2 ?? ''} />,
                success: (props) => <CustomToast {...props} type="success" text1={props.text1 ?? ''} text2={props.text2 ?? ''} />,
                info: (props) => <CustomToast {...props} type="info" text1={props.text1 ?? ''} text2={props.text2 ?? ''} />,
              }}
            />
          </SurveyProvider>
        </AuthProvider>
      </QueryClientProvider>
  );
}