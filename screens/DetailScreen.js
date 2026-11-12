import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, Image, Pressable } from "react-native";
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
  const [selectedAddOnIds, setSelectedAddOnIds] = useState(route.params?.selectedAddOnIds ?? []);
  const [itemAdded, setItemAdded] = useState(false);
  const selectedAddOnTotal = (foodItem?.addOns ?? [])
    .filter((addOn) => selectedAddOnIds.includes(addOn.id))
    .reduce((total, addOn) => total + Number(addOn.price), 0);
  const itemTotal = Number(foodItem?.price ?? 0) + selectedAddOnTotal;

  useEffect(() => {
    setSpiceLevel(route.params?.spiceLevel ?? 1);
    setSpecialNotes(route.params?.specialNotes ?? "");
    setSelectedAddOnIds(route.params?.selectedAddOnIds ?? []);
  }, [route.params?.foodItem, route.params?.cartItemId, route.params?.spiceLevel, route.params?.specialNotes, route.params?.selectedAddOnIds]);

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
      selectedAddOnIds,
    };

    if (cartItemId) {
      setCartItems((items) => items.map((item) => item.id === cartItemId ? updatedItem : item));
      Alert.alert("Pesanan Dikemas Kini", "Perubahan pesanan telah disimpan.", [
        { text: "Baik", onPress: () => navigation.goBack() },
      ]);
      return;
    }

    setCartItems((items) => [...items, updatedItem]);
    setItemAdded(true);
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
            {foodItem?.price ? `Harga asas: RM ${foodItem.price}` : "-"}
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
                  <CustomButton title={`Tahap ${level}`} onPress={() => setSpiceLevel(level)} variant={spiceLevel === level ? "primary" : "disabled"}/>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tambahan pilihan</Text>
            <Text style={styles.addOnHint}>Tandakan tambahan yang anda inginkan:</Text>
            {(foodItem?.addOns ?? []).map((addOn) => {
              const isSelected = selectedAddOnIds.includes(addOn.id);
              return (
                <Pressable
                  key={addOn.id}
                  onPress={() =>
                    setSelectedAddOnIds((current) =>
                      isSelected
                        ? current.filter((id) => id !== addOn.id)
                        : [...current, addOn.id]
                    )
                  }
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  style={[styles.addOnOption, isSelected && styles.addOnOptionSelected]}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Text style={styles.checkboxCheck}>✓</Text>}
                  </View>
                  <Text style={styles.addOnName}>{addOn.name}</Text>
                  <Text style={styles.addOnPrice}>+ RM {Number(addOn.price).toFixed(2)}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Borang Nota Khas */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Nota Khas:</Text>
            <TextInput style={styles.noteInput} placeholder="Contoh: Kurangkan Sos..." placeholderTextColor="#A0AEC0" multiline numberOfLines={3} value={specialNotes} onChangeText={(text) => setSpecialNotes(text)}/>
          </View>

          <View style={styles.priceSummary}>
            <Text style={styles.priceSummaryLabel}>Jumlah hidangan</Text>
            <Text style={styles.priceSummaryTotal}>RM {itemTotal.toFixed(2)}</Text>
          </View>

          {/* Butang Tindakan */}
          <CustomButton
            title={cartItemId ? "Simpan Perubahan" : "Tambah ke Troli"}
            onPress={handleConfirmOrder}
            variant="primary"
          />
          {itemAdded && (
            <View style={styles.addedFeedback} accessibilityRole="alert">
              <Text style={styles.addedTitle}>Berjaya ditambah ke troli</Text>
              <Text style={styles.addedMessage}>{foodItem.name} sedia untuk dipesan.</Text>
              <Pressable
                onPress={() => navigation.navigate("OrderSummary")}
                accessibilityRole="button"
                style={styles.cartLink}
              >
                <Text style={styles.cartLinkText}>Lihat troli</Text>
              </Pressable>
            </View>
          )}
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
  addOnHint: {
    color: "#777777",
    fontSize: 13,
    marginBottom: 8,
  },
  addOnOption: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FAFAFA",
    marginBottom: 8,
  },
  addOnOptionSelected: {
    borderColor: "#E05A47",
    backgroundColor: "#FFF5F2",
  },
  checkbox: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#AAAAAA",
    borderRadius: 5,
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: "#E05A47",
    borderColor: "#E05A47",
  },
  checkboxCheck: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
  addOnName: {
    flex: 1,
    color: "#333333",
    fontSize: 14,
  },
  addOnPrice: {
    color: "#555555",
    fontSize: 13,
    fontWeight: "600",
  },
  priceSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#EEEEEE",
    paddingTop: 12,
    marginBottom: 16,
  },
  priceSummaryLabel: {
    color: "#555555",
    fontSize: 15,
    fontWeight: "600",
  },
  priceSummaryTotal: {
    color: "#E05A47",
    fontSize: 18,
    fontWeight: "800",
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
  addedFeedback: {
    backgroundColor: "#EAF7EF",
    borderRadius: 10,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#C9E9D3",
  },
  addedTitle: {
    color: "#246B3B",
    fontSize: 15,
    fontWeight: "700",
  },
  addedMessage: {
    color: "#477554",
    fontSize: 13,
    marginTop: 4,
  },
  cartLink: {
    alignSelf: "flex-start",
    minHeight: 40,
    justifyContent: "center",
    marginTop: 4,
    paddingRight: 8,
  },
  cartLinkText: {
    color: "#246B3B",
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});