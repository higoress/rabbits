import { database, DATABASE_ID, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { IconButton, Text } from "react-native-paper";

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>();

  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchHabits();
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      console.log(response.documents);
      setHabits(response.documents as unknown as Habit[]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Today's Rabbits
        </Text>
        <IconButton onPress={signOut} icon={"logout"} iconColor="#6200ee" />
      </View>
      {habits?.length === 0 ? (
        <View>
          <Text>No habits yet. Add your first habit.</Text>
        </View>
      ) : (
        habits?.map((habit, key) => {
          return (
            <View key={key}>
              <View style={styles.cardContainer}>
                <Text>{habit.title}</Text>
                <Text>{habit.description}</Text>
                <View>
                  <View>
                    <MaterialCommunityIcons
                      name="fire"
                      size={24}
                      color={"#ff9800"}
                    />
                    <Text>{habit.streak_count} day streak</Text>
                  </View>
                  <View>
                    <Text>
                      {habit.frequency.charAt(0).toUpperCase() +
                        habit.frequency.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    marginTop: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 28,
  },
  cardContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    margin: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
});
