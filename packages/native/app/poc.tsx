import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
// import { Audio, AVPlaybackStatusSuccess, type AVPlaybackStatusError } from 'expo-av';
import Button from "@/components/Button";
import { Redirect } from "expo-router";
import { Text, View, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useAudioPlayer } from "expo-audio";

// const sound = new Audio.Sound();

export default function Home() {
  // const [permissionGranted, setPermissionGranted] = useState(false);

  const fileUri = `${FileSystem.documentDirectory}temp.mp3`;
  const mp3Url =
    "https://d1kc7ecm3gue3s.cloudfront.net/test-mp3s/13-Last+Chance+Reprise-v2-16b-44k.mp3";

  useEffect(() => {
    async function check() {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      console.log("File Info:", fileInfo);
    }

    check();
  }, []);

  const downloadAndSaveMP3 = async () => {
    // const mp3Url = 'https://d1kc7ecm3gue3s.cloudfront.net/cherry_street_mp3s/07-Corrina-v2-16b-44k.mp3';
    // const mp3Url = "https://d1kc7ecm3gue3s.cloudfront.net/cherry_street_images/cherry_street_cover_500.png";

    // NOTE: this has the correct content/type metadata so maybe it'll work???

    // Replace with the actual MP3 URL
    // Ensure file extension

    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "You need to grant media library permissions to save files."
        );
        return;
      }

      // setPermissionGranted(true);

      // Download the MP3 file
      const downloadResumable = FileSystem.createDownloadResumable(mp3Url, fileUri);
      const result = await downloadResumable.downloadAsync();

      if (!result) {
        Alert.alert("Download failed");
        return;
      }

      // Check if the file is valid
      const fileInfo = await FileSystem.getInfoAsync(result.uri);
      if (!fileInfo.exists) {
        Alert.alert("Error", "File download failed.");
        return;
      }

      // Save the file to the media library
      // console.log("***** creating asset ****");
      // const asset = await MediaLibrary.createAssetAsync(fileUri);
      // console.log("asset created, creating album **********");
      // await MediaLibrary.createAlbumAsync('Download', asset, false);
      // Alert.alert('Success', 'MP3 file downloaded and saved!');
      await Sharing.shareAsync(result.uri);
    } catch (error) {
      console.error("Error downloading or saving the file:", error);
      Alert.alert("Error", "Something went wrong while downloading or saving the file.");
    }
  };

  const player = useAudioPlayer(mp3Url);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Download MP3" onPress={downloadAndSaveMP3} />
      <Button
        title="Play MP3"
        onPress={() => {
          console.log("playing");
          player.play();
          setInterval(() => {
            console.log(player.currentTime);
          }, 200);
        }}
      />
      <Button
        title="Pause MP3"
        onPress={() => {
          console.log("pausing");
          player.pause();
        }}
      />
    </View>
  );

  //   const [downloaded, setDownloaded] = useState(false);
  //   const [isChecking, setIsChecking] = useState(false);
  //   const [position, setPosition] = useState("00:00");

  //   // useEffect(() => {
  //   //   async function checkFile() {
  //   //     try {
  //   //       const fileUri = `${FileSystem.documentDirectory}peppermint/benny-sidelinger/cherry-street/cherry-street.mp3`;
  //   //       const fileInfo = await FileSystem.getInfoAsync(fileUri);
  //   //       setDownloaded(fileInfo.exists);
  //   //     } catch (error) {
  //   //       console.error(error);
  //   //     } finally {
  //   //       setIsChecking(false);
  //   //     }
  //   //   }
  //   //   checkFile();
  //   // }, []);

  //   const fileUri = `${FileSystem.documentDirectory}peppermint/benny-sidelinger/cherry-street/cherry-street.mp3`;

  //   /*

  //   sound.getStatusAsync().then(status => {
  //               const position = Math.floor(status.positionMillis / 1000);
  //               const duration = Math.floor(status.durationMillis / 1000);
  //               return `${position}:${String(position % 60).padStart(2, '0')} / ${duration}:${String(duration % 60).padStart(2, '0')}`;
  //             })
  //   */

  //   useEffect(() => {
  //     //
  //     const subscription = sound.setOnPlaybackStatusUpdate((status) => {
  //       console.log("*****");
  //       console.log(status);

  //       if ((status as AVPlaybackStatusError).error) {
  //         console.log("error ****");
  //         return;
  //       }

  //       if (!status.isLoaded) {
  //         console.log("not loaded ****");
  //         return;
  //       }

  //       const successStatus = status as AVPlaybackStatusSuccess;

  //       const position = Math.floor(successStatus.positionMillis / 1000);
  //       const duration = successStatus.durationMillis ? Math.floor(successStatus.durationMillis / 1000) : 0;
  //       // setPosition(`${position}:${String(position % 60).padStart(2, '0')} / ${duration}:${String(duration % 60).padStart(2, '0')}`);
  //       setPosition(`${successStatus.positionMillis}`);
  //     });
  //   }, [sound]);

  //   if (isChecking) {
  //     return (
  //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //         <Text>Checking file system...</Text>
  //       </View>
  //     );
  //   }

  //   if (downloaded) {

  //     return (
  //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //         <Text>Downloaded!</Text>
  //         <Button
  //           title="Play MP3"
  //           onPress={async () => {
  //             try {
  //               const fileUri = `${FileSystem.documentDirectory}peppermint/benny-sidelinger/cherry-street/cherry-street.mp3`;
  //               console.log("***** loading file *******");
  //               await sound.loadAsync({ uri: fileUri });
  //               await sound.playAsync();
  //             } catch (error) {
  //               console.error(error);
  //             }
  //           }}
  //         />
  //         <Button
  //           title="Stop MP3"
  //           onPress={async () => {
  //             try {
  //               await sound.stopAsync();
  //               await sound.unloadAsync();
  //             } catch (error) {
  //               console.error(error);
  //             }
  //           }}
  //         />
  //         <Text>{position}</Text>
  //         <View className="w-full px-8 py-4">
  //           <View className="w-full h-2 bg-slate-200 rounded-full">
  //             {/* <View
  //               className="h-full bg-slate-700 rounded-full"
  //               style={{
  //                 width: `${(sound.getStatusAsync().then(status => status.positionMillis / status.durationMillis * 100) || 0)}%`
  //               }}
  //             /> */}
  //           </View>
  //           <Text className="text-center mt-2">
  //             todo
  //           </Text>
  //         </View>
  //       </View>
  //     );
  //   }

  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Button
  //         title="Download MP3"
  //         onPress={async () => {
  //           try {
  //             const { status } = await MediaLibrary.requestPermissionsAsync();
  //             if (status !== 'granted') {
  //               console.error('Permission to access media library was denied');
  //               return;
  //             }

  //             const downloadResult = await FileSystem.downloadAsync(
  //               "https://d1kc7ecm3gue3s.cloudfront.net/cherry_street_mp3s/02-Cherry%20Street-v2-16b-44k.mp3",
  //               FileSystem.documentDirectory + 'temp.mp3'
  //             );

  //             if (downloadResult.status === 200) {
  //               const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
  //               await MediaLibrary.createAlbumAsync('Cherry Street', asset, false);
  //               console.log("created album *******");
  //             }
  //             // const fileUri = `${FileSystem.documentDirectory}peppermint/benny-sidelinger/cherry-street/cherry-street.mp3`;

  //             // Create directory path if it doesn't exist
  //             // await FileSystem.makeDirectoryAsync(
  //             //   `${FileSystem.documentDirectory}peppermint/benny-sidelinger/cherry-street`,
  //             //   { intermediates: true }
  //             // );

  //             // // Download file from CloudFront
  //             // const downloadResumable = FileSystem.createDownloadResumable(
  //             //   "https://d1kc7ecm3gue3s.cloudfront.net/cherry_street_mp3s/02-Cherry%20Street-v2-16b-44k.mp3",
  //             //   fileUri,
  //             //   {}
  //             // );

  //             // const result = await downloadResumable.downloadAsync();

  //             // if (result?.uri) {
  //             //   setDownloaded(true);
  //             // }
  //           } catch (error) {
  //             console.error(error);
  //           }
  //         }}
  //       />
  //     </View>
  //   );
}
