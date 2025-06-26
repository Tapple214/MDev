import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Cell, Section, TableView } from "react-native-tableview-simple";
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
    imgUri: require("./assets/ice-cream-header.jpg"),
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
    imgUri: require("./assets/burger-header.jpg"),
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
  {
    id: 3,
    title: "Tita's Kitchen",
    tagline: "Filipino, Traditional, ££",
    eta: "25-45",
    imgUri: require("./assets/lechon-header.jpg"),
    menu: [
      {
        title: "Main Dishes",
        contents: [
          { title: "Adobo" },
          { title: "Sinigang" },
          { title: "Kare-kare" },
          { title: "Lechon Kawali" },
        ],
      },
      {
        title: "Rice & Noodles",
        contents: [
          { title: "Garlic Rice" },
          { title: "Pancit Canton" },
          { title: "Chicken Arroz Caldo" },
        ],
      },
      {
        title: "Desserts",
        contents: [
          { title: "Halo-halo" },
          { title: "Leche Flan" },
          { title: "Bibingka" },
        ],
      },
      {
        title: "Drinks",
        contents: [
          { title: "Calamansi Juice" },
          { title: "Buko Juice" },
          { title: "Sago't Gulaman" },
        ],
      },
    ],
  },
];

// Cell content view component
const HomeScreenCell = ({
  title,
  tagline,
  eta,
  imgUri,
  action,
  height = 290,
  backgroundColor = "transparent",
  highlightColor = "#ccc",
  ...props
}) => {
  console.log("Image URI:", imgUri);
  return (
    <TouchableOpacity
      onPress={action}
      style={[styles.cell, { height, backgroundColor }]}
      activeOpacity={0.7}
      underlayColor={highlightColor}
      {...props}
    >
      <View style={styles.cellContentView}>
        <Image
          source={imgUri}
          style={styles.headerImage}
          onError={(error) => console.log("Image loading error:", error)}
          onLoad={() => console.log("Image loaded successfully")}
          resizeMode="cover"
        />
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
};

const styles = StyleSheet.create({
  cell: {
    height: 290,
    marginBottom: 16,
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
});

function HomeScreen({ navigation }) {
  return (
    <ScrollView style={{ paddingHorizontal: 16 }}>
      <View style={{ paddingTop: 16 }}>
        {restaurants.map((restaurant) => (
          <HomeScreenCell
            key={restaurant.id}
            title={restaurant.title}
            tagline={restaurant.tagline}
            eta={restaurant.eta}
            imgUri={restaurant.imgUri}
            action={() =>
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
    <ScrollView>
      <TableView>
        {items.map((section, idx) => (
          <Section key={idx} header={section.title}>
            {section.contents.map((item, i) => (
              <Cell key={i} title={item.title} />
            ))}
          </Section>
        ))}
      </TableView>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Restaurants" component={HomeScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
