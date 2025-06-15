import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

const Stack = createStackNavigator();

// Restaurant data
const restaurants = [
  {
    id: 1,
    title: "Joe's Gelato",
    tagline: "Desert, Ice cream, £££",
    eta: "10-30",
    imgUri: {
      uri: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=60",
    },
    menu: [
      {
        title: "Gelato",
        contents: [
          { title: "Vanilla" },
          { title: "Chocolate" },
          { title: "Strawberry" },
        ],
      },
      {
        title: "Drinks",
        contents: [{ title: "Espresso" }, { title: "Water" }],
      },
    ],
  },
  {
    id: 2,
    title: "Joe's Diner",
    tagline: "American, burgers, ££",
    eta: "50+",
    imgUri: {
      uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60",
    },
    menu: [
      {
        title: "Burgers",
        contents: [
          { title: "Classic Burger" },
          { title: "Cheese Burger" },
          { title: "Veggie Burger" },
        ],
      },
      {
        title: "Sides",
        contents: [{ title: "Fries" }, { title: "Onion Rings" }],
      },
      {
        title: "Drinks",
        contents: [{ title: "Cola" }, { title: "Milkshake" }],
      },
    ],
  },
];

const HomeScreenCell = ({ title, tagline, eta, imgUri, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.cell} activeOpacity={0.7}>
    <View style={styles.cellContentView}>
      <Image source={imgUri} style={styles.headerImage} />
      <View style={styles.etaBadge}>
        <Text style={styles.etaText}>{eta} mins</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.tagline}>{tagline}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cell: {
    height: 290,
    backgroundColor: "transparent",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  cellContentView: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  etaBadge: {
    position: "absolute",
    right: 16,
    top: 150,
    backgroundColor: "white",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  etaText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  cardInfo: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 4,
  },
  tagline: {
    color: "#888",
    fontSize: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
  },
});

function HomeScreen({ navigation }) {
  return (
    <ScrollView style={{ backgroundColor: "#f5f5f5" }}>
      <View style={styles.section}>
        {restaurants.map((restaurant) => (
          <HomeScreenCell
            key={restaurant.id}
            title={restaurant.title}
            tagline={restaurant.tagline}
            eta={restaurant.eta}
            imgUri={restaurant.imgUri}
            onPress={() =>
              navigation.navigate("Menu", { items: restaurant.menu })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}

function MenuScreen({ route }) {
  const { items = [] } = route.params || {};
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      {items.map((section, idx) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.sectionHeader}>{section.title}</Text>
          {section.contents.map((item, i) => (
            <View key={i} style={styles.menuItem}>
              <Text>{item.title}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

export default function FoodApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Restaurants" component={HomeScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
