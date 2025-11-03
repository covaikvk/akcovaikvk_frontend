// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";

// // Auth + First page
// import Firstpage from "./Pages/Firstpage/Firstpage";
// import Login from "./Pages/Auth/Login";
// import Signup from "./Pages/Auth/Signup";
// import Forgotpassword from "./Pages/Auth/Forgotpassword";

// // Home + Categories
// import Home1 from "./Pages/HomePage/Home1";
// import Home2 from "./Pages/HomePage/Home2";
// import Breakfast from "./Pages/Breakfast/Breakfast";
// import Lunch from "./Pages/Lunch/Lunch";
// import Snacks from "./Pages/Snacks/Snacks";
// import Dinner from "./Pages/Dinner/Dinner";

// // Services
// import Service1 from "./Pages/Food Services/Service1";
// import Service2 from "./Pages/Food Services/Service2";
// import Service3 from "./Pages/Food Services/Service3";
// import Service4 from "./Pages/Food Services/Service4";
// import Service5 from "./Pages/Food Services/Service5";
// import Service6 from "./Pages/Food Services/Service6";
// import Service7 from "./Pages/Food Services/Service7";
// import Service8 from "./Pages/Food Services/Service8";

// // Others
// import Reorder from "./Pages/ReorderPage/Reorder";
// import Address from "./Pages/Address/Address";
// import Aboutus from "./Pages/AboutUs/AboutUs";
// import Profile from "./Pages/Profilepage/Profile";
// import CartScreen from "./Pages/Cartpage/CartScreen";
// import ConfirmOrder from "./Pages/Cartpage/ConfirmOrder";
// import { CartProvider } from "./Pages/Cartpage/CartContext";
// import PartyOrders from "./Pages/Party Orders/PartyOrders";
// import RegularMenu from "./Pages/RegularMenu/RegularMenu";
// import { FavouritesProvider } from "./Pages/Favourites/FavouritesContext";
// import Favorites from "./Pages/Favourites/Favouritespage";

// // Quotation
// import Quotation1 from "./Pages/Quotation Services/Quotation1";
// import Menu1 from "./Pages/Quotation Menu/Menu1";
// import { QuotationProvider } from "./Pages/Quotation Services/QuotationContext";
// import MenuScreen from "./Pages/QuotationMenuScreen/MenuScreen";
// import EditAddress from "./Pages/Cartpage/EditAddress";
// import NewAddress from "./Pages/Cartpage/NewAddress";
// import SelectAddress from "./Pages/Cartpage/SelectAddress";

// import CustomizeMenuScreen from "./Pages/CustomizeMenuScreen/CustomizeMenuScreen";
// import CustomizeBreakfast from "./Pages/CustomizeFood/CustomizeBreakfast";
// import CustomizeLunch from "./Pages/CustomizeFood/CustomizeLunch";
// import CustomizeDinner from "./Pages/CustomizeFood/CustomizeDinner";
// import CustomizeSelectAddress from "./Pages/CustomizeSelectAddress/CustomizeSelectAddress";
// import { MenuProvider } from "./Pages/CustomizeMenu/MenuContext";
// import Orders from "./Pages/Profilepage/Orders";
// import RegularOrder from "./Pages/Profilepage/RegularOrder";
// import Quotations from "./Pages/Profilepage/Quotations";
// import CustomizeOrder from "./Pages/Profilepage/CustomizeOrder";


// // ✅ NEW — import the context provider
// import { FoodTypeProvider } from "./Pages/HomePage/FoodTypeContext";

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// // Tab Navigator
// function MainTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           if (route.name === "Home1") iconName = "home";
//           else if (route.name === "Breakfast") iconName = "fast-food";
//           else if (route.name === "Lunch") iconName = "restaurant";
//           else if (route.name === "Snacks") iconName = "pizza";
//           else if (route.name === "Dinner") iconName = "moon";
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "#5A913D",
//         tabBarInactiveTintColor: "gray",
//       })}
//     >
//       <Tab.Screen name="Home1" component={Home1} />
//       <Tab.Screen name="Breakfast" component={Breakfast} />
//       <Tab.Screen name="Lunch" component={Lunch} />
//       <Tab.Screen name="Snacks" component={Snacks} />
//       <Tab.Screen name="Dinner" component={Dinner} />
//     </Tab.Navigator>
//   );
// }

