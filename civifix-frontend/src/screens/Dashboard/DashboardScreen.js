import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../../context/AuthContext";
import { Screen } from "../../components";
import { COLORS, FONT_SIZES, SHADOWS, SPACING } from "../../constants/theme";
import authService from "../../services/authService";

// ─── UTILITIES ───────────────────────────────────────────────────────────────

const getItems = (payload, keys = ["data", "items", "list"]) => {
  if (Array.isArray(payload)) return payload;
  for (const k of keys) if (Array.isArray(payload?.[k])) return payload[k];
  return [];
};

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  OPEN:     { label: "Pending",     color: "#D97706", bg: "#FEF3C7" },
  WORKING:  { label: "In Progress", color: COLORS.primary,  bg: "#DBEAFE" },
  APPROVAL: { label: "Review",      color: "#0891B2", bg: "#CFFAFE" },
  CLOSED:   { label: "Resolved",    color: "#059669", bg: "#D1FAE5" },
  REJECTED: { label: "Rejected",    color: "#DC2626", bg: "#FFE4E6" },
};

const TYPE_META = {
  ROAD_DAMAGE:  { icon: "road-variant",         color: "#DC2626", title: "Road Damage"          },
  POTHOLE:      { icon: "road-variant",         color: "#DC2626", title: "Pothole"              },
  GARBAGE:      { icon: "trash-can-outline",    color: "#0891B2", title: "Waste Collection"     },
  STREETLIGHT:  { icon: "lightbulb-on-outline", color: COLORS.primary,  title: "Street Light"  },
  WATER_SUPPLY: { icon: "water-outline",        color: COLORS.primary,  title: "Water Supply"  },
  DRAINAGE:     { icon: "pipe-disconnected",    color: "#0891B2", title: "Drainage"             },
  SANITATION:   { icon: "broom",                color: "#0891B2", title: "Sanitation"           },
  TREE_CUTTING: { icon: "tree-outline",         color: "#059669", title: "Tree Issue"           },
  CONSTRUCTION: { icon: "hammer-wrench",        color: "#D97706", title: "Construction"         },
  OTHER:        { icon: "alert-outline",        color: "#DC2626", title: "Civic Issue"          },
};

const ROLE_META = {
  SUPER_ADMIN:    { label: "Super Admin",     color: COLORS.primary, bg: "#DBEAFE" },
  DISTRICT_ADMIN: { label: "District Admin",  color: "#7C3AED",      bg: "#EDE9FE" },
  INSPECTOR:      { label: "Inspector",       color: "#0891B2",      bg: "#CFFAFE" },
  WORKER:         { label: "Worker",          color: "#059669",      bg: "#D1FAE5" },
  CITIZEN:        { label: "Citizen",         color: "#D97706",      bg: "#FEF3C7" },
};

// gradient per role
const ROLE_GRADIENT = {
  SUPER_ADMIN:    ["#0052CC", "#172B4D"],
  DISTRICT_ADMIN: ["#5B21B6", "#2D1B69"],
  INSPECTOR:      ["#0E7490", "#164E63"],
  WORKER:         ["#065F46", "#022C22"],
  CITIZEN:        ["#0052CC", "#172B4D"],
};

// ─── SHARED MICRO-COMPONENTS ─────────────────────────────────────────────────

const Avatar = ({ name, size = 44, color = COLORS.primary }) => (
  <View style={{
    width: size, height: size, borderRadius: size / 2,
    backgroundColor: `${color}22`, alignItems: "center", justifyContent: "center",
  }}>
    <Text style={{ color, fontSize: size * 0.36, fontWeight: "900" }}>{initials(name)}</Text>
  </View>
);

