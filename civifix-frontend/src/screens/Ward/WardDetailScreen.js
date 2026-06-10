import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Platform,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import authService, { getErrorMessage } from "../../services/authService";
import { COLORS, SPACING, FONT_SIZES, SHADOWS } from "../../constants/theme";

const WardDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { ward } = route.params || {};

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setError("");
      const res = await authService.getComplaints({ page: 1, limit: 50 });
      const allComplaints = res?.complaints ?? res?.data ?? [];
      const wardComplaints = allComplaints.filter((c) => c.ward_id === ward._id);
      setComplaints(wardComplaints);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load complaints"));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      OPEN: "#D97706",
      WORKING: COLORS.primary,
      APPROVAL: "#0891B2",
      CLOSED: "#059669",
      REJECTED: "#DC2626",
    };
    return statusMap[status] || COLORS.textLight;
  };

  // ─── COMPONENTS ─────────────────────────────────────────────────────────────

  const HeaderBar = () => (
    <View
      style={{
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "ios" ? insets.top : 16,
        paddingBottom: 16,
        paddingHorizontal: SPACING.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.md }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: "700", color: "white" }}>
            {ward?.ward_name}
          </Text>
          <Text style={{ fontSize: FONT_SIZES.xs, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
            Ward #{ward?.ward_number}
          </Text>
        </View>
      </View>
    </View>
  );

  const WardInfo = () => (
    <View
      style={{
        backgroundColor: "white",
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
        borderRadius: 12,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.lg,
        ...SHADOWS.md,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.md }}>
        <Text style={{ fontSize: FONT_SIZES.md, fontWeight: "700", color: COLORS.textDark }}>
          Ward Overview
        </Text>
        <View
          style={{
            backgroundColor: ward?.is_active ? "#D1FAE5" : "#FEE2E2",
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text style={{ fontSize: FONT_SIZES.xs, fontWeight: "700", color: ward?.is_active ? "#059669" : "#DC2626" }}>
            {ward?.is_active ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      <View style={{ gap: SPACING.md }}>
        <InfoRow icon="map-marker" label="Ward Number" value={`#${ward?.ward_number}`} />
        <InfoRow icon="file-document" label="Complaints" value={`${ward?.complaint_count || 0}`} />
        <InfoRow icon="alert" label="Active Issues" value={`${ward?.active_complaints || 0}`} />
        <InfoRow icon="check-circle" label="Resolved" value={`${ward?.closed_complaints || 0}`} />
      </View>

      {ward?.description && (
        <View style={{ marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: "#E5E7EB" }}>
          <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginBottom: SPACING.sm }}>
            Description
          </Text>
          <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textDark }}>
            {ward.description}
          </Text>
        </View>
      )}
    </View>
  );

  const InfoRow = ({ icon, label, value }) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm }}>
        <Icon name={icon} size={18} color={COLORS.primary} />
        <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textLight }}>
          {label}
        </Text>
      </View>
      <Text style={{ fontSize: FONT_SIZES.sm, fontWeight: "700", color: COLORS.textDark }}>
        {value}
      </Text>
    </View>
  );

  const ComplaintCard = ({ complaint }) => (
    <View
      style={{
        backgroundColor: "white",
        marginHorizontal: SPACING.lg,
        marginVertical: SPACING.sm,
        borderRadius: 12,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        ...SHADOWS.sm,
        borderLeftWidth: 4,
        borderLeftColor: getStatusColor(complaint.status),
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: FONT_SIZES.md, fontWeight: "700", color: COLORS.textDark }}>
            {complaint.title}
          </Text>
          <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 4 }}>
            ID: {complaint.complaint_id}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: `${getStatusColor(complaint.status)}22`,
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text style={{ fontSize: FONT_SIZES.xs, fontWeight: "700", color: getStatusColor(complaint.status) }}>
            {complaint.status}
          </Text>
        </View>
      </View>

      <Text
        numberOfLines={2}
        style={{
          fontSize: FONT_SIZES.sm,
          color: COLORS.textLight,
          marginTop: SPACING.sm,
        }}
      >
        {complaint.description}
      </Text>
    </View>
  );

  const SectionHeader = ({ title, count }) => (
    <View
      style={{
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
        marginHorizontal: SPACING.lg,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: FONT_SIZES.md, fontWeight: "700", color: COLORS.textDark }}>
        {title}
      </Text>
      <View
        style={{
          backgroundColor: COLORS.primary,
          borderRadius: 999,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
        }}
      >
        <Text style={{ fontSize: FONT_SIZES.xs, fontWeight: "700", color: "white" }}>
          {count}
        </Text>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xxl }}>
      <Icon name="check-circle" size={64} color={COLORS.textLight} style={{ marginBottom: SPACING.lg }} />
      <Text style={{ fontSize: FONT_SIZES.md, fontWeight: "700", color: COLORS.textDark, marginBottom: SPACING.sm }}>
        No Complaints
      </Text>
      <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textLight, textAlign: "center" }}>
        This ward has no complaints yet
      </Text>
    </View>
  );

  // ─── RENDER ──────────────────────────────────────────────────────────────────

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <HeaderBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <WardInfo />
        <SectionHeader title="Complaints" count={complaints.length} />
        {loading ? (
          <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: SPACING.xxl }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : error ? (
          <View style={{ marginHorizontal: SPACING.lg, marginVertical: SPACING.lg }}>
            <Text style={{ color: "#DC2626", fontSize: FONT_SIZES.sm, textAlign: "center" }}>
              {error}
            </Text>
          </View>
        ) : complaints.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {complaints.map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))}
            <View style={{ height: SPACING.lg }} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default WardDetailScreen;
