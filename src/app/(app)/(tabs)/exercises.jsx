import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { defineQuery } from "groq";
import { client } from "../../../lib/sanity/client.js";
import { useRouter } from "expo-router";
import ExerciseCard from "../../../components/ExerciseCard.jsx";
import { useEffect } from "react";

// query to fetch exercises
export const exerciseQuery = defineQuery(`*[_type == 'exercise']`);

const Exercises = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchExercises();
  }, []);

  // filter data use effect
  useEffect(() => {
    const filtered = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);

  const fetchExercises = async () => {
    console.log("fetching exercises --------------->");
    try {
      // fetch exercises
      const exercises = await client.fetch(exerciseQuery);
      console.log("exercises -------------->", exercises);

      setExercises(exercises);
      setFilteredExercises(exercises);
    } catch (error) {
      // show a toast--todo
      console.log("error fetching exercises:", error);
    }
  };

  const onRefresh = async () => {
    console.log("refreshing");
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* header */}
      <View className="px-6 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 ">
          Exercise Library
        </Text>
        <Text className="text-gray-600 mt-1">
          Discover and master new exercises
        </Text>

        {/* search bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mt-3 mb-2">
          <Ionicons name="search" size={20} color={"#6b7280"} />
          <TextInput
            className="flex-1 ml-3 text-gray-800"
            placeholder="Search exercises..."
            placeholderTextColor={"#9ca3af"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={"#6b7280"} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* exercises list */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => (
          <ExerciseCard
            item={item}
            onPress={() => router.push(`/exercise-detail?id=${item._id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]} //android
            tintColor={["#3b8f286"]} //ios
            title="Pull to refresh exercises" //ios
            titleColor={"#6b7280"} //ios
          />
        }
        ListEmptyComponent={
          <View className="bg-white rounded-2xl p-8 items-center">
            <Ionicons name="fitness-outline" size={64} color={"#9ca3af"} />
            <Text className="text-xl font-semibold text-gray-900 mt-4">
              {searchQuery ? "No exercise found" : "Loading exercises..."}
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              {searchQuery
                ? "Try adjusting your search"
                : "Your exercise will appear here "}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Exercises;
