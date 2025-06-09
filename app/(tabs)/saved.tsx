import SavedCard from "@/components/SavedCard";
import { icons } from "@/constants/icons";
import { getSavedMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Saved() {
  const {
    data: savedMovies,
    loading: savedLoading,
    error: savedError,
    refetch: loadSaveds,
  } = useFetch(getSavedMovies);


  useFocusEffect(useCallback(() => {
     const load = async () => {
      await loadSaveds()
    }
    load()
  }, []))
  return (
    <View className="bg-primary flex-1 px-10">
      {savedLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : savedError ? (
        <Text> Error: {savedError?.message}</Text>
      ) : (
        <View className="flex-1 mt-3">
          {savedMovies && (
            <View className="mt-10">
              <Text className="text-lg text-white font-bold mb-3">
                Saved Movies
              </Text>
              <FlatList
                className="mt-3"
                data={savedMovies}
                renderItem={({ item }) => <SavedCard {...item} />}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 5,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                ListEmptyComponent={
                  !savedError &&
                  !savedLoading && (
                    <View className="flex justify-center items-center flex-1 flex-col gap-5">
                      <Image
                        className="size-10"
                        source={icons.save}
                        tintColor="#fff"
                      />
                      <Text className="text-white text-base">Saved</Text>
                    </View>
                  )
                }
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}
