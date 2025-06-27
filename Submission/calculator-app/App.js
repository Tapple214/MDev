// START

import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

// Button dimensions based on screen width; Responsiveness
const buttonWidth = Math.floor(Dimensions.get("window").width / 4) - 10;
const longButtonWidth = buttonWidth * 2 + 10;

// Calculator button layout and styling
const buttonRows = [
  [
    { label: "AC", style: "buttonLightGrey" },
    { label: "+/-", style: "buttonLightGrey" },
    { label: "%", style: "buttonLightGrey" },
    { label: "/", style: "buttonBlue" },
  ],
  [
    { label: "7", style: "buttonDark" },
    { label: "8", style: "buttonDark" },
    { label: "9", style: "buttonDark" },
    { label: "x", style: "buttonBlue" },
  ],
  [
    { label: "4", style: "buttonDark" },
    { label: "5", style: "buttonDark" },
    { label: "6", style: "buttonDark" },
    { label: "-", style: "buttonBlue" },
  ],
  [
    { label: "1", style: "buttonDark" },
    { label: "2", style: "buttonDark" },
    { label: "3", style: "buttonDark" },
    { label: "+", style: "buttonBlue" },
  ],
  [
    { label: "0", style: "buttonDark", long: true },
    { label: ".", style: "buttonDark" },
    { label: "=", style: "buttonBlue" },
  ],
];