// export default function App() {
//   return (
//     // ✅ Wrap entire app inside FoodTypeProvider
//     <FoodTypeProvider>
//       <FavouritesProvider>
//         <MenuProvider>
//           <CartProvider>
//             <QuotationProvider>
//               <NavigationContainer>
//                 <Stack.Navigator initialRouteName="Firstpage">
//                   <Stack.Screen
//                     name="Firstpage"
//                     component={Firstpage}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Login"
//                     component={Login}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Signup"
//                     component={Signup}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Forgotpassword"
//                     component={Forgotpassword}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Home1"
//                     component={Home1}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Home2"
//                     component={Home2}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Breakfast"
//                     component={Breakfast}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Lunch"
//                     component={Lunch}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Dinner"
//                     component={Dinner}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Snacks"
//                     component={Snacks}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="CartScreen"
//                     component={CartScreen}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Service1"
//                     component={Service1}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Service2"
//                     component={Service2}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Service3"
//                     component={Service3}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Service4"
//                     component={Service4}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Service5"
//                     component={Service5}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Service6"
//                     component={Service6}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Service7"
//                     component={Service7}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Service8"
//                     component={Service8}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="AboutUs"
//                     component={Aboutus}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Reorder"
//                     component={Reorder}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Address"
//                     component={Address}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Profile"
//                     component={Profile}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="ConfirmOrder"
//                     component={ConfirmOrder}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Quotation1"
//                     component={Quotation1}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Menu1"
//                     component={Menu1}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="MenuScreen"
//                     component={MenuScreen}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="EditAddress"
//                     component={EditAddress}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="NewAddress"
//                     component={NewAddress}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="SelectAddress"
//                     component={SelectAddress}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="PartyOrders"
//                     component={PartyOrders}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="RegularMenu"
//                     component={RegularMenu}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="Favouritespage"
//                     component={Favorites}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="CustomizeMenuScreen"
//                     component={CustomizeMenuScreen}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="CustomizeBreakfast"
//                     component={CustomizeBreakfast}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="CustomizeLunch"
//                     component={CustomizeLunch}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="CustomizeDinner"
//                     component={CustomizeDinner}
//                     options={{ headerShown: false }}
//                   />
//                    <Stack.Screen
//                     name="CustomizeSelectAddress"
//                     component={CustomizeSelectAddress}
//                     options={{ headerShown: false }}
//                   />
//                      <Stack.Screen
//                     name="Orders"
//                     component={Orders}
//                     options={{ headerShown: false }}
//                   />
//                    <Stack.Screen
//                     name="RegularOrder"
//                     component={RegularOrder}
//                     options={{ headerShown: false }}
//                   />
//                    <Stack.Screen
//                     name="Quotations"
//                     component={Quotations}
//                     options={{ headerShown: false }}
//                   />
//                   <Stack.Screen
//                     name="CustomizeOrder"
//                     component={CustomizeOrder}
//                     options={{ headerShown: false }}
//                   />

//                 </Stack.Navigator>
//               </NavigationContainer>
//             </QuotationProvider>
//           </CartProvider>
//         </MenuProvider>
//       </FavouritesProvider>
//     </FoodTypeProvider>
//   );
// }




























import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import Constants from "expo-constants";
import "./config/firebaseConfig";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Context Providers
import { CartProvider } from "./Pages/Cartpage/CartContext";
import { FavouritesProvider } from "./Pages/Favourites/FavouritesContext";
import { QuotationProvider } from "./Pages/Quotation Services/QuotationContext";
import { MenuProvider } from "./Pages/CustomizeMenu/MenuContext";
import { FoodTypeProvider } from "./Pages/HomePage/FoodTypeContext";

