'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import styles from '../LinuxDesktop.module.css';

type Track = {
  name: string;
  artist: string;
  src: string;
  cover?: string;
};

const FALLBACK_TRACKS: Track[] = [
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

const DEFAULT_QUERY = 'cyberpunk synthwave';

export default function MusicApp() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [tracks, setTracks] = useState<Track[]>(FALLBACK_TRACKS);
  const [libraryStatus, setLibraryStatus] = useState('Booting auto net library...');
  const [volume, setVolume] = useState(0.4);

  const track = useMemo(() => tracks[trackIndex], [trackIndex, tracks]);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
      setLibraryStatus((prev) => `${prev} • Press Play if autoplay is blocked`);
    }
  }, []);

  const loadInternetLibrary = useCallback(async (term: string, shouldAutoplay = true) => {
    setLibraryStatus('Fetching internet tracks...');
    try {
      const encoded = encodeURIComponent(term.trim() || DEFAULT_QUERY);
      const res = await fetch(`https://itunes.apple.com/search?term=${encoded}&entity=song&limit=20`);
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
        setLibraryStatus('No internet previews found; fallback library active');
        return;
      }

      setTracks(incoming);
      setTrackIndex(0);
      setLibraryStatus(`Auto-loaded ${incoming.length} net tracks`);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load();
      }

      if (shouldAutoplay) {
        setTimeout(() => {
          void tryPlay();
        }, 120);
      }
    } catch {
      setTracks(FALLBACK_TRACKS);
      setTrackIndex(0);
      setLibraryStatus('Internet unavailable; using fallback tracks');
      if (shouldAutoplay) {
        setTimeout(() => {
          void tryPlay();
        }, 120);
      }
    }
  }, [tryPlay]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    void loadInternetLibrary(DEFAULT_QUERY, true);
  }, [loadInternetLibrary]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    await tryPlay();
  };

  const shiftTrack = async (direction: 1 | -1) => {
    const next = (trackIndex + direction + tracks.length) % tracks.length;
    setTrackIndex(next);
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setTimeout(() => {
        void tryPlay();
      }, 80);
    }
  };

  return (
    <div className={styles.musicPanel}>
      <div className={styles.musicTitle}>Song Shifter // Auto Net Stream</div>
      <div className={styles.musicLibraryRow}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.musicSearch}
          placeholder="Search internet songs"
        />
        <button onClick={() => void loadInternetLibrary(query, true)}>Refresh Net</button>
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
        <button onClick={() => void shiftTrack(-1)}>⏮</button>
        <button onClick={() => void togglePlay()}>{playing ? '⏸ Pause' : '▶ Play'}</button>
        <button onClick={() => void shiftTrack(1)}>⏭</button>
      </div>

      <div className={styles.volumeRow}>
        <span>VOL {(volume * 100).toFixed(0)}%</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className={styles.volumeSlider}
        />
      </div>

      <audio ref={audioRef} controls className={styles.musicAudio} onEnded={() => setPlaying(false)}>
        <source src={track.src} type="audio/mpeg" />
      </audio>
    </div>
  );
}