export default function App() {
  // State management for calculator functionality
  const [answerValue, setAnswerValue] = useState("0"); // Current display value
  const [readyToReplace, setReadyToReplace] = useState(true); // Flag to replace or append numbers
  const [memoryValue, setMemoryValue] = useState("0"); // Stored value for operations
  const [operatorValue, setOperatorValue] = useState("0"); // Current operator (+, -, x, /)
  const [isAC, setIsAC] = useState(true); // Toggle between AC and CE button
  const [equationDisplay, setEquationDisplay] = useState(""); // Scientific calculator equation display

  // Utility functions to check input types
  const isNumber = (val) => /[0-9]/.test(val);
  const isOperator = (val) => ["+", "-", "x", "/"].includes(val);

  /**
   * Handles number input logic
   * @param {string} num - The number to be added
   * @returns {string} - The new number value
   */
  const handleNumber = (num) => {
    if (readyToReplace) {
      setReadyToReplace(false);
      return num;
    } else {
      return answerValue === "0" ? num : answerValue + num;
    }
  };

  /**
   * Performs mathematical calculations based on stored operator and values
   * @returns {string} - The calculated result
   */
  const calculateEquals = () => {
    const previous = parseFloat(memoryValue);
    const current = parseFloat(answerValue);
    let result = 0;

    switch (operatorValue) {
      case "+":
        result = previous + current;
        break;
      case "-":
        result = previous - current;
        break;
      case "x":
        result = previous * current;
        break;
      case "/":
        result = current !== 0 ? previous / current : "Error";
        break;
      default:
        result = current;
    }
    return result.toString();
  };

  /**
   * Main button press handler - processes all calculator inputs
   * @param {string} value - The button value pressed
   */
  const buttonPressed = (value) => {
    if (isNumber(value)) {
      const newValue = handleNumber(value);
      setAnswerValue(newValue);
      setIsAC(false); // Switch from AC to CE mode

      // Update equation display for scientific calculator
      if (operatorValue !== "0") {
        setEquationDisplay(`${memoryValue} ${operatorValue} ${newValue}`);
      } else {
        setEquationDisplay(newValue);
      }
      return;
    }

    // Handle clear functions (AC/CE)
    if (value === "AC" || value === "CE") {
      if (value === "AC") {
        // AC: Reset entire calculator state to initial values
        setAnswerValue("0");
        setMemoryValue("0");
        setOperatorValue("0");
        setEquationDisplay("");
        setIsAC(true);
      } else {
        // CE: Clear only current input, preserve operation context
        if (readyToReplace) {
          // If ready to replace, just reset to 0
          setAnswerValue("0");
          setIsAC(true);
          setEquationDisplay("");
        } else {
          if (answerValue.length > 1) {
            // Remove last digit from current number
            const newValue = answerValue.slice(0, -1);
            setAnswerValue(newValue);
            // Update equation display to reflect the change
            if (operatorValue !== "0") {
              setEquationDisplay(`${memoryValue} ${operatorValue} ${newValue}`);
            } else {
              setEquationDisplay(newValue);
            }
          } else {
            // If only one digit remains, reset to 0
            setAnswerValue("0");
            setIsAC(true);
            setReadyToReplace(false);
            setEquationDisplay("");
          }
        }
      }
      // Ensure readyToReplace is set for AC operations
      if (value === "AC") {
        setReadyToReplace(true);
      }
      return;
    }

    // Handle mathematical operators (+, -, x, /)
    if (isOperator(value)) {
      if (operatorValue !== "0") {
        // Chain operations: calculate previous operation first
        const chained = calculateEquals();
        setMemoryValue(chained);
        setAnswerValue(chained);
        setEquationDisplay(`${chained} ${value}`);
      } else {
        // First operation: store current value and operator
        setMemoryValue(answerValue);
        setEquationDisplay(`${answerValue} ${value}`);
      }
      setReadyToReplace(true);
      setOperatorValue(value);
      return;
    }

    // Handle equals button (=)
    if (value === "=") {
      const result = calculateEquals();
      const finalEquation = `${memoryValue} ${operatorValue} ${answerValue} = ${result}`;
      setAnswerValue(result);
      setMemoryValue("0");
      setReadyToReplace(true);
      setOperatorValue("0");
      setEquationDisplay(finalEquation);
      return;
    }

    // Handle sign change (+/-)
    if (value === "+/-") {
      if (answerValue !== "0") {
        const newValue = (parseFloat(answerValue) * -1).toString();
        setAnswerValue(newValue);
        // Update equation display to show sign change
        if (operatorValue !== "0") {
          setEquationDisplay(`${memoryValue} ${operatorValue} ${newValue}`);
        } else {
          setEquationDisplay(newValue);
        }
      }
      return;
    }

    // Handle percentage (%)
    if (value === "%") {
      const newValue = (parseFloat(answerValue) * 0.01).toString();
      setAnswerValue(newValue);
      if (operatorValue !== "0") {
        setEquationDisplay(`${memoryValue} ${operatorValue} ${newValue}`);
      } else {
        setEquationDisplay(newValue);
      }
      return;
    }

    // Handle decimal point (.)
    if (value === ".") {
      if (!answerValue.includes(".")) {
        const newValue = answerValue + ".";
        setAnswerValue(newValue);
        setReadyToReplace(false); // Allow further decimal input
        // Update equation display to show decimal addition
        if (operatorValue !== "0") {
          setEquationDisplay(`${memoryValue} ${operatorValue} ${newValue}`);
        } else {
          setEquationDisplay(newValue);
        }
      }
      return;
    }
  };

  /**
   * Determines button styling based on current state
   * @param {Object} btn - Button configuration object
   * @returns {Array} - Array of style objects
   */
  const getButtonStyle = (btn) => {
    // Highlight active operator button
    if (isOperator(btn.label) && operatorValue === btn.label) {
      return [styles.button, styles[btn.style], styles.activeOperator];
    }
    return [styles.button, styles[btn.style]];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Scientific calculator equation display */}
      <View style={styles.equationContainer}>
        <Text style={styles.equationText}>{equationDisplay}</Text>
      </View>

      {/* Main calculator result display */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{answerValue}</Text>
      </View>

      {/* Calculator button grid */}
      {buttonRows.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((btn, btnIndex) => (
            <TouchableOpacity
              key={btn.label}
              style={[
                ...getButtonStyle(btn),
                // Handle long button (zero button) styling
                btn.long
                  ? {
                      width: longButtonWidth,
                      height: buttonWidth,
                      borderRadius: buttonWidth / 2,
                      alignItems: "flex-start",
                      paddingLeft: 35,
                    }
                  : {
                      width: buttonWidth,
                      height: buttonWidth,
                      borderRadius: buttonWidth / 2,
                    },
              ]}
              activeOpacity={0.7}
              onPress={() =>
                buttonPressed(
                  btn.label === "AC" ? (isAC ? "AC" : "CE") : btn.label
                )
              }
            >
              <Text style={styles.buttonText}>
                {btn.label === "AC" ? (isAC ? "AC" : "CE") : btn.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </SafeAreaView>
  );
}

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "flex-end",
  },
  equationContainer: {
    marginBottom: 10,
    alignItems: "flex-end",
    paddingRight: 20,
    minHeight: 40,
  },
  equationText: {
    color: "#888888",
    fontSize: 24,
    textAlign: "right",
  },
  resultContainer: {
    marginBottom: 20,
    alignItems: "flex-end",
    paddingRight: 20,
  },
  resultText: {
    color: "white",
    fontSize: 70,
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLightGrey: {
    backgroundColor: "#d4d4d2",
  },
  buttonDark: {
    backgroundColor: "#333333",
  },
  buttonBlue: {
    backgroundColor: "#2196f3",
  },
  activeOperator: {
    backgroundColor: "#ff9500",
  },
  buttonText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
});

// END
