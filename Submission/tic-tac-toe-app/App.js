// START

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { useState, useEffect } from "react";

// Board's state according to the sample provided
const board = [
  ["O", "O", "X"],
  ["X", "O", "O"],
  ["X", "X", "O"],
];

// Different monochromatic color schemes for the additional feature
const colorSchemes = [
  {
    name: "Green",
    background: "#f0f8f0",
    oColor: "#228B22",
    xColor: "#32CD32",
    gridColor: "#0d4d0d",
  },
  {
    name: "Blue",
    background: "#f0f8ff",
    oColor: "#0066cc",
    xColor: "#3399ff",
    gridColor: "#003366",
  },
  {
    name: "Purple",
    background: "#f8f0ff",
    oColor: "#663399",
    xColor: "#9966cc",
    gridColor: "#330066",
  },
  {
    name: "Orange",
    background: "#fff8f0",
    oColor: "#cc6600",
    xColor: "#ff9933",
    gridColor: "#663300",
  },
  {
    name: "Pink",
    background: "#fff0f8",
    oColor: "#cc3366",
    xColor: "#ff6699",
    gridColor: "#660033",
  },
];

export default function App() {
  const [currentScheme, setCurrentScheme] = useState(0);
  const { width, height } = useWindowDimensions();

  // Responsive measurements
  const grid_size = Math.min(width * 0.8, height * 0.6);
  const cell_size = grid_size / 3;
  const border_width = Math.max(2, Math.min(width, height) * 0.01);
  const button_padding = Math.max(10, Math.min(width, height) * 0.02);
  const button_font_size = Math.max(14, Math.min(width, height) * 0.04);
  const cell_font_size = cell_size * 0.6;

  const cycleColors = () => {
    setCurrentScheme((prev) => (prev + 1) % colorSchemes.length);
  };

  const currentColors = colorSchemes[currentScheme];

  // Function to get dynamic styles based on current color scheme
  const getDynamicStyles = () => {
    return StyleSheet.create({
      containerWithBackground: {
        backgroundColor: currentColors.background,
      },
      gridWithBackground: {
        backgroundColor: currentColors.background,
      },
      cellBorderBottom: {
        borderBottomWidth: border_width,
        borderBottomColor: currentColors.gridColor,
      },
      cellBorderRight: {
        borderRightWidth: border_width,
        borderRightColor: currentColors.gridColor,
      },
      oText: {
        color: currentColors.oColor,
      },
      xText: {
        color: currentColors.xColor,
      },
    });
  };

  const dynamicStyles = getDynamicStyles();

  // Create responsive styles
  // Inside App() since it needs access to dynamic values
  const responsiveStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    grid: {
      width: grid_size,
      height: grid_size,
      marginHorizontal: width * 0.1,
    },
    row: {
      flex: 1,
      flexDirection: "row",
    },
    cell: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    cell_text: {
      fontSize: cell_font_size,
      fontWeight: "bold",
      color: "#000",
    },
    button: {
      position: "absolute",
      bottom: Math.max(50, height * 0.05),
      alignSelf: "center",
      padding: button_padding,
      backgroundColor: "#000",
      borderRadius: Math.max(6, Math.min(width, height) * 0.015),
    },
    buttonText: {
      fontSize: button_font_size,
      fontWeight: "bold",
      color: "#fff",
    },
  });

  return (
    <SafeAreaView
      style={[
        responsiveStyles.container,
        dynamicStyles.containerWithBackground,
      ]}
    >
      {/* Color scheme button */}
      <TouchableOpacity style={responsiveStyles.button} onPress={cycleColors}>
        <Text style={responsiveStyles.buttonText}>
          Change to{" "}
          {colorSchemes[(currentScheme + 1) % colorSchemes.length].name}
        </Text>
      </TouchableOpacity>

      <View style={[responsiveStyles.grid, dynamicStyles.gridWithBackground]}>
        {/* Map through each row of the board */}
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={responsiveStyles.row}>
            {/* Map through each cell in the current row */}
            {row.map((cell, colIndex) => (
              <View
                key={colIndex}
                style={[
                  responsiveStyles.cell,
                  // Add bottom border to all cells except the last row
                  rowIndex < 2 && dynamicStyles.cellBorderBottom,
                  // Add right border to all cells except the last column
                  colIndex < 2 && dynamicStyles.cellBorderRight,
                ]}
              >
                <Text
                  style={[
                    responsiveStyles.cell_text,
                    // Green color for O's
                    cell === "O" && dynamicStyles.oText,
                    // Red color for X's
                    cell === "X" && dynamicStyles.xText,
                  ]}
                >
                  {cell}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

// END
