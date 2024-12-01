import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { getToken } from "../../constants/token";
import { router } from "expo-router";
import Toast from 'react-native-toast-message';

const Upload = () => {
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Request Permissions for Camera and Media Library
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted) {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Camera access is required to take photos.',
      });
      return false;
    }

    if (!mediaLibraryPermission.granted) {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Media library access is required to select photos.',
      });
      return false;
    }

    return true;
  };

  // Open Camera
  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Set image URI to display preview
      Toast.show({
        type: 'success',
        text1: 'Photo Captured',
        text2: 'Your photo has been captured successfully.',
      });
    }
  };

  // Open Gallery
  const handleChooseFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Set image URI to display preview
      Toast.show({
        type: 'success',
        text1: 'Image Selected',
        text2: 'Your image has been selected successfully.',
      });
    }
  };

  const handleUpload = async () => {
    if (!imageUri) {
      Toast.show({
        type: 'error',
        text1: 'No Image',
        text2: 'Please select or capture an image first.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'photo.jpg', // You can use a dynamic name if needed
      type: 'image/jpeg', // Ensure this matches the image format
    });

    try {
      setIsLoading(true);

      const token = await getToken("accessToken");
      const response = await axios.post(
        'http://192.168.246.137:3000/api/v1/products/extractText',
        formData, // Pass formData as the second argument
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Upload Successful',
          text2: 'Redirecting to analysis page...',
        });
        setTimeout(() => {
          router.replace("screen/uploadAnalysis");
        }, 900);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Upload Failed',
          text2: 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred during upload. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Image Uploader</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.placeholder}>
            <Text>No Image Selected</Text>
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleChooseFromGallery}>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
        {isLoading ? (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={{ marginTop: 10 }}>Analyzing...</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleUpload}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        )}
      </View>
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imagePreview: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  placeholder: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#eaeaea',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#21bf73',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Upload;
