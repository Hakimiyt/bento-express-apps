import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

const variantStyles = {
  success: {
    icon: "✓",
    iconBackground: "#EAF7EF",
    iconColor: "#246B3B",
  },
  error: {
    icon: "!",
    iconBackground: "#FCE9E6",
    iconColor: "#C64536",
  },
  info: {
    icon: "i",
    iconBackground: "#FFF2EF",
    iconColor: "#E05A47",
  },
};

export default function AlertPopup({
  visible,
  title,
  message,
  variant = "info",
  primaryLabel = "Baik",
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
  onDismiss,
}) {
  const variantStyle = variantStyles[variant] ?? variantStyles.info;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View
          style={styles.dialog}
          accessibilityRole="alert"
          accessibilityViewIsModal
        >
          <View style={[styles.icon, { backgroundColor: variantStyle.iconBackground }]}>
            <Text style={[styles.iconText, { color: variantStyle.iconColor }]}>
              {variantStyle.icon}
            </Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable
            onPress={onPrimaryPress ?? onDismiss}
            accessibilityRole="button"
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
          </Pressable>
          {secondaryLabel ? (
            <Pressable
              onPress={onSecondaryPress ?? onDismiss}
              accessibilityRole="button"
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>{secondaryLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(35, 29, 25, 0.48)",
  },
  dialog: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    borderRadius: 22,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    elevation: 12,
    shadowColor: "#231D19",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  icon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 30,
    fontWeight: "800",
  },
  title: {
    color: "#292522",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  message: {
    color: "#817B75",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 22,
  },
  primaryButton: {
    width: "100%",
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#E05A47",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginTop: 4,
  },
  secondaryButtonText: {
    color: "#817B75",
    fontSize: 14,
    fontWeight: "600",
  },
});
