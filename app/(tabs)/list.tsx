import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import * as SplashScreen from "expo-splash-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";

SplashScreen.preventAutoHideAsync();

const vouchers = Array(10).fill({
  id: "ATK-008-2023",
  recipient: "Kyle Howard Senoy",
  email: "kyle@example.com",
  status: "UNCLAIMED",
});

const list = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });

  async function fetchData() {
    // Fetch voucher data
    let { data: releasedvouchers, error } = await supabase
        .from('ReleasedVoucher')
        .select('Status');

    if (error) {
        console.log("Error fetching vouchers: " + error.message);
        return;
    }

    console.log("Vouchers fetched successfully:", releasedvouchers);

    let { data: personalInfos, error1 } = await supabase
        .from('Customers')
        .select('FirstName, LastName, Email, ContactNumber');

    if (error) {
        console.log("Error fetching vouchers: " + error1.message);
        return;
    }

    console.log("Vouchers fetched successfully:", personalInfos);

    let { data: voucher, error2 } = await supabase
        .from('Vouchers')
        .select('id');

    if (error) {
        console.log("Error fetching vouchers: " + error2.message);
        return;
    }

    console.log("Vouchers fetched successfully:", voucher);
    
  }

  useEffect(() => {
    fetchData();

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient colors={["#63120E", "#4A0707"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={require("../../assets/images/logo2.png")}
            style={styles.logo}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>AtletiKode</Text>
            <Text style={styles.headerSubtitle}>
              UP Mindanao Atletika's Voucher Management System
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Distributed Vouchers Heading */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Distributed Vouchers</Text>
      </View>

      <View style={styles.horizontalLine} />

      {/* Statistics Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>333</Text>
          <Text style={styles.statLabel}>Unclaimed Vouchers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>333</Text>
          <Text style={styles.statLabel}>Claimed Vouchers</Text>
        </View>
      </View>

      <View style={styles.horizontalLine} />

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Voucher ID</Text>
        <Text style={styles.tableHeaderText}>Recipient</Text>
        <Text style={styles.tableHeaderText}>Email</Text>
        <Text style={styles.tableHeaderText}>Status</Text>
        <AntDesign
          name="setting"
          size={20}
          color="#13390B"
          style={styles.tableHeaderIcon}
        />
      </View>

      <View style={styles.horizontalLine} />

      {/* Voucher List */}
      <FlatList
        data={vouchers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.id}</Text>
            <Text style={styles.tableCell}>{item.recipient}</Text>
            <Text style={styles.tableCell}>{item.email}</Text>
            <Text style={[styles.tableCell, styles.status]}>{item.status}</Text>
            <Feather
              name="edit"
              size={16}
              color="#13390B"
              style={styles.tableIcon}
              onPress={() =>
                router.push({
                  pathname: "/editVoucher",
                  params: {
                    id: item.id,
                    recipient: item.recipient,
                    email: item.email,
                    status: item.status,
                  },
                })
              }
            />
          </View>
        )}
      />
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  header: {
    height: height * 0.14,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    paddingRight: 50,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: width * 0.12,
    height: width * 0.12,
    marginRight: 10,
  },
  headerTextContainer: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: width * 0.05,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.42,
  },
  headerSubtitle: {
    fontSize: width * 0.03,
    color: "#fff",
    fontFamily: "Manrope_400Regular",
    letterSpacing: -0.42,
  },
  sectionTitleContainer: {
    padding: 14,
    alignSelf: "flex-start",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#F8F8F8",
    marginTop: -30,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#13390B",
    textAlign: "left",
    marginLeft: 4,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.6,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  statBox: { alignItems: "center", backgroundColor: "#F8F8F8" },
  statNumber: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#13390B",
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.42,
  },
  statLabel: {
    fontSize: width * 0.035,
    color: "#13390B",
    fontFamily: "Manrope_400Regular",
    letterSpacing: -0.42,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 8,
    backgroundColor: "#F8F8F8",
    width: "92%",
    alignSelf: "center",
  },
  tableIcon: {
    marginLeft: 4,
  },
  tableHeaderIcon: {
    marginLeft: 0,
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: width * 0.035,
    flex: 1,
    textAlign: "center",
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.4,
    color: "#13390B",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#13390B",
    width: "92%",
    alignSelf: "center",
  },
  tableCell: {
    fontSize: width * 0.028,
    flex: 1,
    textAlign: "center",
    fontFamily: "Manrope_400Regular",
    color: "#13390B",
  },
  status: {
    color: "#13390B",
    fontWeight: "bold",
    fontFamily: "Manrope_700Bold",
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#13390B",
    width: "92%",
    alignSelf: "center",
    marginVertical: 0,
  },
});

export default list;
