import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";

// START
// Set up navigation stack
const Stack = createStackNavigator();
const { width } = Dimensions.get("window");

// Helper function to safely load images
const safeRequireImage = (imagePath) => {
  try {
    return require(imagePath);
  } catch (error) {
    console.warn(`Failed to load image: ${imagePath}`, error);
    return null;
  }
};

// Skeleton loading component
const SkeletonLoader = ({ width, height, style }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: "#E1E9EE",
          opacity,
        },
        style,
      ]}
    />
  );
};

// Image component with skeleton loading
const ImageWithSkeleton = ({ source, style, resizeMode = "cover" }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Handle cases where source might be invalid or undefined
  if (!source || imageError) {
    return (
      <SkeletonLoader
        width={style?.width || "100%"}
        height={style?.height || 200}
        style={style}
      />
    );
  }

  return (
    <View style={style}>
      {imageLoading && (
        <SkeletonLoader
          width="100%"
          height="100%"
          style={[
            StyleSheet.absoluteFillObject,
            { borderRadius: style?.borderRadius || 0 },
          ]}
        />
      )}
      <Image
        source={source}
        style={[style, imageLoading && { opacity: 0 }]}
        resizeMode={resizeMode}
        onLoad={handleImageLoad}
        onError={handleImageError}
        defaultSource={null}
      />
    </View>
  );
};

