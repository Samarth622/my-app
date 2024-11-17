import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { getToken } from "../../constants/token.js";
import { router } from "expo-router";

const Category = () => {
  const { category } = useLocalSearchParams(); // Category passed from previous screen
  const [searchQuery, setSearchQuery] = useState(""); // For tracking user input
  const [products, setProducts] = useState([]); // To store fetched products
  const [filteredProducts, setFilteredProducts] = useState([]); // For filtered products based on search
  const [suggestions, setSuggestions] = useState([]); // For displaying suggestions
  const [loading, setLoading] = useState(true); // Loading state
  const [loadingProduct, setLoadingProduct] = useState(false);

  const handleProductPress = async (name) => {
    const token = await getToken("accessToken");

    setLoadingProduct(true);

    try {
      const response = await axios.get(
        // `http://10.0.2.2:3000/api/v1/products/productAnalysis?name=${name}`,
          `http://192.168.36.137:3000/api/v1/products/productAnalysis?name=${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        }
      );

      if (response.status === 200) {
        console.log("Analysis Successfully");
        router.replace("screen/analysis"); // Redirect to analysis page
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Something went wrong");
    } finally {
      setLoadingProduct(false);
    }
  };

  // Fetch products from backend based on category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          // `http://10.0.2.2:3000/api/v1/products/allProducts?category=${category}`
          `http://192.168.36.137:3000/api/v1/products/allProducts?category=${category}`,
        );
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text.length > 0) {
      // Filter products locally based on search text
      const filteredSuggestions = products.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]); // Clear suggestions when input is empty
      setFilteredProducts(products); // Reset to all products when search is cleared
    }
  };

  // Handle product selection from suggestions
  const handleProductSelect = (product) => {
    setFilteredProducts([product]); // Show only selected product
    setSearchQuery(""); // Clear search query
    setSuggestions([]); // Clear suggestions
  };

  const renderSuggestions = suggestions.map((item, index) => (
    <TouchableOpacity
      key={item.id ? item.id.toString() : `suggestion-${index}`}
      style={styles.suggestionItem}
      onPress={() => handleProductSelect(item.id)}
    >
      <Text style={styles.suggestionText}>{item.name}</Text>
    </TouchableOpacity>
  ));

  // Render each product item using map()
  const renderProductItems = filteredProducts.map((item, index) => (
    <TouchableOpacity
      key={item.id ? item.id.toString() : `filtered-${index}`}
      style={styles.productContainer}
      onPress={() => handleProductPress(item.name)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
    </TouchableOpacity>
  ));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search for products..."
            style={styles.searchInput}
          />
          {/* Clear Search Button */}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={24} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        {/* Suggestions List */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>{renderSuggestions}</View>
        )}

        {/* Show product-specific loader if the user clicks a product */}
        {loadingProduct && (
          <View style={styles.productLoadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading product analysis...</Text>
          </View>
        )}

        {/* Main Product List */}
        {!loadingProduct && (
          <View style={styles.productListContainer}>{renderProductItems}</View>
        )}
      </View>
    </ScrollView>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    maxHeight: 150,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  productListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productContainer: {
    width: "48%", // Adjust width to fit two items in a row
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
