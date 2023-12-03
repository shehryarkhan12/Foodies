import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../Shared/Colors";

export default function CategoryItem({ category }) {
  return (
    <View
      style={{
        padding: 8,
        alignItems: "center",
        margin: 8,
        width: 110,
        height: 90,
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: Colors.GRAY,
      }}
    >
      <Image source={category.icon} style={{ width: 55, height: 55 }} />
      <Text style={{ fontSize: 16, fontFamily: "raleway" }}>
        {category.name}
      </Text>
    </View>
  );
}