// Resaurant and menu data that will be mapped through
const restaurants = [
  // END
  {
    id: 1,
    title: "Joe's Gelato",
    tagline: "Dessert, Ice cream, £££",
    eta: "10-30",
    rating: 4.8,
    imgUri: safeRequireImage("./assets/ice-cream-header.jpg"),
    menu: [
      {
        title: "Gelato",
        contents: [
          {
            title: "Vanilla Bean",
            price: "£4.50",
            image: safeRequireImage("./assets/ice-cream-header.jpg"),
            inStock: true,
            description: "Classic vanilla with real vanilla beans",
          },
          {
            title: "Chocolate Fudge",
            price: "£4.50",
            image: safeRequireImage("./assets/ice-cream-header.jpg"),
            inStock: true,
            description: "Rich chocolate with fudge pieces",
          },
          {
            title: "Strawberry",
            price: "£4.50",
            image: safeRequireImage("./assets/ice-cream-header.jpg"),
            inStock: false,
            description: "Fresh strawberry gelato",
          },
        ],
      },
      {
        title: "Drinks",
        contents: [
          {
            title: "Espresso",
            price: "£2.50",
            image: safeRequireImage("./assets/ice-cream-header.jpg"),
            inStock: true,
            description: "Single shot of premium coffee",
          },
          {
            title: "Sparkling Water",
            price: "£1.50",
            image: safeRequireImage("./assets/ice-cream-header.jpg"),
            inStock: true,
            description: "Refreshing sparkling water",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Joe's Diner",
    tagline: "American, Burgers, ££",
    eta: "25-45",
    rating: 4.6,
    imgUri: safeRequireImage("./assets/burger-header.jpg"),
    menu: [
      {
        title: "Burgers",
        contents: [
          {
            title: "Classic Burger",
            price: "£12.99",
            image: safeRequireImage("./assets/burger-header.jpg"),
            inStock: true,
            description: "Beef patty with lettuce, tomato, and special sauce",
          },
          {
            title: "Cheese Burger",
            price: "£14.99",
            image: safeRequireImage("./assets/burger-header.jpg"),
            inStock: true,
            description: "Classic burger with melted cheddar cheese",
          },
          {
            title: "Veggie Burger",
            price: "£13.99",
            image: safeRequireImage("./assets/burger-header.jpg"),
            inStock: false,
            description: "Plant-based patty with fresh vegetables",
          },
        ],
      },
      {
        title: "Sides",
        contents: [
          {
            title: "Crispy Fries",
            price: "£4.99",
            image: safeRequireImage("./assets/burger-header.jpg"),
            inStock: true,
            description: "Golden crispy french fries",
          },
          {
            title: "Onion Rings",
            price: "£5.99",
            image: safeRequireImage("./assets/burger-header.jpg"),
            inStock: true,
            description: "Beer-battered onion rings",
          },
        ],
      },
      {
        title: "Drinks",
        contents: [
          {
            title: "Classic Cola",
            price: "£2.99",
            image: safeRequireImage("./assets/burger-header.jpg"),
            inStock: true,
            description: "Refreshing cola drink",
          },
          {
            title: "Chocolate Milkshake",
            price: "£4.99",
            image: safeRequireImage("./assets/burger-header.jpg"),
            inStock: true,
            description: "Thick and creamy chocolate milkshake",
          },
        ],
      },
    ],
  },
  // START
  {
    id: 3,
    title: "Tita's Kitchen",
    tagline: "Filipino, Traditional, ££",
    eta: "25-45",
    rating: 4.9,
    imgUri: safeRequireImage("./assets/lechon-header.jpg"),
    menu: [
      {
        title: "Main Dishes",
        contents: [
          {
            title: "Chicken Adobo",
            price: "£15.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: true,
            description: "Tender chicken braised in soy sauce and vinegar",
          },
          {
            title: "Sinigang na Baboy",
            price: "£16.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: true,
            description: "Sour tamarind soup with pork and vegetables",
          },
          {
            title: "Kare-kare",
            price: "£17.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: false,
            description: "Peanut stew with oxtail and vegetables",
          },
          {
            title: "Lechon Kawali",
            price: "£18.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: true,
            description: "Crispy fried pork belly",
          },
        ],
      },
      {
        title: "Rice & Noodles",
        contents: [
          {
            title: "Garlic Rice",
            price: "£3.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: true,
            description: "Fragrant rice cooked with garlic",
          },
          {
            title: "Pancit Canton",
            price: "£12.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: true,
            description: "Stir-fried noodles with vegetables and meat",
          },
          {
            title: "Chicken Arroz Caldo",
            price: "£11.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: true,
            description: "Chicken rice porridge with ginger",
          },
        ],
      },
      {
        title: "Desserts",
        contents: [
          {
            title: "Halo-halo",
            price: "£6.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: true,
            description: "Mixed dessert with shaved ice and sweet beans",
          },
          {
            title: "Leche Flan",
            price: "£5.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: true,
            description: "Creamy caramel custard",
          },
          {
            title: "Bibingka",
            price: "£4.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: false,
            description: "Traditional rice cake with coconut",
          },
        ],
      },
      {
        title: "Drinks",
        contents: [
          {
            title: "Calamansi Juice",
            price: "£3.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: true,
            description: "Refreshing citrus juice",
          },
          {
            title: "Buko Juice",
            price: "£4.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: true,
            description: "Fresh young coconut juice",
          },
          {
            title: "Sago't Gulaman",
            price: "£3.99",
            image: safeRequireImage("./assets/lechon-header.jpg"),
            inStock: true,
            description: "Sweet drink with tapioca pearls and jelly",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Fuji Sushi",
    tagline: "Japanese, Sushi, £££",
    eta: "20-35",
    rating: 4.7,
    imgUri: safeRequireImage("./assets/sushi-header.jpg"),
    menu: [
      {
        title: "Sushi Rolls",
        contents: [
          {
            title: "California Roll",
            price: "£8.99",
            image: safeRequireImage("./assets/sushi-header.jpg"),
            inStock: true,
            description: "Crab, avocado, and cucumber roll",
          },
          {
            title: "Spicy Tuna Roll",
            price: "£9.99",
            image: safeRequireImage("./assets/sushi-header.jpg"),
            inStock: true,
            description: "Spicy tuna with cucumber",
          },
          {
            title: "Dragon Roll",
            price: "£12.99",
            image: safeRequireImage("./assets/sushi-header.jpg"),
            inStock: false,
            description: "Eel and avocado topped with tempura shrimp",
          },
        ],
      },
      {
        title: "Nigiri",
        contents: [
          {
            title: "Salmon Nigiri",
            price: "£3.50",
            image: safeRequireImage("./assets/sushi-header.jpg"),
            inStock: true,
            description: "Fresh salmon over seasoned rice",
          },
          {
            title: "Tuna Nigiri",
            price: "£3.50",
            image: safeRequireImage("./assets/sushi-header.jpg"),
            inStock: true,
            description: "Premium tuna over seasoned rice",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Pizza Palace",
    tagline: "Italian, Pizza, ££",
    eta: "30-50",
    rating: 4.5,
    imgUri: safeRequireImage("./assets/pizza-header.jpg"),
    menu: [
      {
        title: "Pizzas",
        contents: [
          {
            title: "Margherita",
            price: "£14.99",
            image: safeRequireImage("./assets/pizza-header.jpg"),
            inStock: true,
            description: "Classic tomato sauce, mozzarella, and basil",
          },
          {
            title: "Pepperoni",
            price: "£16.99",
            image: safeRequireImage("./assets/pizza-header.jpg"),
            inStock: true,
            description: "Spicy pepperoni with melted cheese",
          },
          {
            title: "Quattro Formaggi",
            price: "£18.99",
            image: safeRequireImage("./assets/pizza-header.jpg"),
            inStock: false,
            description: "Four cheese blend pizza",
          },
        ],
      },
      {
        title: "Pasta",
        contents: [
          {
            title: "Spaghetti Carbonara",
            price: "£12.99",
            image: safeRequireImage("./assets/pizza-header.jpg"),
            inStock: true,
            description: "Creamy pasta with pancetta and parmesan",
          },
          {
            title: "Penne Arrabbiata",
            price: "£11.99",
            image: safeRequireImage("./assets/pizza-header.jpg"),
            inStock: true,
            description: "Spicy tomato sauce with garlic and chili",
          },
        ],
      },
    ],
  },
];

// Card component for each restaurant on the home screen
const HomeScreenCell = ({
  title,
  tagline,
  eta,
  rating,
  imgUri,
  action,
  height = 320,
  backgroundColor = "transparent",
  highlightColor = "#ccc",
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={action}
      style={[styles.cell, { height, backgroundColor }]}
      activeOpacity={0.7}
      underlayColor={highlightColor}
      {...props}
    >
      <View style={styles.cellContentView}>
        {/* Restaurant header image */}
        <ImageWithSkeleton
          source={imgUri}
          style={styles.headerImage}
          resizeMode="cover"
        />
        {/* Delivery time badge */}
        <View style={styles.etaBadge}>
          <Text style={styles.etaText}>{eta} mins</Text>
        </View>
        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {rating}</Text>
        </View>
        {/* Restaurant name and tagline */}
        <View style={styles.cardInfo}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.tagline}>{tagline}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Menu item component
const MenuItem = ({ item, onPress }) => {
  // Handle press: show alert if out of stock, otherwise call onPress
  const handlePress = () => {
    if (!item.inStock) {
      Alert.alert("Out of Stock", "This item is currently unavailable.");
      return;
    }
    onPress(item);
  };

  return (
    <TouchableOpacity
      style={[styles.menuItem, !item.inStock && styles.menuItemDisabled]}
      onPress={handlePress}
      disabled={!item.inStock}
    >
      {/* Menu item image */}
      <ImageWithSkeleton
        source={item.image}
        style={styles.menuItemImage}
        resizeMode="cover"
      />
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemHeader}>
          {/* Menu item name */}
          <Text
            style={[
              styles.menuItemTitle,
              !item.inStock && styles.menuItemTitleDisabled,
            ]}
          >
            {item.title}
          </Text>
          {/* Menu item price */}
          <Text
            style={[
              styles.menuItemPrice,
              !item.inStock && styles.menuItemPriceDisabled,
            ]}
          >
            {item.price}
          </Text>
        </View>
        {/* Menu item description */}
        <Text
          style={[
            styles.menuItemDescription,
            !item.inStock && styles.menuItemDescriptionDisabled,
          ]}
        >
          {item.description}
        </Text>
        {/* Out of stock badge */}
        {!item.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    height: 320,
    marginBottom: 20,
  },
  cellContentView: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: 200,
    borderRadius: 0,
  },
  etaBadge: {
    position: "absolute",
    right: 16,
    top: 160,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1,
  },
  etaText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
  },
  ratingBadge: {
    position: "absolute",
    left: 16,
    top: 160,
    backgroundColor: "#FFD700",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1,
  },
  ratingText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  cardInfo: {
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 4,
    color: "#333",
  },
  tagline: {
    color: "#666",
    fontSize: 16,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
    justifyContent: "center",
  },
  menuItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  menuItemTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
    flex: 1,
  },
  menuItemTitleDisabled: {
    color: "#999",
  },
  menuItemPrice: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#4CAF50",
  },
  menuItemPriceDisabled: {
    color: "#999",
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  menuItemDescriptionDisabled: {
    color: "#999",
  },
  outOfStockBadge: {
    backgroundColor: "#FF5252",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  outOfStockText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionHeader: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

// Shows restaurants available
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Status bar styling */}
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView style={{ paddingHorizontal: 16 }}>
        <View style={{ paddingTop: 20, paddingBottom: 20 }}>
          {/* App title and subtitle */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#333",
              marginBottom: 8,
            }}
          >
            Food Delivery
          </Text>
          <Text style={{ fontSize: 16, color: "#666", marginBottom: 20 }}>
            Discover amazing restaurants near you
          </Text>
          {/* Render all restaurants */}
          {restaurants.map((restaurant) => (
            <HomeScreenCell
              key={restaurant.id}
              title={restaurant.title}
              tagline={restaurant.tagline}
              eta={restaurant.eta}
              rating={restaurant.rating}
              imgUri={restaurant.imgUri}
              action={() =>
                navigation.navigate("Menu", {
                  items: restaurant.menu,
                  restaurantName: restaurant.title,
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Shows the menu for a selected restaurant
function MenuScreen({ route, navigation }) {
  // Get menu items and restaurant name from navigation params
  const { items = [], restaurantName = "Restaurant" } = route.params || {};

  // Handle menu item press: show add-to-cart dialog
  const handleMenuItemPress = (item) => {
    Alert.alert(
      "Add to Cart",
      `Would you like to add "${item.title}" to your cart for ${item.price}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Add to Cart",
          onPress: () => {
            Alert.alert(
              "Success",
              `${item.title} has been added to your cart!`
            );
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Status bar styling */}
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView>
        {/* Render each menu section and its items */}
        {items.map((section, idx) => (
          <View key={idx}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
            {section.contents.map((item, i) => (
              <MenuItem key={i} item={item} onPress={handleMenuItemPress} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// Main app component with navigation setup
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4CAF50",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {/* Home screen: list of restaurants */}
        <Stack.Screen
          name="Restaurants"
          component={HomeScreen}
          options={{ title: "Food Delivery" }}
        />
        {/* Menu screen: menu for selected restaurant */}
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={({ route }) => ({
            title: route.params?.restaurantName || "Menu",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// END