// Auth & First Screen
import Firstpage from "./Pages/Firstpage/Firstpage";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import Forgotpassword from "./Pages/Auth/Forgotpassword";

// Home & Food Screens
import Home1 from "./Pages/HomePage/Home1";
import Home2 from "./Pages/HomePage/Home2";
import Breakfast from "./Pages/Breakfast/Breakfast";
import Lunch from "./Pages/Lunch/Lunch";
import Snacks from "./Pages/Snacks/Snacks";
import Dinner from "./Pages/Dinner/Dinner";

// Services
import Service1 from "./Pages/Food Services/Service1";
import Service2 from "./Pages/Food Services/Service2";
import Service3 from "./Pages/Food Services/Service3";
import Service4 from "./Pages/Food Services/Service4";
import Service5 from "./Pages/Food Services/Service5";
import Service6 from "./Pages/Food Services/Service6";
import Service7 from "./Pages/Food Services/Service7";
import Service8 from "./Pages/Food Services/Service8";

// Cart & Orders
import CartScreen from "./Pages/Cartpage/CartScreen";
import ConfirmOrder from "./Pages/Cartpage/ConfirmOrder";
import EditAddress from "./Pages/Cartpage/EditAddress";
import NewAddress from "./Pages/Cartpage/NewAddress";
import SelectAddress from "./Pages/Cartpage/SelectAddress";

// Others
import Reorder from "./Pages/ReorderPage/Reorder";
import Address from "./Pages/Address/Address";
import Aboutus from "./Pages/AboutUs/AboutUs";
import Profile from "./Pages/Profilepage/Profile";
import PartyOrders from "./Pages/Party Orders/PartyOrders";
import RegularMenu from "./Pages/RegularMenu/RegularMenu";
import Favorites from "./Pages/Favourites/Favouritespage";

// Quotation
import Quotation1 from "./Pages/Quotation Services/Quotation1";
import Menu1 from "./Pages/Quotation Menu/Menu1";
import MenuScreen from "./Pages/QuotationMenuScreen/MenuScreen";

// Customize Food
import CustomizeMenuScreen from "./Pages/CustomizeMenuScreen/CustomizeMenuScreen";
import CustomizeBreakfast from "./Pages/CustomizeFood/CustomizeBreakfast";
import CustomizeLunch from "./Pages/CustomizeFood/CustomizeLunch";
import CustomizeDinner from "./Pages/CustomizeFood/CustomizeDinner";
import CustomizeSelectAddress from "./Pages/CustomizeSelectAddress/CustomizeSelectAddress";

// Profile Orders
import Orders from "./Pages/Profilepage/Orders";
import RegularOrder from "./Pages/Profilepage/RegularOrder";
import Quotations from "./Pages/Profilepage/Quotations";
import CustomizeOrder from "./Pages/Profilepage/CustomizeOrder";
import RegularMenuAddress from "./Pages/RegularMenu/RegularMenuAddress";
const Stack = createStackNavigator();

// Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ✅ Get projectId for push token
const projectId =
  Constants?.expoConfig?.extra?.eas?.projectId ||
  Constants?.easConfig?.projectId; // fallback for safety

