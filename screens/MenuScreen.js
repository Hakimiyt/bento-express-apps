import { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import FoodCard from "../components/FoodCard";
import { useOrder } from "../context/OrderContext";

export default function MenuScreen({ navigation }) {
  const { cartItems } = useOrder();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const menuItems = [
    { 
      id: "1", 
      name: "Bento Ayam Teriyaki",
      description: "Bento Ayam Teriyaki",
      price: "18.90",
      category: "Bento",
      image: require("../assets/images/set_A.jpeg"),
      addOns: [
        { id: "extra-rice", name: "Nasi tambahan", price: 2 },
        { id: "fried-egg", name: "Telur mata", price: 2 },
        { id: "miso-soup", name: "Sup miso", price: 3.5 },
      ],
    },
    { 
      id: "2", 
      name: "Bento Daging Yakiniku",
      description: "Bento Daging Yakiniku",
      price: "22.50",
      category: "Bento",
      image: require("../assets/images/Bento-Daging.png"),
      addOns: [
        { id: "extra-beef", name: "Daging tambahan", price: 6 },
        { id: "fried-egg", name: "Telur mata", price: 2 },
        { id: "miso-soup", name: "Sup miso", price: 3.5 },
      ],
    },
    { 
      id: "3", 
      name: "Bento Salmon Mentega",
      description: "Bento Salmon Mentega",
      price: "25.00",
      category: "Bento",
      image: require("../assets/images/set_C.jpeg"),
      addOns: [
        { id: "extra-salmon", name: "Salmon tambahan", price: 8 },
        { id: "edamame", name: "Edamame", price: 3 },
        { id: "miso-soup", name: "Sup miso", price: 3.5 },
      ],
    },
    { 
      id: "4", 
      name: "Bento Sayur dan Tauhu",
      description: "Bento Sayuran dan Tauhu",
      price: "15.00",
      category: "Bento",
      image: require("../assets/images/set_D.jpeg"),
      addOns: [
        { id: "extra-tofu", name: "Tauhu tambahan", price: 3 },
        { id: "edamame", name: "Edamame", price: 3 },
        { id: "extra-vegetables", name: "Sayur tambahan", price: 2.5 },
      ],
    },
    {
      id: "5",
      name: "Bento Ayam Katsu",
      description: "Ayam rangup dengan sos istimewa",
      price: "20.90",
      category: "Bento",
      image: require("../assets/images/Bento-Ayam.jpg"),
      addOns: [
        { id: "extra-rice", name: "Nasi tambahan", price: 2 },
        { id: "curry-sauce", name: "Sos kari Jepun", price: 2.5 },
        { id: "fried-egg", name: "Telur mata", price: 2 },
      ],
    },
    {
      id: "6",
      name: "Ramen Miso",
      description: "Mi ramen dalam kuah miso yang pekat",
      price: "19.90",
      category: "Makanan",
      image: require("../assets/images/Ramen-miso.png"),
      addOns: [
        { id: "ramen-egg", name: "Telur ramen", price: 2.5 },
        { id: "ramen-noodles", name: "Mi tambahan", price: 3 },
      ],
    },
    {
      id: "7",
      name: "Gyoza Ayam",
      description: "Ladu ayam panggang · 5 biji",
      price: "9.90",
      category: "Makanan",
      image: require("../assets/images/groza-ayam.png"),
      addOns: [{ id: "gyoza-extra", name: "Tambah 3 biji", price: 5 }],
    },
    {
      id: "8",
      name: "Karaage Ayam",
      description: "Ayam goreng rangup ala Jepun",
      price: "12.90",
      category: "Makanan",
      image: require("../assets/images/ayam karagee.png"),
      addOns: [{ id: "karaage-extra", name: "Tambah ayam", price: 5 }],
    },
    {
      id: "9",
      name: "Matcha Latte",
      description: "Matcha Jepun dengan susu berkrim",
      price: "8.90",
      category: "Minuman",
      image: require("../assets/images/matcha-latte.png"),
      addOns: [{ id: "matcha-oat", name: "Tukar ke susu oat", price: 1.5 }],
    },
    {
      id: "10",
      name: "Teh Lemon Ais",
      description: "Teh lemon yang menyegarkan",
      price: "5.90",
      category: "Minuman",
      image: require("../assets/images/teh-lemon-ais.png"),
      addOns: [{ id: "lemon-less-sugar", name: "Kurang gula", price: 0 }],
    },
    {
      id: "11",
      name: "Soda Laici",
      description: "Soda berkarbonat dengan laici",
      price: "6.90",
      category: "Minuman",
      image: require("../assets/images/soda-laici.png"),
      addOns: [{ id: "lychee-extra", name: "Tambah laici", price: 1.5 }],
    },
    {
      id: "12",
      name: "Air Mineral",
      description: "Air mineral botol",
      price: "2.00",
      category: "Minuman",
      image: require("../assets/images/spritzer.png"),
      addOns: [],
    },
  ];

  const categories = ["Semua", "Bento", "Makanan", "Minuman"];
  const openCart = () => {
    navigation.navigate("OrderSummary");
  };

  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch = `${item.name} ${item.description}`
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>BENTOX AMIRUL</Text>
          <Text style={styles.title}>Menu hari ini</Text>
          <Text style={styles.subtitle}>Makanan Jepun dan minuman kegemaran</Text>
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
          placeholder="Cari makanan atau minuman..."
          placeholderTextColor="#999999"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          accessibilityLabel="Cari makanan dan minuman"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        style={styles.categoryScroll}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
            >
              <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.listHeading}>
        <Text style={styles.listTitle}>
          {selectedCategory === "Semua" ? "Pilihan menu" : selectedCategory}
        </Text>
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
    marginBottom: 16,
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
  categoryScroll: {
    flexGrow: 0,
    marginBottom: 18,
  },
  categoryList: {
    gap: 9,
    paddingRight: 4,
  },
  categoryChip: {
    minHeight: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EAE2DA",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  categoryChipSelected: {
    borderColor: "#E05A47",
    backgroundColor: "#E05A47",
  },
  categoryText: {
    color: "#665F59",
    fontSize: 13,
    fontWeight: "600",
  },
  categoryTextSelected: {
    color: "#FFFFFF",
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