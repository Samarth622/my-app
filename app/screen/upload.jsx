import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";

const Upload = () => {
  const [imageUri, setImageUri] = useState(null);

  // Request Permissions for Camera and Media Library
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted) {
      Alert.alert(
        "Permission Denied",
        "Camera access is required to take photos."
      );
      return false;
    }

    if (!mediaLibraryPermission.granted) {
      Alert.alert(
        "Permission Denied",
        "Media library access is required to select photos."
      );
      return false;
    }

    return true;
  };

  // Open Camera
  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Set image URI to display preview
    }
  };

  // Open Gallery
  const handleChooseFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Set image URI to display preview
    }
  };

  const handleUpload = async () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please select or capture an image first.");
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'photo.jpg', // You can use a dynamic name if needed
      type: 'image/jpeg', // Ensure this matches the image format
    });

    try {
      const response = await axios.post(
        'http://192.168.181.137:3000/api/v1/products/extractText',
        formData, // Pass formData as the second argument
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Set the content type
          },
        }
      );

      if (response.status == 200) {
        console.log("Image uploaded successfully")
        router.replace("screen/uploadAnalysis")
        // Alert.alert("Success", `Extracted Text: ${result.data.extractedText}`);
      } else {
        console.log("Failed to upload image")
        // Alert.alert("Error", result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      // Alert.alert("Error", "Something went wrong while uploading.");
    }
  }


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
        <TouchableOpacity style={styles.button} onPress={handleUpload}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#007BFF',
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