const Pill = ({ label, color, bg }) => (
  <View style={{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
    <Text style={{ color, fontSize: 10, fontWeight: "800" }}>{label}</Text>
  </View>
);

const SectionTitle = ({ left, right, onRight }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: SPACING.xl, marginBottom: SPACING.sm }}>
    <Text style={{ color: COLORS.textDark, fontSize: FONT_SIZES.sm, fontWeight: "800" }}>{left}</Text>
    {right && (
      <TouchableOpacity onPress={onRight}>
        <Text style={{ color: COLORS.primary, fontSize: FONT_SIZES.xs, fontWeight: "800" }}>{right}</Text>
      </TouchableOpacity>
    )}
  </View>
);

/** Big metric tile */
const MetricCard = ({ icon, value, label, color, bg }) => (
  <View style={{
    flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.md,
    alignItems: "center", ...SHADOWS.md, minHeight: 84,
  }}>
    <View style={{
      width: 32, height: 32, borderRadius: 10, backgroundColor: bg ?? `${color}15`,
      alignItems: "center", justifyContent: "center", marginBottom: 6,
    }}>
      <Icon name={icon} size={17} color={color} />
    </View>
    <Text style={{ color: COLORS.textDark, fontSize: FONT_SIZES.lg, fontWeight: "900" }}>{value ?? "—"}</Text>
    <Text style={{ color: COLORS.textLight, fontSize: 9.5, fontWeight: "700", textAlign: "center", marginTop: 1 }}>{label}</Text>
  </View>
);

const MetricRow = ({ metrics }) => (
  <View style={{ flexDirection: "row", gap: SPACING.sm }}>
    {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
  </View>
);

/** Complaint list item — clickable */
const ComplaintItem = ({ complaint, index, total, onPress }) => {
  const type   = complaint.complaint_type || "OTHER";
  const meta   = TYPE_META[type] || TYPE_META.OTHER;
  const status = STATUS_STYLES[complaint.status] || STATUS_STYLES.OPEN;
  const title  = complaint.title || complaint.type || meta.title;
  const desc   = complaint.description || "No description provided";

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={onPress}
      style={{
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
        borderBottomWidth: index === total - 1 ? 0 : 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <View style={{
        width: 34, height: 34, borderRadius: 8,
        backgroundColor: `${meta.color}14`,
        alignItems: "center", justifyContent: "center", marginRight: SPACING.md,
      }}>
        <Icon name={meta.icon} size={18} color={meta.color} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ color: COLORS.textDark, fontSize: FONT_SIZES.md, fontWeight: "800" }}>{title}</Text>
        <Text numberOfLines={1} style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs, fontWeight: "600" }}>{desc}</Text>
        <Text style={{ color: COLORS.textLight, fontSize: 9.5, fontWeight: "700", marginTop: 2 }}>
          {complaint.complaint_id || complaint._id || "#CIV-NEW"}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <View style={{ backgroundColor: status.bg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 }}>
          <Text style={{ color: status.color, fontSize: 9.5, fontWeight: "800" }}>{status.label}</Text>
        </View>
        <Icon name="chevron-right" size={14} color={COLORS.textLight} />
      </View>
    </TouchableOpacity>
  );
};

/** Simple list item — view only (no press) */
const InfoItem = ({ icon, iconColor, iconBg, primary, secondary, badge, badgeColor, badgeBg, index, total }) => (
  <View style={{
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    borderBottomWidth: index === total - 1 ? 0 : 1,
    borderBottomColor: COLORS.border,
  }}>
    <View style={{
      width: 34, height: 34, borderRadius: 8,
      backgroundColor: iconBg ?? `${iconColor}14`,
      alignItems: "center", justifyContent: "center", marginRight: SPACING.md,
    }}>
      <Icon name={icon} size={17} color={iconColor} />
    </View>
    <View style={{ flex: 1, minWidth: 0 }}>
      <Text numberOfLines={1} style={{ color: COLORS.textDark, fontSize: FONT_SIZES.md, fontWeight: "700" }}>{primary}</Text>
      {!!secondary && <Text numberOfLines={1} style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs }}>{secondary}</Text>}
    </View>
    {badge && (
      <View style={{ backgroundColor: badgeBg ?? "#F1F5F9", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
        <Text style={{ color: badgeColor ?? COLORS.textLight, fontSize: 9.5, fontWeight: "800" }}>{badge}</Text>
      </View>
    )}
  </View>
);

/** Card wrapper */
const ListCard = ({ children, empty, emptyLabel }) => (
  <View style={{ backgroundColor: COLORS.card, borderRadius: 12, overflow: "hidden", ...SHADOWS.md }}>
    {children}
    {empty && (
      <View style={{ padding: SPACING.xl, alignItems: "center" }}>
        <Icon name="clipboard-text-outline" size={28} color={COLORS.border} />
        <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs, marginTop: 8, textAlign: "center" }}>
          {emptyLabel || "No items yet."}
        </Text>
      </View>
    )}
  </View>
);

