import { View, Text, StyleSheet, Alert, Image, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { useOrder } from "../context/OrderContext";

export default function OrderSummaryScreen({ navigation }) {
  const { cartItems, setCartItems } = useOrder();
  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.foodItem?.price ?? 0),
    0
  );

  const handleSendOrder = () => {
    if (cartItems.length === 0) {
      return Alert.alert("Troli kosong", "Tambah item sebelum menghantar pesanan.");
    }

    Alert.alert("Pesanan Berjaya!", "Pesanan bento anda sedang diproses.", [
      {
        text: "OK",
        onPress: () => {
          setCartItems([]);
          navigation.navigate("Menu");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>Troli Anda</Text>
        <Text style={styles.subtitle}>
          {cartItems.length === 1 ? "1 item dalam troli" : `${cartItems.length} item dalam troli`}
        </Text>
      </View>

      <ScrollView
        style={styles.cartList}
        contentContainerStyle={cartItems.length === 0 ? styles.emptyList : styles.cartContent}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>0</Text>
            </View>
            <Text style={styles.emptyTitle}>Troli masih kosong</Text>
            <Text style={styles.emptyDescription}>
              Pilih bento kegemaran anda dan ia akan muncul di sini.
            </Text>
            <Pressable
              onPress={() => navigation.navigate("Menu")}
              accessibilityRole="button"
              style={styles.browseButton}
            >
              <Text style={styles.browseButtonText}>Lihat Menu</Text>
            </Pressable>
          </View>
        ) : (
          cartItems.map(({ id, foodItem, spiceLevel, specialNotes }) => (
            <View key={id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                {foodItem?.image ? (
                  <Image source={foodItem.image} style={styles.image} resizeMode="cover" />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {foodItem?.name ?? "Bento"}
                  </Text>
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {foodItem?.description ?? ""}
                  </Text>
                  <Text style={styles.itemPrice}>
                    RM {Number(foodItem?.price ?? 0).toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.options}>
                <View style={styles.optionPill}>
                  <Text style={styles.optionText}>Pedas · Level {spiceLevel ?? 1}</Text>
                </View>
                <Text style={styles.note} numberOfLines={2}>
                  Nota: {specialNotes?.trim() || "Tiada"}
                </Text>
              </View>

              <View style={styles.itemActions}>
                <Pressable
                  onPress={() =>
                    navigation.push("Detail", {
                      foodItem,
                      spiceLevel,
                      specialNotes,
                      cartItemId: id,
                    })
                  }
                  accessibilityRole="button"
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>
                <Pressable
                  onPress={() => setCartItems((items) => items.filter((item) => item.id !== id))}
                  accessibilityRole="button"
                  accessibilityLabel={`Buang ${foodItem?.name ?? "item"} dari troli`}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Buang</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.checkout}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Jumlah keseluruhan</Text>
            <Text style={styles.totalPrice}>RM {totalPrice.toFixed(2)}</Text>
          </View>
          <CustomButton title="Hantar Semua Pesanan" onPress={handleSendOrder} variant="primary" />
          <Pressable
            onPress={() => navigation.navigate("Menu")}
            accessibilityRole="button"
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>Teruskan membeli</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  heading: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#222222",
  },
  subtitle: {
    color: "#777777",
    fontSize: 14,
    marginTop: 4,
  },
  cartList: {
    flex: 1,
  },
  cartContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  emptyState: {
    alignItems: "center",
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FCE9E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyIconText: {
    color: "#E05A47",
    fontSize: 30,
    fontWeight: "800",
  },
  emptyTitle: {
    color: "#222222",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyDescription: {
    color: "#777777",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  browseButton: {
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E05A47",
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 10,
    backgroundColor: "#F1F1F1",
  },
  imagePlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 10,
    backgroundColor: "#F1F1F1",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  itemName: {
    color: "#222222",
    fontSize: 16,
    fontWeight: "700",
  },
  itemDescription: {
    color: "#777777",
    fontSize: 12,
    marginTop: 4,
  },
  itemPrice: {
    color: "#E05A47",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 7,
  },
  options: {
    borderTopWidth: 1,
    borderColor: "#F0F0F0",
    marginTop: 12,
    paddingTop: 10,
    gap: 8,
  },
  optionPill: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF2EF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  optionText: {
    color: "#A94336",
    fontSize: 12,
    fontWeight: "600",
  },
  note: {
    color: "#777777",
    fontSize: 13,
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 18,
    marginTop: 12,
  },
  editButton: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  editButtonText: {
    color: "#555555",
    fontSize: 14,
    fontWeight: "700",
  },
  removeButton: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  removeButtonText: {
    color: "#C64536",
    fontSize: 14,
    fontWeight: "700",
  },
  checkout: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderColor: "#EEEEEE",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  totalLabel: {
    color: "#555555",
    fontSize: 15,
    fontWeight: "600",
  },
  totalPrice: {
    color: "#222222",
    fontSize: 20,
    fontWeight: "800",
  },
  continueButton: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  continueButtonText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "600",
  },
});
