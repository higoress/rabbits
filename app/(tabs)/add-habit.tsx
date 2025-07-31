import { database, DATABASE_ID, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"];

type Frequency = (typeof FREQUENCIES)[number];

export default function AddRabbitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [error, setError] = useState<string>("");

  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async () => {
    if (!user) {
      return;
    }
    try {
      console.log(DATABASE_ID);
      console.log("collectionId");
      console.log(HABITS_COLLECTION_ID);
      await database.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title,
          description,
          frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );

      setError("");
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
      setError("There was an error creating the rabbit");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.addBox}>
        <TextInput
          style={styles.input}
          onChangeText={setTitle}
          label="Title"
          mode="outlined"
        />
        <TextInput
          style={styles.input}
          onChangeText={setDescription}
          label="Description"
          mode="outlined"
        />
        <View style={styles.frequencyContainer}>
          <SegmentedButtons
            value={frequency}
            onValueChange={(value) => setFrequency(value as Frequency)}
            buttons={FREQUENCIES.map((freq) => ({
              value: freq,
              label: freq.charAt(0).toUpperCase() + freq.slice(1),
            }))}
          />
        </View>
        <Button
          mode="contained"
          disabled={!title || !description}
          onPress={handleSubmit}
        >
          Add New Rabbit
        </Button>
        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addBox: {
    maxWidth: 400,
    width: "90%",
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
  },
  input: {
    marginBottom: 16,
  },
  frequencyContainer: {
    marginBottom: 24,
  },
});