/** Quick action button */
const QuickActionBtn = ({ icon, title, color, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.82}
    onPress={onPress}
    style={{
      width: "23.5%", minHeight: 78, borderRadius: 12,
      backgroundColor: COLORS.card, alignItems: "center",
      justifyContent: "center", paddingHorizontal: 4, ...SHADOWS.md,
    }}
  >
    <View style={{
      width: 34, height: 34, borderRadius: 17,
      backgroundColor: `${color}14`, alignItems: "center",
      justifyContent: "center", marginBottom: 6,
    }}>
      <Icon name={icon} size={19} color={color} />
    </View>
    <Text numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}
      style={{ color: COLORS.textDark, fontSize: 9.5, lineHeight: 12, fontWeight: "800", textAlign: "center" }}>
      {title}
    </Text>
  </TouchableOpacity>
);

// ─── USER PROFILE CARD (shared across all roles) ─────────────────────────────

const UserProfileCard = ({ meData, user, stats }) => {
  const displayName  = meData?.name ?? user?.name ?? "Welcome";
  const displayEmail = meData?.email ?? user?.email ?? "";
  const role         = meData?.role  ?? user?.role  ?? "CITIZEN";
  const district     = meData?.district ?? user?.district ?? "";
  const roleMeta     = ROLE_META[role] ?? ROLE_META.CITIZEN;
  const roleGrad     = ROLE_GRADIENT[role] ?? ROLE_GRADIENT.CITIZEN;
  const avatarColor  = roleGrad[0];

  return (
    <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, ...SHADOWS.lg }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar name={displayName} size={44} color={avatarColor} />
        <View style={{ flex: 1, marginLeft: SPACING.md, minWidth: 0 }}>
          <Text numberOfLines={1} style={{ color: COLORS.textDark, fontSize: FONT_SIZES.md, fontWeight: "900" }}>
            {displayName}
          </Text>
          {!!displayEmail && (
            <Text numberOfLines={1} style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs, marginTop: 1 }}>
              {displayEmail}
            </Text>
          )}
          <View style={{ flexDirection: "row", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
            <Pill label={roleMeta.label} color={roleMeta.color} bg={roleMeta.bg} />
            {!!district && <Pill label={`📍 ${district}`} color="#059669" bg="#D1FAE5" />}
          </View>
        </View>
      </View>

      {stats && stats.length > 0 && (
        <>
          <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md }} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {stats.map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={{ width: 1, height: 26, backgroundColor: COLORS.border }} />}
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ color: COLORS.textDark, fontSize: FONT_SIZES.lg, fontWeight: "900" }}>{s.value ?? "—"}</Text>
                  <Text style={{ color: COLORS.textLight, fontSize: 9, fontWeight: "600", marginTop: 1 }}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

// ─── ROLE DASHBOARDS ─────────────────────────────────────────────────────────

