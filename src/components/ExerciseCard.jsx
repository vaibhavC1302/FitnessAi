import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { urlFor } from "../lib/sanity/client";
import { Ionicons } from "@expo/vector-icons";
import { getDifficultyColor, getDifficultyText } from "../utils/difficulty.js";

const ExerciseCard = ({ item, onPress, showChevron = false }) => {
  console.log("exercise card item :::", item);

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100"
      onPress={onPress}
    >
      <View className="flex-row p-6">
        <View className="w-20 h-20 bg-white rounded-xl mr-4 overflow-hidden">
          {item?.image?.asset?._ref ? (
            <Image
              source={{ uri: urlFor(item?.image?.asset?._ref).url() }}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <View className="w-full h-full bg-gray-500 items-center justify-center">
              <Ionicons name="barbell-outline" size={24} color={"white"} />
            </View>
          )}
        </View>

        <View className="flex-1 justify-between">
          <View>
            <Text
              className="text-lg font-bold text-gray-600 mb-2"
              numberOfLines={2}
            >
              {item?.name}
            </Text>
            <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
              {item?.description || "No description available"}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View
              className={`px-3 py-1 rounded-full ${getDifficultyColor(item?.difficulty)} `}
            >
              <Text className="text-xs font-semibold text-white ">
                {getDifficultyText(item?.difficulty)}
              </Text>
            </View>

            {showChevron && (
              <TouchableOpacity className="p-2">
                <Ionicons name="chevron-fordward" size={20} color={"#6b7280"} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExerciseCard;
