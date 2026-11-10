import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, Image, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { useOrder } from "../context/OrderContext";

export default function DetailScreen({ route, navigation }) {
  const { cartItems, setCartItems } = useOrder();
  // Panggil params item Makanan
  const { foodItem, cartItemId } = route.params || {};
  // useState Hooks
  const [spiceLevel, setSpiceLevel] = useState(route.params?.spiceLevel ?? 1);
  const [specialNotes, setSpecialNotes] = useState(route.params?.specialNotes ?? "");

  useEffect(() => {
    setSpiceLevel(route.params?.spiceLevel ?? 1);
    setSpecialNotes(route.params?.specialNotes ?? "");
  }, [route.params?.foodItem, route.params?.cartItemId, route.params?.spiceLevel, route.params?.specialNotes]);

  const handleConfirmOrder = () => {
    // Message if Error
    if (!foodItem) {
      return Alert.alert("Ralat", "Tiada maklumat makanan ditemui.");
    }
    if (cartItemId && !cartItems.some((item) => item.id === cartItemId)) {
      return Alert.alert("Ralat", "Pesanan ini tidak ditemui dalam troli.");
    }

    const updatedItem = {
      id: cartItemId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      foodItem,
      spiceLevel,
      specialNotes,
    };

    if (cartItemId) {
      setCartItems((items) => items.map((item) => item.id === cartItemId ? updatedItem : item));
      Alert.alert("Pesanan Dikemas Kini", "Perubahan pesanan telah disimpan.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      return;
    }

    setCartItems((items) => [...items, updatedItem]);
    Alert.alert("Ditambah ke Troli", `${foodItem.name} telah ditambah ke troli.`, [
      { text: "Teruskan Membeli", style: "cancel", onPress: () => navigation.navigate("Menu") },
      { text: "Lihat Troli", onPress: () => navigation.navigate("OrderSummary") },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.detailCard}>
          {/* Gambar Makanan */}
          {foodItem?.image && (
            <Image source={foodItem.image} style={styles.image} resizeMode="contain"/>
          )}

          {/* Maklumat Utama */}
          <Text style={styles.name}>
            {foodItem?.name ?? "Nama makanan tidak tersedia"}
          </Text>
          <Text style={styles.price}>
            {foodItem?.price ? `RM ${foodItem.price}` : "-"}
          </Text>
          <Text style={styles.description}>
            {foodItem?.description ?? "Deskripsi tidak tersedia"}
          </Text>

          {/* Pemilihan Tahap Pedas */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tahap Pedas:</Text>
            <View style={styles.spiceContainer}>
              {[1, 2, 3].map((level) => (
                <View key={level} style={styles.spiceButtonWrapper}>
                  <CustomButton title={`Level ${level}`} onPress={() => setSpiceLevel(level)} variant={spiceLevel === level ? "primary" : "disabled"}/>
                </View>
              ))}
            </View>
          </View>

          {/* Borang Nota Khas */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Nota Khas:</Text>
            <TextInput style={styles.noteInput} placeholder="Contoh: Kurangkan Sos..." placeholderTextColor="#A0AEC0" multiline numberOfLines={3} value={specialNotes} onChangeText={(text) => setSpecialNotes(text)}/>
          </View>

          {/* Butang Tindakan */}
          <CustomButton
            title={cartItemId ? "Simpan Perubahan" : "Tambah ke Troli"}
            onPress={handleConfirmOrder}
            variant="primary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D3748",
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E05A47",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 8,
  },
  spiceContainer: {
    flexDirection: "row",
    gap: 10,
  },
  spiceButtonWrapper: {
    flex: 1,
  },
  noteInput: {
    minHeight: 70,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 10,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#000000",
  },
});