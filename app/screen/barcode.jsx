import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import axios from "axios";
import { getToken } from "../../constants/token";

const Barcode = () => {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false); // State to handle the loader

  const handleSubmit = async () => {
    if (barcode === "") {
      Alert.alert("Please write barcode for analysis");
      return;
    }

    try {
      setLoading(true); // Start the loader when submitting

      const token = await getToken("accessToken");

      const response = await axios.post(
        // "http://10.0.2.2:3000/api/v1/products/analysis",
        "http://192.168.181.137:3000/api/v1/products/analysis",
        {
          barcode,
          token,
        }
      );

      if (response.status === 200) {
        setLoading(false); // Stop the loader after success
        console.log("Analysis Successfully");
        router.replace("screen/analysis"); // Redirect to analysis page
      }
    } catch (error) {
      setLoading(false); // Stop the loader on error
      if (error.response.status === 404) {
        Alert.alert("Barcode not found");
        setBarcode("");
      } else {
        console.log(error);
        Alert.alert("Something went wrong");
        setBarcode("");
      }
    }
  };

  return (
    <ImageBackground source={images.background}>
      <SafeAreaView className="h-full">
        <ScrollView>
          <View className="w-full h-full px-6 mt-[60px]">
            <Text className="text-[35px] font-bold ml-[40px] text-gray-600">
              Barcode Reader
            </Text>
            <Text className="font-regular text-[18px] mt-[40px] text-gray-400">
              Easily write barcodes number with our intuitive input! Instantly
              access nutritional information, including ingredients and calorie
              counts, empowering informed dietary choices and making healthier
              eating simple and convenient.
            </Text>
            <FormField
              title="Barcode"
              value={barcode}
              handleChangeText={(e) => setBarcode(e)}
              otherStyles="mt-[50px]"
              placeholder="Barcode No."
              name="barcode"
            />
            {/* If loading is true, show the loader */}
            {loading ? (
              <View style={{ marginTop: 20, alignItems: "center" }}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={{ marginTop: 10 }}>Analyzing...</Text>
              </View>
            ) : (
              <CustomButton
                title="Submit"
                handlePress={handleSubmit}
                containerStyles="ml-[68px] w-[200px] mt-9"
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Barcode;
