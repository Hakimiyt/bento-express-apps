import { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import FoodCard from "../components/FoodCard";
import { useOrder } from "../context/OrderContext";

export default function MenuScreen({ navigation }) {
  const { cartItems } = useOrder();
  const [searchText, setSearchText] = useState("");
  const bentoMenu = [
    { 
      id: "1", 
      name: "Bento Set A", 
      description: "Chicken Teriyaki Bento",
      price: "18.90", 
      image: require("../assets/images/set_A.jpeg") 
    },
    { 
      id: "2", 
      name: "Bento Set B", 
      description: "Beef Yakiniku Bento",
      price: "22.50", 
      image: require("../assets/images/set_B.jpeg") 
    },
    { 
      id: "3", 
      name: "Bento Set C", 
      description: "Salmon Butter Bento",
      price: "25.00", 
      image: require("../assets/images/set_C.jpeg") 
    },
    { 
      id: "4", 
      name: "Bento Set D", 
      description: "Veggie Tofu Bento",
      price: "15.00", 
      image: require("../assets/images/set_D.jpeg") 
    },
  ];

  const openCart = () => {
    navigation.navigate("OrderSummary");
  };

  const filteredMenu = bentoMenu.filter((item) =>
    `${item.name} ${item.description}`.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>BENTO EXPRESS</Text>
          <Text style={styles.title}>Menu hari ini</Text>
          <Text style={styles.subtitle}>Pilih bento kegemaran anda</Text>
        </View>
        <Pressable
          onPress={openCart}
          accessibilityRole="button"
          accessibilityLabel={`Buka troli, ${cartItems.length} item`}
          hitSlop={10}
          style={styles.cartButton}
        >
          <Image source={require("../assets/icons/shopping-cart-icon.svg")} style={styles.cartIcon} contentFit="contain"/>
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Image source={require("../assets/icons/search-icon.svg")} style={styles.searchIcon} contentFit="contain"/>
        <TextInput
          placeholder="Cari menu bento..."
          placeholderTextColor="#999999"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          accessibilityLabel="Cari menu bento"
        />
      </View>

      <View style={styles.listHeading}>
        <Text style={styles.listTitle}>Pilihan bento</Text>
        <Text style={styles.itemCount}>{filteredMenu.length} menu</Text>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={filteredMenu}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Menu tidak ditemui</Text>
            <Text style={styles.emptyDescription}>Cuba kata carian yang lain.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <FoodCard item={item} onPress={() => navigation.navigate("Detail", { foodItem: item })}/>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor: "#FBF8F4",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 20,
  },
  brand: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#E05A47",
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#292522",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#817B75",
    marginTop: 3,
  },
  cartIcon: {
    width: 22,
    height: 22,
  },
  cartButton: {
    position: "relative",
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F0EAE4",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E05A47",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: "#F0EAE4",
    marginBottom: 22,
  },
  searchIcon: {
    width: 17,
    height: 17,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#292522",
  },
  listHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listTitle: {
    color: "#292522",
    fontSize: 18,
    fontWeight: "800",
  },
  itemCount: {
    color: "#817B75",
    fontSize: 13,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 36,
  },
  emptyTitle: {
    color: "#292522",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyDescription: {
    color: "#817B75",
    fontSize: 14,
    marginTop: 6,
  },
});