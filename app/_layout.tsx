import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DefaultTheme, PaperProvider } from "react-native-paper";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/auth");
    } else if (user && inAuthGroup && !isLoadingUser) {
      router.replace("/");
    }
  }, [user, segments]); //wait for isReady to be true, to trigger the effect

  return <>{children}</>;
}

export default function RootLayout() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: "black", // force black text
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <RouteGuard>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </RouteGuard>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
