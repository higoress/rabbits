import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";


export default function AuthScreen() {
    const [isSignUp, setIsSignUp] = useState<boolean>(true);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>("");

    const theme = useTheme();
    const router = useRouter();

    const { signIn, signUp } = useAuth();

    const handleAuth = async () => {
        if (!email || !password) {
            setError("Preencha todos os campos.");
            return;
        }

        if (password.length < 8) {
            setError("Senha deve possuir ao menos 8 caracteres.");
            return;
        }

        setError(null);

        if(isSignUp){
            const error = await signUp(email, password);
            if(error){
                setError(error);
                return;
            }
        }
        else {
            const error = await signIn(email, password);
            if(error){
                setError(error);
                return;
            }
            router.replace("/");
        }

        return;
        
    }


    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
    };

    return (
        <View style={styles.container}>
            <View style={styles.loginBox}>
                <Text style={styles.title} variant="headlineMedium">
                    {isSignUp ? "Crie sua conta" : "Bem-vindo"}
                </Text>
                <TextInput
                    label="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="example@email.com"
                    mode="outlined"
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    label="Senha"
                    autoCapitalize="none"
                    mode="outlined"
                    secureTextEntry
                    onChangeText={setPassword}
                    style={styles.input}
                />

                {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

                <Button mode="contained" style={styles.button} onPress={handleAuth}>
                    {isSignUp ? "Cadastre-se" : "Login"}
                </Button>

                <Button mode="text" onPress={handleSwitchMode} style={styles.switchModeButton}>
                    {isSignUp ? "Já tem uma conta? Faça Login" : "Não tem uma conta? Cadastre-se"}
                </Button>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
        justifyContent: "center",
        alignItems: "center"
    },
    loginBox: {
        maxWidth: 400,
        width: "90%",
        backgroundColor: "white",
        padding: 24,
        borderRadius: 12,
        elevation: 4, // shadow on Android
        shadowColor: '#000', // shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    title: {
        textAlign: "center",
        marginBottom: 24,
    },
    input: {
        marginBottom: 8,
    },
    button: {
        marginTop: 8,
    },
    switchModeButton: {
        marginTop: 16,
    },
});