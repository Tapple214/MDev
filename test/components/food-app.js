import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

// Restaurant data
const restaurants = [
  {
    id: 1,
    title: "Joe's Gelato",
    tagline: "Desert, Ice cream, £££",
    eta: "10-30",
    menu: [
      {
        title: "Gelato",
        items: ["Vanilla", "Chocolate", "Strawberry"],
      },
      {
        title: "Drinks",
        items: ["Espresso", "Water"],
      },
    ],
  },
  {
    id: 2,
    title: "Joe's Diner",
    tagline: "American, burgers, ££",
    eta: "50+",
    menu: [
      {
        title: "Burgers",
        items: ["Classic Burger", "Cheese Burger", "Veggie Burger"],
      },
      {
        title: "Sides",
        items: ["Fries", "Onion Rings"],
      },
      {
        title: "Drinks",
        items: ["Cola", "Milkshake"],
      },
    ],
  },
];

const RestaurantCard = ({ restaurant, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.etaBadge}>
        <Text style={styles.etaText}>{restaurant.eta} mins</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.title}>{restaurant.title}</Text>
        <Text style={styles.tagline}>{restaurant.tagline}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardInfo: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: "#e0e0e0",
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
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 4,
  },
  tagline: {
    color: "#888",
    fontSize: 16,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuSection: {
    marginBottom: 16,
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
});

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView style={{ backgroundColor: "#f5f5f5" }}>
      <View style={{ paddingVertical: 8 }}>
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onPress={() =>
              navigation.navigate("Menu", { menu: restaurant.menu })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}

function MenuScreen({ route }) {
  const { menu = [] } = route.params || {};
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      {menu.map((section, idx) => (
        <View key={idx} style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{section.title}</Text>
          {section.items.map((item, i) => (
            <View key={i} style={styles.menuItem}>
              <Text>{item}</Text>
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
