import { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import AlertPopup from "../components/AlertPopup";
import { useOrder } from "../context/OrderContext";
import {
  getPromotionPrice,
  PROMOTION_DISCOUNT_RATE,
  PROMOTION_VOUCHER_CODE,
} from "../utils/promotion";

const getSelectedAddOns = (foodItem, selectedAddOnIds = []) =>
  (foodItem?.addOns ?? []).filter((addOn) => selectedAddOnIds.includes(addOn.id));

const getItemTotal = (item) =>
  Number(item.foodItem?.price ?? 0) +
  getSelectedAddOns(item.foodItem, item.selectedAddOnIds).reduce(
    (total, addOn) => total + Number(addOn.price),
    0
  );

const paymentMethods = [
  {
    id: "cash_on_delivery",
    label: "COD (Tunai semasa penghantaran)",
    description: "Bayar apabila pesanan diterima",
  },
  {
    id: "fpx",
    label: "FPX",
    description: "Perbankan dalam talian",
  },
  {
    id: "e_wallet",
    label: "E-Wallet",
    description: "Dompet digital",
  },
];

export default function OrderSummaryScreen({ navigation }) {
  const { cartItems, setCartItems, addRecentOrder } = useOrder();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [checkoutErrorTitle, setCheckoutErrorTitle] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const subtotalPrice = cartItems.reduce(
    (total, item) => total + getItemTotal(item),
    0
  );
  const promotedTotal = cartItems.reduce(
    (total, item) => total + getPromotionPrice(getItemTotal(item)),
    0
  );
  const discountAmount = voucherApplied
    ? Number((subtotalPrice - promotedTotal).toFixed(2))
    : 0;
  const totalPrice = Number((subtotalPrice - discountAmount).toFixed(2));

  const handleApplyVoucher = () => {
    if (voucherCode.trim().toUpperCase() !== PROMOTION_VOUCHER_CODE) {
      setVoucherApplied(false);
      setCheckoutErrorTitle("Kod voucher tidak sah");
      setCheckoutError(`Masukkan kod ${PROMOTION_VOUCHER_CODE} untuk diskaun 10%.`);
      return;
    }

    setCheckoutErrorTitle("");
    setCheckoutError("");
    setVoucherApplied(true);
  };

  const handleSendOrder = () => {
    if (cartItems.length === 0) {
      setCheckoutErrorTitle("Troli kosong");
      setCheckoutError("Tambah item sebelum menghantar pesanan.");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setCheckoutErrorTitle("Maklumat belum lengkap");
      setCheckoutError("Sila isi nama, nombor telefon dan alamat penghantaran.");
      return;
    }

    const paymentMethod = paymentMethods.find(
      (method) => method.id === selectedPaymentMethod
    );
    if (!paymentMethod) {
      setCheckoutErrorTitle("Kaedah bayaran belum dipilih");
      setCheckoutError("Sila pilih kaedah bayaran untuk meneruskan pesanan.");
      return;
    }

    setCheckoutError("");
    addRecentOrder({
      id: `${Date.now()}`,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.foodItem?.name ?? "Menu",
        total: getItemTotal(item),
      })),
      total: totalPrice,
      subtotal: subtotalPrice,
      discountAmount,
      voucherCode: voucherApplied ? PROMOTION_VOUCHER_CODE : "",
      paymentMethod: paymentMethod.label,
      placedAt: new Date().toISOString(),
    });
    setOrderSubmitted(true);
  };

  const handleFinishOrder = () => {
    setCartItems([]);
    setCustomerName("");
    setCustomerPhone("");
    setDeliveryAddress("");
    setSelectedPaymentMethod("");
    setVoucherCode("");
    setVoucherApplied(false);
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
              Pilih makanan atau minuman kegemaran anda dan ia akan muncul di sini.
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
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imageEmoji}>{foodItem?.imageEmoji ?? "🍱"}</Text>
                  </View>
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
                {foodItem?.category !== "Minuman" && (
                  <View style={styles.optionPill}>
                    <Text style={styles.optionText}>Pedas · Tahap {spiceLevel ?? 1}</Text>
                  </View>
                )}
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
              }}
              multiline
              textAlignVertical="top"
              accessibilityLabel="Alamat penghantaran"
            />

            <Text style={styles.fieldLabel}>Kod voucher</Text>
            <View style={styles.voucherRow}>
              <TextInput
                style={[styles.input, styles.voucherInput]}
                value={voucherCode}
                onChangeText={(text) => {
                  setVoucherCode(text);
                  setVoucherApplied(false);
                }}
                placeholder="Masukkan kod voucher"
                placeholderTextColor="#999999"
                autoCapitalize="characters"
                accessibilityLabel="Kod voucher"
              />
              <Pressable
                onPress={handleApplyVoucher}
                accessibilityRole="button"
                style={styles.voucherButton}
              >
                <Text style={styles.voucherButtonText}>Guna</Text>
              </Pressable>
            </View>
            <Text style={voucherApplied ? styles.voucherSuccess : styles.voucherHint}>
              {voucherApplied
                ? `${PROMOTION_VOUCHER_CODE} berjaya digunakan. Diskaun 10%.`
                : `Gunakan ${PROMOTION_VOUCHER_CODE} untuk diskaun 10%.`}
            </Text>

            <Text style={styles.fieldLabel}>Kaedah bayaran</Text>
            <Text style={styles.paymentHint}>
              Pilih kaedah bayaran pilihan anda.
            </Text>
            {paymentMethods.map((method) => {
              const isSelected = selectedPaymentMethod === method.id;
              return (
                <Pressable
                  key={method.id}
                  onPress={() => setSelectedPaymentMethod(method.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  style={[
                    styles.paymentOption,
                    isSelected && styles.paymentOptionSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected ? <View style={styles.radioInner} /> : null}
                  </View>
                  <View style={styles.paymentOptionCopy}>
                    <Text style={styles.paymentOptionTitle}>{method.label}</Text>
                    <Text style={styles.paymentOptionDescription}>
                      {method.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.checkout}>
          {voucherApplied && (
            <>
              <View style={styles.discountRow}>
                <Text style={styles.discountLabel}>Jumlah asal</Text>
                <Text style={styles.originalTotal}>
                  RM {subtotalPrice.toFixed(2)}
                </Text>
              </View>
              <View style={styles.discountRow}>
                <Text style={styles.discountLabel}>
                  {PROMOTION_VOUCHER_CODE} · {PROMOTION_DISCOUNT_RATE * 100}%
                </Text>
                <Text style={styles.discountAmount}>
                  - RM {discountAmount.toFixed(2)}
                </Text>
              </View>
            </>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              {voucherApplied ? "Jumlah selepas promosi" : "Jumlah keseluruhan"}
            </Text>
            <Text style={styles.totalPrice}>RM {totalPrice.toFixed(2)}</Text>
          </View>
          {!orderSubmitted && (
            <>
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
      <AlertPopup
        visible={Boolean(checkoutError) || orderSubmitted}
        title={orderSubmitted ? "Pesanan berjaya dihantar!" : checkoutErrorTitle}
        message={
          orderSubmitted
            ? `Terima kasih!. Pesanan anda sedang diproses.`
            : checkoutError
        }
        variant={orderSubmitted ? "success" : "error"}
        primaryLabel={orderSubmitted ? "Kembali ke Menu" : "Baik"}
        onPrimaryPress={
          orderSubmitted
            ? handleFinishOrder
            : () => {
                setCheckoutErrorTitle("");
                setCheckoutError("");
              }
        }
        onDismiss={() => {
          if (!orderSubmitted) {
            setCheckoutErrorTitle("");
            setCheckoutError("");
          }
        }}
      />
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
  voucherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  voucherInput: {
    flex: 1,
    marginBottom: 0,
  },
  voucherButton: {
    minHeight: 46,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#E05A47",
  },
  voucherButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  voucherHint: {
    color: "#817B75",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
    marginBottom: 15,
  },
  voucherSuccess: {
    color: "#246B3B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
    marginBottom: 15,
  },
  paymentHint: {
    color: "#817B75",
    fontSize: 12,
    lineHeight: 18,
    marginTop: -2,
    marginBottom: 10,
  },
  paymentOption: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginBottom: 8,
  },
  paymentOptionSelected: {
    borderColor: "#E05A47",
    backgroundColor: "#FFF7F5",
  },
  radioOuter: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#A39A92",
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: "#E05A47",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E05A47",
  },
  paymentOptionCopy: {
    flex: 1,
  },
  paymentOptionTitle: {
    color: "#39332E",
    fontSize: 13,
    fontWeight: "700",
  },
  paymentOptionDescription: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 3,
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
    alignItems: "center",
    justifyContent: "center",
  },
  imageEmoji: {
    fontSize: 34,
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
  discountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  discountLabel: {
    color: "#665F59",
    fontSize: 12,
  },
  originalTotal: {
    color: "#817B75",
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  discountAmount: {
    color: "#246B3B",
    fontSize: 13,
    fontWeight: "700",
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
