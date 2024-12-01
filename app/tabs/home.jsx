import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  BackHandler,
  FlatList,
  Alert,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { getToken } from "../../constants/token";
import axios from "axios";
import { images } from "../../constants";

// Import all cat images statically
import snacks from "../assets/images/cat/snacks.jpg";
import cat3 from "../assets/images/cat/beverage.jpg";
import cat4 from "../assets/images/cat/chocolate.jpg";
import cat5 from "../assets/images/cat/cereal.jpg";
import cat6 from "../assets/images/cat/diaryProduct.jpg";
import cat7 from "../assets/images/cat/bread.jpg";
import cat8 from "../assets/images/cat/biscuit.jpg";
import cat9 from "../assets/images/cat/noodle.jpeg";
import cat10 from "../assets/images/cat/wheat.jpg";
import cat11 from "../assets/images/cat/sauce.jpg";
import cat12 from "../assets/images/cat/iceCream.jpg";
import cat13 from "../assets/images/cat/grans.jpg";
import cat14 from "../assets/images/cat/toast.png";
import cat15 from "../assets/images/cat/nutBars.jpg";
import cat16 from "../assets/images/cat/vegetable.jpg";

const Home = () => {
  const router = useRouter(); // Initialize the router

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("User");
  const [nameLetter, setNameLetter] = useState("");

  // Check for token and update isAuthenticated state
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getToken("accessToken");
      setIsAuthenticated(!!token);
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (isAuthenticated) {
        router.push('tabs/home')
        return true;
      }
      else{
        router.push('auth/sign-in')
        return false;
      }
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchName = async() => {
      const token = await getToken("accessToken");
      if (token) {
        try {
          const response = await axios.get(
            "http://192.168.246.137:3000/api/v1/users/username",
            // "http://10.0.2.2:3000/api/v1/users/username",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setName(response.data.data.name);
          console.log(response.data.data.name[0])
          setNameLetter(response.data.data.name[0])
        } catch (error) {
          Alert.alert("Error", "Failed to fetch profile.");
        }
      } else {
        Alert.alert("Unauthorized", "No token found. Please sign in.");
      }
    }
    fetchName();
  }, [])

  // Image data for the slider
  const sliderImages = [
    { id: "1", image: require("../assets/images/article4.jpg") },
    { id: "2", image: require("../assets/images/article2.jpg") },
    { id: "3", image: require("../assets/images/article3.jpg") },
    { id: "4", image: require("../assets/images/article1.jpg") },
  ];

  const catImagess = [
    { image: snacks, text: "Snacks" },
    { image: cat3, text: "Beverages" },
    { image: cat4, text: "Chocolates" },
    { image: cat5, text: "Cereals" },
    { image: cat6, text: "Dairy product" },
    { image: cat7, text: "Bread" },
    { image: cat8, text: "Biscuits" },
    { image: cat9, text: "Noodles" },
    { image: cat10, text: "Wheat" },
    { image: cat11, text: "Spread \nand sauces" },
    { image: cat12, text: "Ice cream" },
    { image: cat13, text: "Grains" },
    { image: cat14, text: "Toast" },
    { image: cat15, text: "Nut bars" },
    { image: cat16, text: "Vegetable" },
  ];
  // Cat images array
  const catImages = [
    snacks,
    cat3,
    cat4,
    cat5,
    cat6,
    cat7,
    cat8,
    cat9,
    cat10,
    cat11,
    cat12,
    cat13,
    cat14,
    cat15,
    cat16,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  useEffect(() => {
    if (flatListRef.current && sliderImages.length > 0) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex]);

  return (
    // 
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.circularBackground} />
        <View style={styles.header}>
        <ImageBackground source={images.home} />
          <View style={styles.userIcon}>
            <Text style={styles.userIconText}>{nameLetter}</Text>
          </View>
          <Text style={styles.headerText}>Hi, {name}</Text>
        </View>

        <Text style={styles.sectionTitle}>HEALTH TIPS AND ARTICLES</Text>

        <FlatList
          ref={flatListRef}
          data={sliderImages}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Image source={item.image} style={styles.sliderImage} />
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          style={styles.imageSlider}
          getItemLayout={(data, index) => ({
            length: 360,
            offset: 360 * index,
            index,
          })}
        />

        <View style={styles.articleContainer}>
          <Text style={styles.articleTitle}>Healthy Food Choice</Text>
          <Text style={styles.articleSubtitle}>
            HOW TO JUMP ON A HEALTHY BANDWAGON WITH EASE
          </Text>

          {/* Grid View for Images */}
          <View style={styles.imageGrid}>
            {catImagess.map((item, index) => (
              <View key={index} style={styles.gridItem}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "screen/category",
                      params: { category: item.text },
                    })
                  } // Pass category text
                >
                  <Image source={item.image} style={styles.gridImage} />
                </TouchableOpacity>
                <Text style={styles.imageText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: "2%",
    marginTop: "2%",
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  userIconText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#21bf73"
  },
  headerText: {
    marginLeft: 10,
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  circularBackground: {
    position: "absolute",
    right: 0,
    top: "-5%",
    width: "100%",
    height: "10%",
    borderRadius: 100,
    backgroundColor: "#66cf17",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    marginLeft: 70,
    marginTop: "9%",
  },
  articleContainer: {
    margin: 16,
    marginTop: 40,
  },
  articleTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  articleSubtitle: {
    fontSize: 16,
    margin: 10,
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  imageSlider: {
    marginTop: 30,
    marginLeft: 16,
  },
  sliderImage: {
    width: 350,
    height: 220,
    borderRadius: 10,
    marginRight: 10,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridImage: {
    width: 100,
    height: 100,
    marginTop: 15,
    borderRadius: 10,
    marginBottom: 5,
  },
  gridItem: {
    alignItems: "center", // Center the image and text horizontally
    marginBottom: 20, // Add some margin for spacing between items
  },
  imageText: {
    marginTop: 5,
    fontSize: 14,
    color: "gray", // Adjust this to your preference
    textAlign: "center",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "white",
    borderTopColor: "lightgray",
    borderTopWidth: 1,
  },
});

export default Home;
