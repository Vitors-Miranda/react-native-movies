import { Client, Databases, ID, Query } from "react-native-appwrite";

//track the searches made by a user
const DATABASE_ID = process.env.EXPO_PUBLIC_APPRITE_DATABASE_ID!;
const METRICS_ID = process.env.EXPO_PUBLIC_APPWRITE_METRICS_ID!;
const SAVED_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_ID!;
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const saveMovie = async (movie: Movie) => {
  try{
    //search for saved movies
    const result = await database.listDocuments(DATABASE_ID, SAVED_ID, [
      Query.equal("movie_id", movie.id),
    ])

    if (result.documents.length > 0) {
      await database.deleteDocument(DATABASE_ID, SAVED_ID, result.documents[0].$id)
    } else {
      await database.createDocument(DATABASE_ID, SAVED_ID, ID.unique(), {
      movie_id: movie.id,
      title: movie.title,
      poster_url:  `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    })
    }
    
  } catch (error){
    console.log(error)
    throw error
  }
}
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, METRICS_ID, [
      Query.equal("searchTerm", query),
    ]);

    //check if a record of that search has alreaady been stored
    //increment the searchCount
    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        METRICS_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );

      //create new document
    } else {
      await database.createDocument(DATABASE_ID, METRICS_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSavedMovies = async (): Promise<SavedMovie[] | undefined> => {
  try{
     const result = await database.listDocuments(DATABASE_ID, SAVED_ID, [
      Query.orderDesc('movie_id')
    ]);
    return result.documents as unknown as SavedMovie[]
  } catch ( error) {
    console.log(error)
    return undefined;
  }
}

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, METRICS_ID, [
      Query.limit(5),
      Query.orderDesc('count')
    ]);
    return result.documents as unknown as TrendingMovie[]
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
