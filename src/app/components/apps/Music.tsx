'use client';

import React, { useMemo, useRef, useState } from 'react';
import styles from '../LinuxDesktop.module.css';

const TRACKS = [
  {
    name: 'Neon Run',
    artist: 'Synth Unit',
    src: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_1cc332e6f5.mp3?filename=future-bass-117997.mp3',
  },
  {
    name: 'Data Drift',
    artist: 'Space Modem',
    src: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_7af9d5d9e4.mp3?filename=timeless-113005.mp3',
  },
  {
    name: 'Chrome Dreams',
    artist: 'Deep Grid',
    src: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_2932bb96f8.mp3?filename=chill-ambient-11157.mp3',
  },
];

export default function MusicApp() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState('synthwave');
  const [tracks, setTracks] = useState<Track[]>(FALLBACK_TRACKS);
  const [libraryStatus, setLibraryStatus] = useState('Using built-in library');

  const track = useMemo(() => tracks[trackIndex], [trackIndex, tracks]);

  const loadInternetLibrary = async () => {
    setLibraryStatus('Fetching internet tracks...');
    try {
      const term = encodeURIComponent(query.trim() || 'synthwave');
      const res = await fetch(`https://itunes.apple.com/search?term=${term}&entity=song&limit=20`);
      const data = await res.json();
      const incoming: Track[] = (data.results || [])
        .filter((item: { previewUrl?: string }) => Boolean(item.previewUrl))
        .map(
          (item: {
            trackName?: string;
            artistName?: string;
            previewUrl: string;
            artworkUrl100?: string;
          }) => ({
            name: item.trackName || 'Unknown Track',
            artist: item.artistName || 'Unknown Artist',
            src: item.previewUrl,
            cover: item.artworkUrl100,
          })
        );

      if (!incoming.length) {
        setLibraryStatus('No internet previews found, using built-in set');
        return;
      }

      setTracks(incoming);
      setTrackIndex(0);
      setPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load();
      }
      setLibraryStatus(`Loaded ${incoming.length} tracks from internet`);
    } catch {
      setLibraryStatus('Internet library unavailable; fallback library active');
    }
  };

  const track = useMemo(() => TRACKS[trackIndex], [trackIndex]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const shiftTrack = (direction: 1 | -1) => {
    const next = (trackIndex + direction + tracks.length) % tracks.length;
    const next = (trackIndex + direction + TRACKS.length) % TRACKS.length;
    setTrackIndex(next);
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  };

  return (
    <div className={styles.musicPanel}>
      <div className={styles.musicTitle}>Song Shifter // Now Loaded</div>
      <div className={styles.musicLibraryRow}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.musicSearch}
          placeholder="Search internet songs (e.g. synthwave)"
        />
        <button onClick={loadInternetLibrary}>Load Net Library</button>
      </div>
      <div className={styles.musicStatus}>{libraryStatus}</div>

      {track.cover && (
        <Image
          src={track.cover}
          alt={track.name}
          width={64}
          height={64}
          unoptimized
          className={styles.musicCover}
        />
      )}
      <div className={styles.musicTrack}>{track.name}</div>
      <div className={styles.musicArtist}>{track.artist}</div>

      <div className={styles.musicButtons}>
        <button onClick={() => shiftTrack(-1)}>⏮</button>
        <button onClick={togglePlay}>{playing ? '⏸ Pause' : '▶ Play'}</button>
        <button onClick={() => shiftTrack(1)}>⏭</button>
      </div>

      <audio ref={audioRef} controls className={styles.musicAudio} onEnded={() => setPlaying(false)}>
        <source src={track.src} type="audio/mpeg" />
      </audio>
    </div>
  );
}
