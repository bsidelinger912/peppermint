import { useState, useEffect } from "react";
import {
  Button,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  View,
  Platform,
} from "react-native";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    if (permissionResponse?.status !== "granted") {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }

  return (
    <SafeAreaView>
      <Button onPress={getAlbums} title="Get albums" />
      <ScrollView>{albums && albums.map((album) => <AlbumEntry album={album} />)}</ScrollView>
    </SafeAreaView>
  );
}

function AlbumEntry({ album }: { album: MediaLibrary.Album }) {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const albumAssets = await MediaLibrary.getAssetsAsync({ album });
      albumAssets && setAssets(albumAssets.assets);
    }
    getAlbumAssets();
  }, [album]);

  return (
    <View key={album.id}>
      <Text>
        {album.title} - {album.assetCount ?? "no"} assets
      </Text>
      <View>
        {assets &&
          assets.map((asset) => <Image source={{ uri: asset.uri }} width={50} height={50} />)}
      </View>
    </View>
  );
}
