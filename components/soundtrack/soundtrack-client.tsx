"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Music, Plus, ThumbsUp, Star, X, Play } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import type { PlaylistSong } from "@/lib/types"

interface SoundtrackClientProps {
    songs: PlaylistSong[]
    currentUserId: string
    familyId: string
}

export function SoundtrackClient({
    songs: initialSongs,
    currentUserId,
    familyId,
}: SoundtrackClientProps) {
    const [songs, setSongs] = useState<PlaylistSong[]>(initialSongs)
    const [showComposer, setShowComposer] = useState(false)
    const [songTitle, setSongTitle] = useState("")
    const [artist, setArtist] = useState("")
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const songOfTheWeek = songs.find((s) => s.is_song_of_week)
    const otherSongs = songs.filter((s) => !s.is_song_of_week).sort((a, b) => b.votes - a.votes)

    const handleSubmit = async () => {
        if (!songTitle.trim()) return
        setIsSubmitting(true)

        const supabase = createClient()
        const { data, error } = await supabase
            .from("family_playlist")
            .insert({
                family_id: familyId,
                song_title: songTitle.trim(),
                artist: artist.trim() || null,
                youtube_url: youtubeUrl.trim() || null,
                added_by: currentUserId,
            })
            .select("*, added_by_profile:profiles!added_by(full_name)")
            .single()

        if (!error && data) {
            setSongs([data, ...songs])
            setSongTitle("")
            setArtist("")
            setYoutubeUrl("")
            setShowComposer(false)
        }
        setIsSubmitting(false)
    }

    const handleVote = async (songId: string) => {
        const supabase = createClient()
        const song = songs.find((s) => s.id === songId)
        if (!song) return

        const { error } = await supabase
            .from("family_playlist")
            .update({ votes: song.votes + 1 })
            .eq("id", songId)

        if (!error) {
            setSongs(songs.map((s) => (s.id === songId ? { ...s, votes: s.votes + 1 } : s)))
        }
    }

    const handleDelete = async (songId: string) => {
        const supabase = createClient()
        const { error } = await supabase.from("family_playlist").delete().eq("id", songId)

        if (!error) {
            setSongs(songs.filter((s) => s.id !== songId))
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Music className="w-6 h-6 text-violet-500" />
                        Family Soundtrack
                    </h2>
                    <p className="text-muted-foreground text-sm">Our shared playlist</p>
                </div>
                <GlassButton onClick={() => setShowComposer(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Song
                </GlassButton>
            </div>

            {/* Composer Modal */}
            <AnimatePresence>
                {showComposer && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowComposer(false)}
                    >
                        <motion.div
                            className="glass-panel-solid rounded-3xl p-6 w-full max-w-md"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Add a Song</h3>
                                <button onClick={() => setShowComposer(false)} className="p-2 rounded-full hover:bg-white/20">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Song title</label>
                                    <input
                                        type="text"
                                        value={songTitle}
                                        onChange={(e) => setSongTitle(e.target.value)}
                                        placeholder="Bohemian Rhapsody"
                                        className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-violet-400"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Artist</label>
                                    <input
                                        type="text"
                                        value={artist}
                                        onChange={(e) => setArtist(e.target.value)}
                                        placeholder="Queen"
                                        className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-violet-400"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">YouTube URL (optional)</label>
                                    <input
                                        type="url"
                                        value={youtubeUrl}
                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                        placeholder="https://youtube.com/..."
                                        className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-violet-400"
                                    />
                                </div>

                                <GlassButton className="w-full" onClick={handleSubmit} disabled={isSubmitting || !songTitle.trim()}>
                                    {isSubmitting ? "Adding..." : "Add to Playlist"}
                                </GlassButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Song of the Week */}
            {songOfTheWeek && (
                <GlassCard className="p-6 bg-gradient-to-br from-violet-500/20 to-purple-600/20 border-2 border-violet-400/30">
                    <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
                        <span className="text-sm font-medium text-amber-400">Song of the Week</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                            <Music className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{songOfTheWeek.song_title}</h3>
                            <p className="text-muted-foreground">{songOfTheWeek.artist || "Unknown Artist"}</p>
                        </div>
                        {songOfTheWeek.youtube_url && (
                            <a
                                href={songOfTheWeek.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                <Play className="w-5 h-5" fill="white" />
                            </a>
                        )}
                    </div>
                </GlassCard>
            )}

            {/* Playlist */}
            {otherSongs.length > 0 && (
                <div className="space-y-2">
                    <AnimatePresence>
                        {otherSongs.map((song, index) => (
                            <motion.div
                                key={song.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <GlassCard className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-400/50 to-purple-500/50 flex items-center justify-center">
                                        <Music className="w-6 h-6 text-violet-200" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium truncate">{song.song_title}</h4>
                                        <p className="text-sm text-muted-foreground truncate">{song.artist || "Unknown Artist"}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleVote(song.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-violet-500/20 hover:bg-violet-500/30 transition-colors"
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            <span className="text-sm">{song.votes}</span>
                                        </button>
                                        {song.youtube_url && (
                                            <a
                                                href={song.youtube_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                                            >
                                                <Play className="w-4 h-4" />
                                            </a>
                                        )}
                                        {song.added_by === currentUserId && (
                                            <button
                                                onClick={() => handleDelete(song.id)}
                                                className="p-2 rounded-full hover:bg-red-500/20 text-muted-foreground hover:text-red-500"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Empty State */}
            {songs.length === 0 && (
                <GlassCard className="p-8 text-center">
                    <Music className="w-12 h-12 mx-auto mb-4 text-violet-500 opacity-50" />
                    <p className="text-muted-foreground">No songs yet. Add your first song to the family playlist!</p>
                </GlassCard>
            )}
        </div>
    )
}
