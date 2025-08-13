import React, { createContext, useContext, useState } from "react";

const NavBarContext = createContext();

export const useNavBar = () => {
  const context = useContext(NavBarContext);
  if (!context) {
    throw new Error("useNavBar must be used within a NavBarProvider");
  }
  return context;
};

export const NavBarProvider = ({ children }) => {
  const [navBarFunctions, setNavBarFunctions] = useState({});

  const registerNavBarFunctions = (routeName, functions) => {
    setNavBarFunctions((prev) => ({
      ...prev,
      [routeName]: functions,
    }));
  };

  const getNavBarFunctions = (routeName) => {
    return navBarFunctions[routeName] || {};
  };

  return (
    <NavBarContext.Provider
      value={{ registerNavBarFunctions, getNavBarFunctions }}
    >
      {children}
    </NavBarContext.Provider>
  );
};
