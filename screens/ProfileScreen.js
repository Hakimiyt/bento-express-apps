import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AlertPopup from "../components/AlertPopup";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { recentOrders, setCartItems, setRecentOrders } = useOrder();
  const [contactName, setContactName] = useState(user?.name ?? "");
  const [contactEmail, setContactEmail] = useState(user?.email ?? "");
  const [contactMessage, setContactMessage] = useState("");
  const [contactNotification, setContactNotification] = useState(null);
  const initials = user?.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

  const handleLogout = () => {
    setCartItems([]);
    setRecentOrders([]);
    logout();
  };

  const handleContactSubmit = () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactNotification({
        title: "Maklumat belum lengkap",
        message: "Sila isi nama, e-mel dan mesej anda.",
        variant: "error",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      setContactNotification({
        title: "E-mel tidak sah",
        message: "Sila masukkan alamat e-mel yang sah.",
        variant: "error",
      });
      return;
    }

    setContactNotification({
      title: "Borang Contact Us",
      message: "Borang telah disemak, tetapi mesej belum dihantar kerana khidmat pelanggan belum disambungkan.",
      variant: "info",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.eyebrow}>AKAUN ANDA</Text>
        <Text style={styles.title}>Profil</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name ?? "Pengguna"}</Text>
          <Text style={styles.email}>{user?.email ?? ""}</Text>
          {/* <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>Akaun demo</Text>
          </View> */}
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Maklumat profil</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nama penuh</Text>
            <Text style={styles.detailValue}>{user?.name ?? "-"}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>E-mel</Text>
            <Text style={styles.detailValue}>{user?.email ?? "-"}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.sectionDescription}>
            Ada soalan atau maklum balas? Tinggalkan mesej untuk pasukan BentoX Amirul.
          </Text>

          <Text style={styles.fieldLabel}>Nama</Text>
          <TextInput
            style={styles.input}
            value={contactName}
            onChangeText={setContactName}
            placeholder="Nama anda"
            placeholderTextColor="#A39A92"
            autoCapitalize="words"
            accessibilityLabel="Nama untuk borang Contact Us"
          />

          <Text style={styles.fieldLabel}>E-mel</Text>
          <TextInput
            style={styles.input}
            value={contactEmail}
            onChangeText={setContactEmail}
            placeholder="nama@email.com"
            placeholderTextColor="#A39A92"
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="E-mel untuk borang Contact Us"
          />

          <Text style={styles.fieldLabel}>Mesej</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={contactMessage}
            onChangeText={setContactMessage}
            placeholder="Tulis mesej anda..."
            placeholderTextColor="#A39A92"
            multiline
            textAlignVertical="top"
            accessibilityLabel="Mesej Contact Us"
          />

          <Pressable
            onPress={handleContactSubmit}
            accessibilityRole="button"
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Hantar mesej</Text>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Order</Text>
          {recentOrders.length === 0 ? (
            <Text style={styles.sectionDescription}>
              Pesanan yang telah dihantar akan dipaparkan di sini.
            </Text>
          ) : (
            recentOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>Pesanan #{order.id.slice(-6)}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.placedAt).toLocaleDateString()}
                  </Text>
                </View>
                {order.items.map((item) => (
                  <Text key={item.id} style={styles.orderItem}>
                    {item.name} · RM {item.total.toFixed(2)}
                  </Text>
                ))}
                {order.discountAmount > 0 ? (
                  <Text style={styles.orderDiscount}>
                    {order.voucherCode} · Diskaun 10%: - RM {order.discountAmount.toFixed(2)}
                  </Text>
                ) : null}
                <Text style={styles.orderPayment}>
                  Bayaran: {order.paymentMethod ?? "Tidak dinyatakan"}
                </Text>
                <View style={styles.orderTotalRow}>
                  <Text style={styles.orderTotalLabel}>Jumlah</Text>
                  <Text style={styles.orderTotal}>RM {order.total.toFixed(2)}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.aboutText}>
            BentoX Amirul menyajikan pilihan hidangan Jepun, termasuk bento, ramen,
            snek dan minuman untuk dinikmati bersama keluarga dan rakan.
          </Text>
        </View>

        <Pressable
          onPress={handleLogout}
          accessibilityRole="button"
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Log keluar</Text>
        </Pressable>
      </ScrollView>
      <AlertPopup
        visible={Boolean(contactNotification)}
        title={contactNotification?.title}
        message={contactNotification?.message}
        variant={contactNotification?.variant}
        onPrimaryPress={() => setContactNotification(null)}
        onDismiss={() => setContactNotification(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF8F4",
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 30,
  },
  eyebrow: {
    color: "#E05A47",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 10,
  },
  title: {
    color: "#292522",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 20,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0EAE4",
    borderRadius: 18,
    padding: 24,
  },
  avatar: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 38,
    backgroundColor: "#FFF0EC",
    marginBottom: 13,
  },
  avatarText: {
    color: "#E05A47",
    fontSize: 25,
    fontWeight: "800",
  },
  name: {
    color: "#292522",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  email: {
    color: "#817B75",
    fontSize: 14,
    marginTop: 5,
  },
  demoBadge: {
    backgroundColor: "#FFF2EF",
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginTop: 13,
  },
  demoBadgeText: {
    color: "#A94336",
    fontSize: 12,
    fontWeight: "700",
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0EAE4",
    borderRadius: 16,
    padding: 17,
    marginTop: 16,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0EAE4",
    borderRadius: 16,
    padding: 17,
    marginTop: 16,
  },
  sectionTitle: {
    color: "#292522",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 16,
  },
  sectionDescription: {
    color: "#817B75",
    fontSize: 13,
    lineHeight: 19,
    marginTop: -7,
    marginBottom: 14,
  },
  fieldLabel: {
    color: "#48413B",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },
  input: {
    minHeight: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EAE2DA",
    backgroundColor: "#FFFEFC",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#292522",
    fontSize: 14,
    marginBottom: 14,
  },
  messageInput: {
    minHeight: 100,
  },
  submitButton: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#E05A47",
    marginTop: 2,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  orderCard: {
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0EAE4",
    marginTop: 10,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 9,
  },
  orderNumber: {
    flex: 1,
    color: "#39332E",
    fontSize: 14,
    fontWeight: "700",
  },
  orderDate: {
    color: "#817B75",
    fontSize: 12,
  },
  orderItem: {
    color: "#665F59",
    fontSize: 13,
    lineHeight: 19,
  },
  orderPayment: {
    color: "#817B75",
    fontSize: 12,
    marginTop: 8,
  },
  orderDiscount: {
    color: "#246B3B",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },
  orderTotalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#F0EAE4",
    paddingTop: 9,
    marginTop: 9,
  },
  orderTotalLabel: {
    color: "#817B75",
    fontSize: 13,
  },
  orderTotal: {
    color: "#E05A47",
    fontSize: 14,
    fontWeight: "800",
  },
  aboutText: {
    color: "#665F59",
    fontSize: 14,
    lineHeight: 22,
  },
  detailRow: {
    gap: 5,
  },
  detailLabel: {
    color: "#817B75",
    fontSize: 12,
  },
  detailValue: {
    color: "#39332E",
    fontSize: 15,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#F0EAE4",
    marginVertical: 14,
  },
  logoutButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8C8C2",
    borderRadius: 12,
    marginTop: 22,
  },
  logoutButtonText: {
    color: "#C64536",
    fontSize: 15,
    fontWeight: "700",
  },
});
