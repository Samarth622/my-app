import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { getToken, deleteToken } from "../../constants/token.js";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    Age: "",
    bloodGroup: "",
    weight: "",
    height: "",
    gender: "",
    mobile: "",
    email: "",
    allergies: "",
    medicalHistory: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getToken("accessToken");
      if (token) {
        try {
          const response = await axios.get(
            "http://192.168.246.137:3000/api/v1/users/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProfileData(response.data.data.user);
          setFormData(response.data.data.user);
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Failed to fetch profile.",
          });
        }
      } else {
        Toast.show({
          type: "info",
          text1: "Unauthorized",
          text2: "No token found. Please sign in.",
        });
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    const token = await getToken("accessToken");
    try {
      const response = await axios.put(
        "http://192.168.246.137:3000/api/v1/users/editProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileData(response.data.data.updatedUser);
      setIsEditable(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update profile.",
      });
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleLogout = async () => {
    await deleteToken("accessToken");
    Toast.show({
      type: "success",
      text1: "Logout",
      text2: "You have logged out successfully!",
    });
    setInterval(() => {
      router.replace("auth/sign-in");
    }, 900)
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>My Profile</Text>

        {profileData && (
          <>
            {[
              { icon: "person", placeholder: "Name", value: formData.name, key: "name" },
              { icon: "mail", placeholder: "Email", value: formData.email, key: "email" },
              { icon: "call", placeholder: "Phone number", value: formData.mobile, key: "mobile" },
              { icon: "calendar", placeholder: "Age", value: formData.Age, key: "Age" },
              { icon: "body", placeholder: "Weight (KG)", value: formData.weight, key: "weight" },
              { icon: "resize", placeholder: "Height (cm)", value: formData.height, key: "height" },
              { icon: "warning", placeholder: "Allergies", value: formData.allergies, key: "allergies" },
              { icon: "medkit", placeholder: "Medical History", value: formData.medicalHistory, key: "medicalHistory" },
              { icon: "water", placeholder: "Blood Group", value: formData.bloodGroup, key: "bloodGroup" },
            ].map(({ icon, placeholder, value, key }, index) => (
              <View key={index} style={styles.inputContainer}>
                <Ionicons name={icon} size={24} color="gray" />
                <TextInput
                  style={[styles.inputText, isEditable && styles.editableText]}
                  value={value}
                  onChangeText={(text) => handleInputChange(key, text)}
                  placeholder={placeholder}
                  placeholderTextColor="gray"
                  editable={isEditable}
                />
              </View>
            ))}
          </>
        )}

        <View style={styles.buttonContainer}>
          {!isEditable ? (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsEditable(true)}
              >
                <Text style={styles.buttonText}>Edit Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.button} onPress={updateProfile}>
              <Text style={styles.buttonText}>Save Account</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Toast />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  inputText: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  editableText: {
    borderColor: "#007BFF",
    color: "#000",
  },
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    backgroundColor: "#21bf73",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
