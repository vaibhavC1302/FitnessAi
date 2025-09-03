import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import GoogleSignIn from "../../components/GoogleSignIn";

export default function SingIn() {
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;
    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 px-6">
        {/* header section */}
        <View className="flex-1 justify-center">
          {/* logo branding */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-2xl items-center justify-center ">
              <Ionicons name="fitness" size={40} color={"white"} />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              FitTracker
            </Text>
            <Text className="text-lg text-gray-600 text-center">
              Track your fitness journey{"\n"}and reach your goals.
            </Text>
          </View>

          {/* signin form */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Welcome Back
            </Text>

            {/* email input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700">Email</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 mt-1 border border-gray-200">
                <Ionicons name="mail-outline" size={20} color={"#6b7280"} />
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor={"#9ca3af"}
                  onChangeText={setEmailAddress}
                  editable={!isLoading}
                  className="flex-1 ml-3 text-gray-900 h-10"
                />
              </View>
            </View>

            {/* password input */}
            <View className="mb-2">
              <Text className="text-sm font-medium text-gray-700">
                Password
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 mt-1  border border-gray-200">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={"#6b7280"}
                />
                <TextInput
                  autoCapitalize="none"
                  value={password}
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  placeholderTextColor={"#9ca3af"}
                  onChangeText={setPassword}
                  editable={!isLoading}
                  className="flex-1 ml-3 text-gray-900"
                />
              </View>
            </View>
          </View>

          {/* sing in button */}
          <TouchableOpacity
            onPress={onSignInPress}
            disabled={isLoading}
            className={`rounded-xl py-4 shadow-sm
                ${isLoading ? "bg-gray-400" : "bg-blue-600"}
                `}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              {isLoading ? (
                <Ionicons name="refresh" size={20} color={"white"} />
              ) : (
                <Ionicons name="log-in-outline" size={20} color={"white"} />
              )}
              <Text className="text-white font-semibold text-lg ml-2">
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="px-4 text-gray-500 text-sm">or</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* google signin button */}
          {/* to be implemented */}
          <GoogleSignIn />

          {/* signup link  */}
          <View className="flex-row justify-center items-center mb-1">
            <Text className="text-gray-600">Don't have an account?</Text>
            <Link href={"/sign-up"} asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* footer section */}
        <View className="pb-6">
          <Text className="text-center text-gray-500 text-sm">
            Start your fitness journey today
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