// 1. SUPER ADMIN
const SuperAdminDashboard = ({ navigation, meData, user }) => {
  const [stats, setStats]         = useState({});
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        authService.getAdminStats?.()       ?? Promise.resolve({}),
        authService.getComplaints?.()       ?? Promise.resolve([]),
      ]);
      setStats(statsRes?.data ?? statsRes ?? {});
      setComplaints(getItems(complaintsRes).slice(0, 5));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const profileStats = [
    { value: stats.total_districts ?? "—", label: "Districts" },
    { value: stats.total_complaints ?? complaints.length, label: "Complaints" },
    { value: stats.total_workers ?? "—", label: "Workers" },
  ];

  const quickActions = [
    { icon: "domain-plus",       title: "Create\nDistrict",      color: COLORS.primary,  onPress: () => navigation.navigate("CreateDistrictAdmin") },
    { icon: "account-plus",      title: "Create\nInspector",     color: "#7C3AED",       onPress: () => navigation.navigate("CreateInspector") },
    { icon: "hammer-wrench",     title: "Create\nWorker",        color: "#059669",       onPress: () => navigation.navigate("CreateWorker") },
    { icon: "chart-bar",         title: "Reports",               color: COLORS.accent,   onPress: () => navigation.navigate("Reports") },
  ];

  const metrics = [
    { icon: "map-marker-radius", value: stats.total_wards       ?? "—", label: "Total Wards",      color: COLORS.primary, bg: "#DBEAFE" },
    { icon: "account-tie",       value: stats.total_inspectors  ?? "—", label: "Inspectors",       color: "#0891B2",      bg: "#CFFAFE" },
    { icon: "account-hard-hat",  value: stats.total_workers     ?? "—", label: "Workers",          color: "#059669",      bg: "#D1FAE5" },
    { icon: "clipboard-list",    value: stats.total_complaints  ?? complaints.length, label: "Complaints", color: "#D97706", bg: "#FEF3C7" },
  ];

  return (
    <>
      <UserProfileCard meData={meData} user={user} stats={profileStats} />

      <SectionTitle left="Quick Actions" />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {quickActions.map((a, i) => <QuickActionBtn key={i} {...a} />)}
      </View>

      <SectionTitle left="Overview" />
      <View style={{ flexDirection: "row", gap: SPACING.sm, flexWrap: "wrap" }}>
        {metrics.map((m, i) => (
          <View key={i} style={{ width: "47.5%" }}>
            <MetricCard {...m} />
          </View>
        ))}
      </View>

      <SectionTitle
        left="Recent Complaints"
        right="View All"
        onRight={() => navigation.getParent()?.navigate("Complaints")}
      />
      <ListCard empty={!loading && complaints.length === 0} emptyLabel="No complaints yet.">
        {loading ? (
          <View style={{ padding: SPACING.xl }}><ActivityIndicator color={COLORS.primary} /></View>
        ) : (
          complaints.map((c, i) => (
            <ComplaintItem
              key={c._id || i} complaint={c} index={i} total={complaints.length}
              onPress={() => navigation.navigate("ComplaintDetail", { complaint: c })}
            />
          ))
        )}
      </ListCard>
    </>
  );
};

