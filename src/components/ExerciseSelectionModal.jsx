import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useWorkoutStore } from "../../store/workout-store";
import { Ionicons } from "@expo/vector-icons";
import ExerciseCard from "../components/ExerciseCard.jsx";
import { client } from "../lib/sanity/client.js";
import { exerciseQuery } from "../app/(app)/(tabs)/exercises.jsx";

const ExerciseSelectionModal = ({ visible, onClose }) => {
  const router = useRouter();
  const { addExerciseToWorkout } = useWorkoutStore();
  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchExercises();
    }
  }, [visible]);

  useEffect(() => {
    const filtered = exercises.filter((ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);

  const handleExercisePress = (exercise) => {
    addExerciseToWorkout({ name: exercise.name, sanityId: exercise._id });
    onClose();
  };

  const fetchExercises = async () => {
    console.log("fetching exercises");
    try {
      const exercises = await client.fetch(exerciseQuery);
      console.log("exercises data fetched", exercises);
      setExercises(exercises);
      setFilteredExercises(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* header */}
        <View className="bg-white px-4 pt-4 pb-6 shadow-sm border-b border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-800">
              Add Exercise
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="close" size={24} color={"#6b7280"} />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-600 mb-4">
            Tap any exercise to add it yo your workout
          </Text>

          {/* search bar  */}
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
            <Ionicons name="search" size={20} color={"#6b7280"} />
            <TextInput
              className="flex-1 ml-3 text-gray-800"
              placeholder="Search exercises..."
              placeholderTextColor="#9ca3af"
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

        {/* Exercise list */}
        <FlatList
          data={filteredExercises}
          renderItem={({ item }) => {
            return (
              <ExerciseCard
                item={item}
                onPress={() => handleExercisePress(item)}
                showChevron={false}
              />
            );
          }}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 32,
            paddingHorizontal: 16,
          }}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              color={"#3b82f6"}
              tintColor={"#3b82f6"}
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="fitness-outline" size={64} color={"#d1d5db"} />
              <Text className="text-lg font-semibold text-gray-400 mt-4">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Please wait a moment"}
              </Text>
            </View>
          }
        />
        {/* <Text>ashdlahsdl</Text> */}
        {/* <ExerciseCard
          item={exercises[0]}
          onPress={() => {}}
          showChevron={false}
        /> */}
      </View>
    </Modal>
  );
};

export default ExerciseSelectionModal;
