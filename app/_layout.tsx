import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";

function RouteGuard ({ children } : {children: React.ReactNode}) {
  const router = useRouter();
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments();


  useEffect( () => {
    const inAuthGroup = segments[0] === "auth"

    if(!user && !inAuthGroup && !isLoadingUser){
      router.replace("/auth");
    } else if (user && inAuthGroup && !isLoadingUser){
      router.replace("/");
    }
  }, [user, segments]); //wait for isReady to be true, to trigger the effect

  return <>{children}</>;
}



export default function RootLayout() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