// 2. DISTRICT ADMIN
const DistrictAdminDashboard = ({ navigation, meData, user }) => {
  const [data, setData]   = useState({ inspectors: [], workers: [], wards: [], users: [], complaints: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [insRes, workerRes, wardRes, usersRes, compRes] = await Promise.all([
        authService.getInspectors?.()  ?? Promise.resolve([]),
        authService.getWorkers?.()     ?? Promise.resolve([]),
        authService.getWards?.()       ?? Promise.resolve([]),
        authService.getDistrictUsers?.() ?? Promise.resolve([]),
        authService.getComplaints?.()  ?? Promise.resolve([]),
      ]);
      setData({
        inspectors: getItems(insRes).slice(0, 5),
        workers:    getItems(workerRes).slice(0, 5),
        wards:      getItems(wardRes).slice(0, 5),
        users:      getItems(usersRes).slice(0, 5),
        complaints: getItems(compRes).slice(0, 5),
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const profileStats = [
    { value: data.inspectors.length, label: "Inspectors" },
    { value: data.workers.length,    label: "Workers"    },
    { value: data.complaints.length, label: "Complaints" },
  ];

  const metrics = [
    { icon: "map-marker-radius", value: data.wards.length,      label: "Wards",       color: COLORS.primary, bg: "#DBEAFE" },
    { icon: "account-tie",       value: data.inspectors.length, label: "Inspectors",  color: "#7C3AED",      bg: "#EDE9FE" },
    { icon: "account-hard-hat",  value: data.workers.length,    label: "Workers",     color: "#059669",      bg: "#D1FAE5" },
    { icon: "clipboard-list",    value: data.complaints.length, label: "Complaints",  color: "#D97706",      bg: "#FEF3C7" },
  ];

  const LoadingRow = () => (
    <View style={{ padding: SPACING.lg }}><ActivityIndicator color={COLORS.primary} /></View>
  );

  return (
    <>
      <UserProfileCard meData={meData} user={user} stats={profileStats} />

      <SectionTitle left="District Overview" />
      <View style={{ flexDirection: "row", gap: SPACING.sm, flexWrap: "wrap" }}>
        {metrics.map((m, i) => (
          <View key={i} style={{ width: "47.5%" }}><MetricCard {...m} /></View>
        ))}
      </View>

      {/* Complaints — clickable */}
      <SectionTitle
        left="Complaints"
        right="View All"
        onRight={() => navigation.getParent()?.navigate("Complaints")}
      />
      <ListCard empty={!loading && data.complaints.length === 0} emptyLabel="No complaints found.">
        {loading ? <LoadingRow /> : data.complaints.map((c, i) => (
          <ComplaintItem
            key={c._id || i} complaint={c} index={i} total={data.complaints.length}
            onPress={() => navigation.navigate("ComplaintDetail", { complaint: c })}
          />
        ))}
      </ListCard>

      {/* Inspectors — view only */}
      <SectionTitle left="Inspectors" right="View All" onRight={() => navigation.navigate("InspectorsList")} />
      <ListCard empty={!loading && data.inspectors.length === 0} emptyLabel="No inspectors assigned.">
        {loading ? <LoadingRow /> : data.inspectors.map((ins, i) => (
          <InfoItem
            key={ins._id || i} index={i} total={data.inspectors.length}
            icon="account-tie" iconColor="#0891B2" iconBg="#CFFAFE"
            primary={ins.name || ins.email || "Inspector"}
            secondary={ins.ward_name ? `Ward: ${ins.ward_name}` : ins.email}
            badge={ins.status ?? "Active"} badgeColor="#059669" badgeBg="#D1FAE5"
          />
        ))}
      </ListCard>

      {/* Workers — view only */}
      <SectionTitle left="Workers" right="View All" onRight={() => navigation.navigate("WorkersList")} />
      <ListCard empty={!loading && data.workers.length === 0} emptyLabel="No workers assigned.">
        {loading ? <LoadingRow /> : data.workers.map((w, i) => (
          <InfoItem
            key={w._id || i} index={i} total={data.workers.length}
            icon="account-hard-hat" iconColor="#059669" iconBg="#D1FAE5"
            primary={w.name || w.email || "Worker"}
            secondary={w.ward_name ? `Ward: ${w.ward_name}` : w.email}
            badge={w.active_tasks != null ? `${w.active_tasks} tasks` : undefined}
            badgeColor={COLORS.primary} badgeBg="#DBEAFE"
          />
        ))}
      </ListCard>

      {/* Wards — view only */}
      <SectionTitle left="Wards" right="View All" onRight={() => navigation.navigate("WardsList")} />
      <ListCard empty={!loading && data.wards.length === 0} emptyLabel="No wards found.">
        {loading ? <LoadingRow /> : data.wards.map((w, i) => (
          <InfoItem
            key={w._id || i} index={i} total={data.wards.length}
            icon="map-marker-radius" iconColor={COLORS.primary} iconBg="#DBEAFE"
            primary={w.ward_name || w.name || "Ward"}
            secondary={w.zone ?? w.area ?? undefined}
            badge={w.complaint_count != null ? `${w.complaint_count} complaints` : undefined}
            badgeColor="#D97706" badgeBg="#FEF3C7"
          />
        ))}
      </ListCard>

      {/* District Users — view only */}
      <SectionTitle left="District Users" right="View All" onRight={() => navigation.navigate("UsersList")} />
      <ListCard empty={!loading && data.users.length === 0} emptyLabel="No users found.">
        {loading ? <LoadingRow /> : data.users.map((u, i) => (
          <InfoItem
            key={u._id || i} index={i} total={data.users.length}
            icon="account-outline" iconColor="#7C3AED" iconBg="#EDE9FE"
            primary={u.name || u.email || "User"}
            secondary={u.email}
            badge={u.role} badgeColor="#7C3AED" badgeBg="#EDE9FE"
          />
        ))}
      </ListCard>
    </>
  );
};

// 3. INSPECTOR
const InspectorDashboard = ({ navigation, meData, user }) => {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers]       = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [compRes, workerRes] = await Promise.all([
        authService.getWardComplaints?.()  ?? Promise.resolve([]),
        authService.getWardWorkers?.()     ?? Promise.resolve([]),
      ]);
      setComplaints(getItems(compRes));
      setWorkers(getItems(workerRes).slice(0, 10));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const counts = useMemo(() => ({
    open:     complaints.filter((c) => c.status === "OPEN").length,
    working:  complaints.filter((c) => c.status === "WORKING").length,
    review:   complaints.filter((c) => c.status === "APPROVAL").length,
    closed:   complaints.filter((c) => c.status === "CLOSED").length,
  }), [complaints]);

  const metrics = [
    { icon: "alert-circle-outline",  value: counts.open,    label: "Open",        color: "#D97706", bg: "#FEF3C7" },
    { icon: "progress-wrench",       value: counts.working, label: "In Progress", color: COLORS.primary, bg: "#DBEAFE" },
    { icon: "eye-check-outline",     value: counts.review,  label: "In Review",   color: "#0891B2", bg: "#CFFAFE" },
    { icon: "check-circle-outline",  value: counts.closed,  label: "Resolved",    color: "#059669", bg: "#D1FAE5" },
  ];

  const profileStats = [
    { value: complaints.length,  label: "Total"    },
    { value: counts.open,        label: "Open"     },
    { value: counts.closed,      label: "Resolved" },
  ];

  return (
    <>
      <UserProfileCard meData={meData} user={user} stats={profileStats} />

      <SectionTitle left="Ward Overview" />
      <View style={{ flexDirection: "row", gap: SPACING.sm, flexWrap: "wrap" }}>
        {metrics.map((m, i) => (
          <View key={i} style={{ width: "47.5%" }}><MetricCard {...m} /></View>
        ))}
      </View>

      {/* Ward Complaints — clickable + assignable */}
      <SectionTitle
        left="Ward Complaints"
        right="View All"
        onRight={() => navigation.getParent()?.navigate("Complaints")}
      />
      <ListCard empty={!loading && complaints.length === 0} emptyLabel="No complaints in your ward.">
        {loading ? (
          <View style={{ padding: SPACING.lg }}><ActivityIndicator color={COLORS.primary} /></View>
        ) : (
          complaints.slice(0, 5).map((c, i, arr) => (
            <ComplaintItem
              key={c._id || i} complaint={c} index={i} total={arr.length}
              onPress={() => navigation.navigate("ComplaintDetail", { complaint: c, canAssign: true, workers })}
            />
          ))
        )}
      </ListCard>

      {/* Workers in ward — view only but shown in bottom tab */}
      <SectionTitle left="My Ward Workers" right="View All" onRight={() => navigation.navigate("WorkersList")} />
      <ListCard empty={!loading && workers.length === 0} emptyLabel="No workers in your ward.">
        {loading ? (
          <View style={{ padding: SPACING.lg }}><ActivityIndicator color={COLORS.primary} /></View>
        ) : (
          workers.map((w, i) => (
            <InfoItem
              key={w._id || i} index={i} total={workers.length}
              icon="account-hard-hat" iconColor="#059669" iconBg="#D1FAE5"
              primary={w.name || w.email || "Worker"}
              secondary={w.email}
              badge={w.active_tasks != null ? `${w.active_tasks} tasks` : "Available"}
              badgeColor={w.active_tasks > 0 ? "#D97706" : "#059669"}
              badgeBg={w.active_tasks > 0 ? "#FEF3C7" : "#D1FAE5"}
            />
          ))
        )}
      </ListCard>
    </>
  );
};

// 4. WORKER
const WorkerDashboard = ({ navigation, meData, user }) => {
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await authService.getAssignedComplaints?.() ?? Promise.resolve([]);
      setAssigned(getItems(res));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const counts = useMemo(() => ({
    open:    assigned.filter((c) => c.status === "OPEN").length,
    working: assigned.filter((c) => c.status === "WORKING").length,
    closed:  assigned.filter((c) => c.status === "CLOSED").length,
  }), [assigned]);

  const metrics = [
    { icon: "clipboard-alert-outline", value: assigned.length, label: "Assigned",    color: COLORS.primary, bg: "#DBEAFE" },
    { icon: "progress-wrench",         value: counts.working,  label: "In Progress", color: "#D97706",      bg: "#FEF3C7" },
    { icon: "check-circle-outline",    value: counts.closed,   label: "Completed",   color: "#059669",      bg: "#D1FAE5" },
  ];

  const profileStats = [
    { value: assigned.length, label: "Assigned" },
    { value: counts.working,  label: "Active"   },
    { value: counts.closed,   label: "Done"     },
  ];

  return (
    <>
      <UserProfileCard meData={meData} user={user} stats={profileStats} />

      <SectionTitle left="My Tasks" />
      <View style={{ flexDirection: "row", gap: SPACING.sm }}>
        {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
      </View>

      <SectionTitle
        left="Assigned Complaints"
        right="View All"
        onRight={() => navigation.getParent()?.navigate("Complaints")}
      />
      <ListCard empty={!loading && assigned.length === 0} emptyLabel="No tasks assigned yet.">
        {loading ? (
          <View style={{ padding: SPACING.lg }}><ActivityIndicator color={COLORS.primary} /></View>
        ) : (
          assigned.map((c, i) => (
            <ComplaintItem
              key={c._id || i} complaint={c} index={i} total={assigned.length}
              onPress={() => navigation.navigate("ComplaintDetail", { complaint: c, workerView: true })}
            />
          ))
        )}
      </ListCard>
    </>
  );
};

// 5. CITIZEN (original but slightly polished)
const CitizenDashboard = ({ navigation, meData, user }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await authService.getComplaints?.() ?? Promise.resolve([]);
      setComplaints(getItems(res).slice(0, 5));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const counts = useMemo(() => ({
    open:   complaints.filter((c) => c.status === "OPEN").length,
    active: complaints.filter((c) => ["WORKING","APPROVAL"].includes(c.status)).length,
    closed: complaints.filter((c) => c.status === "CLOSED").length,
  }), [complaints]);

  const profileStats = [
    { value: counts.open,   label: "Pending"  },
    { value: counts.active, label: "Active"   },
    { value: counts.closed, label: "Resolved" },
  ];

  const quickActions = [
    { icon: "flask-outline",       title: "Raise\nComplaint",  color: COLORS.secondary, onPress: () => navigation.navigate("CreateComplaint") },
    { icon: "magnify",             title: "Track\nStatus",     color: COLORS.primary,   onPress: () => navigation.getParent()?.navigate("Complaints") },
    { icon: "map-marker-outline",  title: "Nearby\nOffices",   color: COLORS.primary,   onPress: () => {} },
    { icon: "bell-outline",        title: "Notifications",     color: COLORS.darkBg,    onPress: () => navigation.getParent()?.navigate("Profile") },
  ];

  return (
    <>
      <UserProfileCard meData={meData} user={user} stats={profileStats} />

      <SectionTitle left="Quick Actions" />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {quickActions.map((a, i) => <QuickActionBtn key={i} {...a} />)}
      </View>

      <SectionTitle
        left="My Complaints"
        right="View All"
        onRight={() => navigation.getParent()?.navigate("Complaints")}
      />
      <ListCard empty={!loading && complaints.length === 0} emptyLabel={"No complaints yet.\nTap 'Raise Complaint' to get started."}>
        {loading ? (
          <View style={{ padding: SPACING.lg }}><ActivityIndicator color={COLORS.primary} /></View>
        ) : (
          complaints.map((c, i) => (
            <ComplaintItem
              key={c._id || i} complaint={c} index={i} total={complaints.length}
              onPress={() => navigation.navigate("ComplaintDetail", { complaint: c })}
            />
          ))
        )}
      </ListCard>
    </>
  );
};

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export const DashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [meData, setMeData]     = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { loadMe(); }, []);

  const loadMe = async () => {
    try {
      const res = await authService.getMe?.();
      setMeData(res?.data ?? null);
    } catch (e) { console.error("getMe failed:", e); }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMe();
    setRefreshKey((k) => k + 1); // triggers child re-mount
    setRefreshing(false);
  };

  const role = meData?.role ?? user?.role ?? "CITIZEN";
  const gradient = ROLE_GRADIENT[role] ?? ROLE_GRADIENT.CITIZEN;

  // Role label for greeting
  const roleGreeting = {
    SUPER_ADMIN:    "Super Admin Panel",
    DISTRICT_ADMIN: "District Admin Panel",
    INSPECTOR:      "Inspector Dashboard",
    WORKER:         "Worker Dashboard",
    CITIZEN:        "Citizen Platform",
  }[role] ?? "Civifix";

  const RoleDashboard = useCallback(() => {
    const props = { navigation, meData, user, key: refreshKey };
    switch (role) {
      case "SUPER_ADMIN":    return <SuperAdminDashboard    {...props} />;
      case "DISTRICT_ADMIN": return <DistrictAdminDashboard {...props} />;
      case "INSPECTOR":      return <InspectorDashboard     {...props} />;
      case "WORKER":         return <WorkerDashboard         {...props} />;
      default:               return <CitizenDashboard        {...props} />;
    }
  }, [role, refreshKey, meData]);

  return (
    <Screen
      scroll={false}
      backgroundColor={COLORS.background}
      maxWidth={430}
      contentStyle={{ flex: 1, paddingHorizontal: 0, paddingTop: 0 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: SPACING.xxl + 18 }}
      >
        {/* ── Gradient header ── */}
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: SPACING.lg,
            paddingTop: SPACING.xxl,
            paddingBottom: 70,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: "rgba(255,255,255,0.18)",
                alignItems: "center", justifyContent: "center", marginRight: SPACING.sm,
              }}>
                <Icon name="city-variant-outline" size={21} color={COLORS.card} />
              </View>
              <View>
                <Text style={{ color: COLORS.card, fontSize: FONT_SIZES.xl, fontWeight: "800" }}>Civifix</Text>
                <Text style={{ color: COLORS.card, fontSize: FONT_SIZES.xs, opacity: 0.92 }}>{roleGreeting}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.getParent()?.navigate("Profile")}
              style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" }}
            >
              <Icon name="bell-outline" size={22} color={COLORS.card} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ── Role-based content ── */}
        <View style={{ paddingHorizontal: SPACING.lg, marginTop: -50 }}>
          <RoleDashboard />
        </View>
      </ScrollView>
    </Screen>
  );
};

export default DashboardScreen;