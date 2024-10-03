import { Image, View, Text, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";

export default function App() {
  return (
    <SafeAreaView className="h-full">
      <ImageBackground source={images.background}>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full items-center min-h-[85vh] px-4">
            <Image
              source={images.logo}
              className="w-[130px] h-[90px] mb-5"
              resizeMode="contain"
            />
            <Image
              source={images.img}
              className="max-w-[400px] w-full h-[330px]"
            />

            <View className="relative mt-5">
              <Text className="text-3xl text-black font-bold text-center">
                Eat Healthy
              </Text>
            </View>
            <Text className="text-lg font-pregular text-gray-500 mt-7 text-center">
            Maintain good health should
            be the primary focus of everyone.
            </Text>

            <CustomButton
              title="Get Started"
              handlePress={() => router.push("/sign-up")}
              containerStyles="w-full mt-7"
            />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </ImageBackground>
    </SafeAreaView>
  );
}
