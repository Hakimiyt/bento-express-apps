import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function FoodCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {item.image ? (
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageEmoji}>{item.imageEmoji ?? "🍱"}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.price}>RM {item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 140,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0EAE4",
    shadowColor: "#35291F",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 112,
    height: 118,
    borderRadius: 12,
    backgroundColor: "#F5F1EC",
  },
  imagePlaceholder: {
    width: 112,
    height: 118,
    borderRadius: 12,
    backgroundColor: "#FFF1E8",
    alignItems: "center",
    justifyContent: "center",
  },
  imageEmoji: {
    fontSize: 42,
  },
  info: {
    flex: 1,
    minHeight: 112,
    justifyContent: "space-between",
    marginLeft: 14,
    paddingVertical: 4,
  },
  category: {
    color: "#E05A47",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#292522",
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: "#817B75",
    marginTop: 5,
  },
  price: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "800",
    color: "#E05A47",
  },
});