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

const buttonWidth = Math.floor(Dimensions.get("window").width / 4) - 10;
const longButtonWidth = buttonWidth * 2 + 10;

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
  const [answerValue, setAnswerValue] = useState("0");
  const [readyToReplace, setReadyToReplace] = useState(true);
  const [memoryValue, setMemoryValue] = useState("0");
  const [operatorValue, setOperatorValue] = useState("0");
  const [isAC, setIsAC] = useState(true);

  const isNumber = (val) => /[0-9]/.test(val);
  const isOperator = (val) => ["+", "-", "x", "/"].includes(val);

  const handleNumber = (num) => {
    if (readyToReplace) {
      setReadyToReplace(false);
      return num;
    } else {
      return answerValue === "0" ? num : answerValue + num;
    }
  };

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

  const buttonPressed = (value) => {
    if (isNumber(value)) {
      const newValue = handleNumber(value);
      setAnswerValue(newValue);
      setIsAC(false);
      return;
    }
    if (value === "AC" || value === "CE") {
      if (value === "AC") {
        setAnswerValue("0");
        setMemoryValue("0");
        setOperatorValue("0");
        setIsAC(true);
      } else {
        setAnswerValue("0");
        setIsAC(true);
      }
      setReadyToReplace(true);
      return;
    }
    if (isOperator(value)) {
      if (operatorValue !== "0") {
        const chained = calculateEquals();
        setMemoryValue(chained);
        setAnswerValue(chained);
      } else {
        setMemoryValue(answerValue);
      }
      setReadyToReplace(true);
      setOperatorValue(value);
      return;
    }
    if (value === "=") {
      const result = calculateEquals();
      setAnswerValue(result);
      setMemoryValue("0");
      setReadyToReplace(true);
      setOperatorValue("0");
      return;
    }
    if (value === "+/-") {
      if (answerValue !== "0") {
        setAnswerValue((parseFloat(answerValue) * -1).toString());
      }
      return;
    }
    if (value === "%") {
      setAnswerValue((parseFloat(answerValue) * 0.01).toString());
      return;
    }
    if (value === ".") {
      if (!answerValue.includes(".")) {
        setAnswerValue(answerValue + ".");
        setReadyToReplace(false);
      }
      return;
    }
  };

  const getButtonStyle = (btn) => {
    if (isOperator(btn.label) && operatorValue === btn.label) {
      return [styles.button, styles[btn.style], styles.activeOperator];
    }
    return [styles.button, styles[btn.style]];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Results field */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{answerValue}</Text>
      </View>
      {/* Button rows */}
      {buttonRows.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((btn, btnIndex) => (
            <TouchableOpacity
              key={btn.label}
              style={[
                ...getButtonStyle(btn),
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "flex-end",
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
    paddingHorizontal: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
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