export default function App() {

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Enable notifications to receive alerts.");
        return;
      }

      // ✅ Get Expo Push Token properly
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      console.log("✅ Expo Push Token:", token);

    } catch (err) {
      console.log("❌ Notification Error:", err);
    }
  };

  return (
    <FoodTypeProvider>
      <FavouritesProvider>
        <MenuProvider>
          <CartProvider>
            <QuotationProvider>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Firstpage">

                  {/* Auth */}
                  <Stack.Screen name="Firstpage" component={Firstpage} options={{ headerShown: false }} />
                  <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                  <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
                  <Stack.Screen name="Forgotpassword" component={Forgotpassword} options={{ headerShown: false }} />

                  {/* Home */}
                  <Stack.Screen name="Home1" component={Home1} options={{ headerShown: false }} />
                  <Stack.Screen name="Home2" component={Home2} options={{ headerShown: false }} />

                  {/* Food */}
                  <Stack.Screen name="Breakfast" component={Breakfast} options={{ headerShown: false }} />
                  <Stack.Screen name="Lunch" component={Lunch} options={{ headerShown: false }} />
                  <Stack.Screen name="Snacks" component={Snacks} options={{ headerShown: false }} />
                  <Stack.Screen name="Dinner" component={Dinner} options={{ headerShown: false }} />

                  {/* Services */}
                  <Stack.Screen name="Service1" component={Service1} options={{ headerShown: false }} />
                  <Stack.Screen name="Service2" component={Service2} options={{ headerShown: false }} />
                  <Stack.Screen name="Service3" component={Service3} options={{ headerShown: false }} />
                  <Stack.Screen name="Service4" component={Service4} options={{ headerShown: false }} />
                  <Stack.Screen name="Service5" component={Service5} options={{ headerShown: false }} />
                  <Stack.Screen name="Service6" component={Service6} options={{ headerShown: false }} />
                  <Stack.Screen name="Service7" component={Service7} options={{ headerShown: false }} />
                  <Stack.Screen name="Service8" component={Service8} options={{ headerShown: false }} />

                  {/* Cart */}
                  <Stack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="ConfirmOrder" component={ConfirmOrder} options={{ headerShown: false }} />
                  <Stack.Screen name="EditAddress" component={EditAddress} options={{ headerShown: false }} />
                  <Stack.Screen name="NewAddress" component={NewAddress} options={{ headerShown: false }} />
                  <Stack.Screen name="SelectAddress" component={SelectAddress} options={{ headerShown: false }} />

                  {/* Other */}
                  <Stack.Screen name="Reorder" component={Reorder} options={{ headerShown: false }} />
                  <Stack.Screen name="Address" component={Address} options={{ headerShown: false }} />
                  <Stack.Screen name="AboutUs" component={Aboutus} options={{ headerShown: false }} />
                  <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />

                  {/* Quotation */}
                  <Stack.Screen name="Quotation1" component={Quotation1} options={{ headerShown: false }} />
                  <Stack.Screen name="Menu1" component={Menu1} options={{ headerShown: false }} />
                  <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ headerShown: false }} />

                  {/* More */}
                  <Stack.Screen name="PartyOrders" component={PartyOrders} options={{ headerShown: false }} />
                  <Stack.Screen name="RegularMenu" component={RegularMenu} options={{ headerShown: false }} />
                  <Stack.Screen name="Favouritespage" component={Favorites} options={{ headerShown: false }} />

                  {/* Customize */}
                  <Stack.Screen name="CustomizeMenuScreen" component={CustomizeMenuScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="CustomizeBreakfast" component={CustomizeBreakfast} options={{ headerShown: false }} />
                  <Stack.Screen name="CustomizeLunch" component={CustomizeLunch} options={{ headerShown: false }} />
                  <Stack.Screen name="CustomizeDinner" component={CustomizeDinner} options={{ headerShown: false }} />
                  <Stack.Screen name="CustomizeSelectAddress" component={CustomizeSelectAddress} options={{ headerShown: false }} />

                  {/* Profile Orders */}
                  <Stack.Screen name="Orders" component={Orders} options={{ headerShown: false }} />
                  <Stack.Screen name="RegularOrder" component={RegularOrder} options={{ headerShown: false }} />
                  <Stack.Screen name="Quotations" component={Quotations} options={{ headerShown: false }} />
                  <Stack.Screen name="CustomizeOrder" component={CustomizeOrder} options={{ headerShown: false }} />
                     <Stack.Screen name="RegularMenuAddress" component={RegularMenuAddress} options={{ headerShown: false }} />

                </Stack.Navigator>
              </NavigationContainer>
            </QuotationProvider>
          </CartProvider>
        </MenuProvider>
      </FavouritesProvider>
    </FoodTypeProvider>
  );
}
