import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { saveMovie } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MovieDetail(){
    const {id} = useLocalSearchParams();

    const {data: movie, loading} = useFetch(() => fetchMovieDetails(id as string))
    interface MovieInfoProps {
      label: string
      value?: string | number | null
    }
    const MovieInfo = ({label, value} : MovieInfoProps) => {
      return (

        <View className="flex-col items-start justify-center mt-5">
          <Text className="text-light-200 font-normal text-sm">
              {label}
          </Text>
          <Text className="text-light-100 font-bold text-sm mt-2">
            {value || 'N/A'}
          </Text>
        </View>
      )
    }
    const onSaveMovie = async () => {
        await saveMovie(movie)
        router.push("/(tabs)/saved")
    }
     return (
        <View className="bg-primary flex-1">
          <ScrollView contentContainerStyle={{
            paddingBottom: 80
          }}>
          <View>
            <Image source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}} resizeMode="stretch" className="w-full h-[550px]"></Image>
          </View>
          <View className="flex-col items-start justify-center mt-5 px-5">
            <Text className="font-bold text-white text-xl"> { movie?.title}</Text>
            <View className="flex-row items-center gap-x-1 mt-2">
              <Text className="text-light-200 text-sm">{movie?.release_date?.split('-')[0]}</Text>
              <Text className="text-light-200 text-sm">{movie?.runtime}</Text>
            </View>
            <View className="flex-row items-center bg-dark-200 px-2 py-1 rounded-md gap-x-1 mt-2">
              <Image source={icons.star} className="size-4"></Image>
              <Text className="text-white font-bold text-sm"> {Math.round(movie?.vote_average ?? 0)}/10</Text>
              <Text className="text-light-200 text-sm">
                ({movie?.vote_count} votes)
              </Text>
            </View>
            <MovieInfo label="Overview" value={movie?.overview}/>
            <MovieInfo label="Genres" value={movie?.genres?.map((g) => g.name).join(' - ') || 'N/A'}/>
              <View className="flex flex-row justify-between w-1/2">
                <MovieInfo label="Budget" value={`$${movie?.budget / 1_000_000} million`}/>
                <MovieInfo label="Revenue" value={`${Math.round(movie?.revenue) / 1_000_000}`}/>
              </View>
              <MovieInfo label="Production Companies" value={movie?.production_companies.map((c) => c.name).join(" - ") || "N/A"}/>
          </View>
          </ScrollView>
          <View className="absolute bottom-20 left-0 right-0 mx-5 flex flex-row items-center justify-around z-50">

          <TouchableOpacity className="w-3/5 bg-accent rounded-lg py-3 flex flex-row items-center justify-center" onPress={router.back}>
            <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff"/>
            <Text className="text-white font-semibold text-base">Go back</Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-1/5 bg-accent rounded-lg py-3 flex flex-row items-center justify-center" onPress={onSaveMovie}>
            <Image source={icons.save} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff"/>
          </TouchableOpacity>
          </View>
          
        </View>
      );
}