<script lang="ts">
	import type { Album } from "$lib/db/albums";
	import type { Artist } from "$lib/db/artists";
	import type { Song } from "$lib/db/songs";
	import { formatDuration } from "./utils";

  export let album: Album;
  export let songs: Song[];
  export let artist: Artist;

  $: releaseDate = album.releaseDate ? new Date(album.releaseDate).getFullYear() : "";
  $: totalDuration = songs.length > 0 ? songs.reduce((acc, song) => acc + (song.duration || 0), 0) : 0;
</script>

<div class="absolute top-0 h-20 w-full bg-gradient-to-b from-black to-transparent" />
<div class="absolute bottom-0 px-4 pb-7 w-full bg-gradient-to-t from-black to-transparent">
  <div class="relative max-w-[1100px] h-full mx-auto flex items-end gap-4">
    <div class="aspect-square h-24 md:h-32 rounded shadow border border-white" style="background-image: url('{album.image}'); background-size: cover; background-position: center;" />
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-4">
        <div>
          <h3 class="text-white">Album</h3>
          <h2 class="text-white text-5xl font-semibold">
            {album.name}
          </h2>
        </div>

        <div class="text-white flex flex-col sm:flex-row sm:items-center gap-2">
          <a href={`/artists/${artist.id}`} class="underline hover:text-blue-400">{artist.name}</a> 
          <p class="text-sm sm:text-base">
            <span class="hidden sm:inline">•</span> 
            <span>{releaseDate}</span> 
            <span>•</span>
            <span>
              {songs.length} songs, {formatDuration(totalDuration, "long")}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>