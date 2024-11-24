import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View, Text } from 'react-native'
import { ImageBackground, ScrollView, TouchableOpacity, Modal, Button, Image, StyleSheet } from 'react-native';
import { ProgressBar } from "react-native-paper";
import images from "../../constants/images"
import { Rating } from "react-native-elements";


const UploadAnalysis = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState([]);

  const [analysis, setAnalysis] = useState([])
  const [productDescription, setProductDescription] = useState("")
  const [rating, setRating] = useState(0);
  // const [isLoading, setIsLoading] = useState(true);

  const getColorByScore = (score) => {
    if (score > 0 && score < 4) {
      return "#FF4C4C";
    } else if (score >= 4 && score <= 6) {
      return "#FFA500";
    } else if (score >= 7 && score <= 10) {
      return "#90EE90";
    }
    return "gray";
  };

  const fetchAnalysis = async () => {
    try{
      const response = await axios.get(`http://192.168.241.137:3000/api/v1/products/imageAnalysis`);
    if (response.status == 200) {
        const { analysis, productDescription, healthMeter } = response.data.data
        setAnalysis(analysis)
        setProductDescription(productDescription)
        setRating(healthMeter / 2.5)
      }
    } catch (error) {
      console.log("Error from fetchAnalysis: ", error)
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalysis();
  }, [])

  const handleTagPress = (nutrient) => {
    setSelectedTag(nutrient);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const extractStartNumber = (str) => {
    const match = str.match(/^\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const filteredData = analysis.filter((item) => extractStartNumber(item[1]) !== 0);

  const sortedData = filteredData.slice().sort((a, b) => {
    const scoreA = extractStartNumber(a[1]);
    const scoreB = extractStartNumber(b[1]);
    return scoreA - scoreB;
  });

  return (
    <ImageBackground source={images.background}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Ultra-Processed Foods (UPFs)</Text>
          </View>
          <View style={styles.productContainer}>
            <View style={styles.productHeader}>
              {/* {imgUrl ? (
                <Image source={{ uri: imgUrl }} style={styles.productImage} />
              ) : (
                <Text>Image not found</Text>
              )} */}
              {/* <Text>Image not found</Text> */}
              <View style={styles.productDetails}>
                <Text style={styles.productName}>Product Image Analysis</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>Rating</Text>
                  <Rating
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                    style={styles.rating}
                  />
                  <Text style={styles.ratingValue}>{rating} out of 5</Text>
                </View>
              </View>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsScrollContainer}
          >
            {sortedData.map((item, index) => {
              const score = extractStartNumber(item[1]);
              const backgroundColor = getColorByScore(score);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.tag, { backgroundColor }]}
                  onPress={() => handleTagPress(item)}
                >
                  <Text style={styles.tagText}>{item[0]}</Text>
                </TouchableOpacity>
              );
            })}
            {selectedTag && (
              <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{selectedTag[0]}</Text>
                    <Text style={styles.scoreBox}>Score: {selectedTag[1]}</Text>
                    <Text style={styles.descriptionTitle}>Description:</Text>
                    <Text style={styles.description}>{selectedTag[2]}</Text>
                    <Button title="Close" onPress={closeModal} />
                  </View>
                </View>
              </Modal>
            )}
          </ScrollView>

          <View style={styles.productContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Nutritions Table</Text>
            </View>
            {filteredData.map((item, index) => {
              const score = extractStartNumber(item[1]);
              const backgroundColor = getColorByScore(score);
              return (
                <View key={index} style={styles.table}>
                  <Text style={styles.tableText}>{item[0]}</Text>
                  <ProgressBar
                    progress={score / 10}
                    color={backgroundColor}
                    style={styles.progressBar}
                  />
                </View>
              );
            })}
          </View>

          <View style={styles.conclusionContainer}>
            <Text style={styles.conclusionHeader}>Conclusion</Text>
            <Text style={styles.conclusionText}>{productDescription}</Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
  },
  productContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  productHeader: {
    flexDirection: "column",
    alignItems: "center",
  },
  productImage: {
    width: 200,
    height: 200,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    marginRight: 8,
    fontSize: 20,
  },
  rating: {
    marginRight: 8,
    fontSize: 34,
  },
  ratingValue: {
    fontSize: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  tagsScrollContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 8,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  tagText: {
    color: "white",
    fontWeight: "bold",
  },
  table: {
    padding: 8,
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  tableText: {
    fontSize: 15,
    margin: 3,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  conclusionContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  conclusionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
  conclusionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
    textAlign: "justify",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scoreBox: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default UploadAnalysis;