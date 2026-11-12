import { useState } from "react";
import { View, Text, StyleSheet, Alert, Image, Pressable, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { useOrder } from "../context/OrderContext";

const getSelectedAddOns = (foodItem, selectedAddOnIds = []) =>
  (foodItem?.addOns ?? []).filter((addOn) => selectedAddOnIds.includes(addOn.id));

const getItemTotal = (item) =>
  Number(item.foodItem?.price ?? 0) +
  getSelectedAddOns(item.foodItem, item.selectedAddOnIds).reduce(
    (total, addOn) => total + Number(addOn.price),
    0
  );

export default function OrderSummaryScreen({ navigation }) {
  const { cartItems, setCartItems } = useOrder();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [checkoutFeedback, setCheckoutFeedback] = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const totalPrice = cartItems.reduce(
    (total, item) => total + getItemTotal(item),
    0
  );

  const handleSendOrder = () => {
    if (cartItems.length === 0) {
      return Alert.alert("Troli kosong", "Tambah item sebelum menghantar pesanan.");
    }

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setCheckoutFeedback("Sila isi nama, nombor telefon dan alamat penghantaran.");
      return;
    }

    setCheckoutFeedback("");
    setOrderSubmitted(true);
  };

  const handleFinishOrder = () => {
    setCartItems([]);
    setCustomerName("");
    setCustomerPhone("");
    setDeliveryAddress("");
    setOrderSubmitted(false);
    navigation.navigate("Menu");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>Troli Anda</Text>
        <Text style={styles.subtitle}>
          {cartItems.length === 1 ? "1 hidangan dalam troli" : `${cartItems.length} hidangan dalam troli`}
        </Text>
      </View>

      <ScrollView
        style={styles.cartList}
        contentContainerStyle={cartItems.length === 0 ? styles.emptyList : styles.cartContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
          cartItems.map((item) => {
            const { id, foodItem, spiceLevel, specialNotes, selectedAddOnIds = [] } = item;
            const selectedAddOns = getSelectedAddOns(foodItem, selectedAddOnIds);
            return (
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
                    Jumlah hidangan: RM {getItemTotal(item).toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.options}>
                <View style={styles.optionPill}>
                  <Text style={styles.optionText}>Pedas · Tahap {spiceLevel ?? 1}</Text>
                </View>
                {selectedAddOns.length > 0 && (
                  <View style={styles.addOnList}>
                    <Text style={styles.addOnLabel}>Tambahan:</Text>
                    {selectedAddOns.map((addOn) => (
                      <Text key={addOn.id} style={styles.addOnText}>
                        {addOn.name} · RM {Number(addOn.price).toFixed(2)}
                      </Text>
                    ))}
                  </View>
                )}
                <Text style={styles.note} numberOfLines={2}>
                  Nota: {specialNotes?.trim() || "Tiada"}
                </Text>
              </View>

              {!orderSubmitted && (
                <View style={styles.itemActions}>
                  <Pressable
                    onPress={() =>
                      navigation.push("Detail", {
                        foodItem,
                        spiceLevel,
                        specialNotes,
                        selectedAddOnIds,
                        cartItemId: id,
                      })
                    }
                    accessibilityRole="button"
                    style={styles.editButton}
                  >
                    <Text style={styles.editButtonText}>Ubah</Text>
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
              )}
            </View>
            );
          })
        )}
        {cartItems.length > 0 && !orderSubmitted && (
          <View style={styles.customerForm}>
            <Text style={styles.formTitle}>Maklumat pelanggan</Text>
            <Text style={styles.formDescription}>Lengkapkan butiran untuk penghantaran pesanan anda.</Text>

            <Text style={styles.fieldLabel}>Nama penuh</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Ahmad bin Ali"
              placeholderTextColor="#999999"
              value={customerName}
              onChangeText={(text) => {
                setCustomerName(text);
                setCheckoutFeedback("");
              }}
              autoCapitalize="words"
              accessibilityLabel="Nama penuh"
            />

            <Text style={styles.fieldLabel}>Nombor telefon</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 0123456789"
              placeholderTextColor="#999999"
              value={customerPhone}
              onChangeText={(text) => {
                setCustomerPhone(text);
                setCheckoutFeedback("");
              }}
              keyboardType="phone-pad"
              accessibilityLabel="Nombor telefon"
            />

            <Text style={styles.fieldLabel}>Alamat penghantaran</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Masukkan alamat lengkap"
              placeholderTextColor="#999999"
              value={deliveryAddress}
              onChangeText={(text) => {
                setDeliveryAddress(text);
                setCheckoutFeedback("");
              }}
              multiline
              textAlignVertical="top"
              accessibilityLabel="Alamat penghantaran"
            />
          </View>
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.checkout}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Jumlah keseluruhan</Text>
            <Text style={styles.totalPrice}>RM {totalPrice.toFixed(2)}</Text>
          </View>
          {orderSubmitted ? (
            <View style={styles.successFeedback} accessibilityRole="alert">
              <Text style={styles.successTitle}>Pesanan berjaya dihantar!</Text>
              <Text style={styles.successDescription}>
                Terima kasih, {customerName.trim()}. Pesanan anda sedang diproses.
              </Text>
              <CustomButton title="Kembali ke Menu" onPress={handleFinishOrder} variant="primary" />
            </View>
          ) : (
            <>
              {checkoutFeedback ? (
                <Text style={styles.errorFeedback} accessibilityRole="alert">
                  {checkoutFeedback}
                </Text>
              ) : null}
              <CustomButton title="Hantar Semua Pesanan" onPress={handleSendOrder} variant="primary" />
              <Pressable
                onPress={() => navigation.navigate("Menu")}
                accessibilityRole="button"
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>Teruskan membeli</Text>
              </Pressable>
            </>
          )}
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
  customerForm: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  formTitle: {
    color: "#222222",
    fontSize: 18,
    fontWeight: "800",
  },
  formDescription: {
    color: "#777777",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 16,
  },
  fieldLabel: {
    color: "#444444",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
  },
  input: {
    minHeight: 46,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#222222",
    fontSize: 14,
    marginBottom: 14,
  },
  addressInput: {
    minHeight: 82,
    marginBottom: 0,
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
  addOnList: {
    gap: 4,
  },
  addOnLabel: {
    color: "#555555",
    fontSize: 13,
    fontWeight: "700",
  },
  addOnText: {
    color: "#666666",
    fontSize: 13,
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
  errorFeedback: {
    color: "#A83225",
    backgroundColor: "#FCE9E6",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 13,
    lineHeight: 18,
  },
  successFeedback: {
    backgroundColor: "#EAF7EF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#C9E9D3",
  },
  successTitle: {
    color: "#246B3B",
    fontSize: 16,
    fontWeight: "800",
  },
  successDescription: {
    color: "#477554",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
    marginBottom: 12,
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
