import { icons } from "@/constants/icons";
import { Image, Text, View } from "react-native";

export default function Saved() {
  return (
    <View className="bg-primary flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image className="size-10" source={icons.save} tintColor="#fff"/>
          <Text className="text-white text-base">Saved</Text>
      </View>
    </View>
  );
}
