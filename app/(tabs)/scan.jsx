import { View, Text, ImageBackground, ScrollView, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

const Scan = () => {
  return (
    <ImageBackground source={images.background}>
      <SafeAreaView className="h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full h-full px-[20px] mt-4">
            <Text className="text-[35px] font-bold text-gray-600">
              Scan Your Meal
            </Text>
            <Text className="font-regular text-[18px] mt-5 text-gray-400">
              Easily scan your meal and get instant insights into its
              nutritional value. With just a quick snap, discover detailed
              information about the calories, ingredients, and nutrients in your
              food. Take control of your diet and make informed choices to lead
              a healthier lifestyle!
            </Text>
            <Image
              className="w-[150px] h-[150px] mt-[40px] ml-[90px]"
              source={images.scanFood}
              resizeMode="contain"
            />
            <CustomButton
              title="Scan Barcode"
              handlePress={() => router.push("/screen/barcode")}
              containerStyles="w-full mt-[30px]"
            />
            <CustomButton
              title="Upload Image"
              handlePress={() => router.push("/screen/upload")}
              containerStyles="w-full mt-[30px]"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Scan;
