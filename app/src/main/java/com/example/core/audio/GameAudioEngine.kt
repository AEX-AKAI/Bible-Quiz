package com.example.core.audio

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.util.concurrent.ConcurrentHashMap
import kotlin.math.PI
import kotlin.math.exp
import kotlin.math.sin

class GameAudioEngine private constructor(context: Context) {

    private val appContext = context.applicationContext
    private val settingsManager = AudioSettingsManager.getInstance(appContext)
    private val scope = CoroutineScope(Dispatchers.Default + Job())

    private val sampleRate = 44100
    private val preRenderedSounds = ConcurrentHashMap<String, ShortArray>()

    private var musicTrack: AudioTrack? = null
    private var musicJob: Job? = null
    private var isQuizDucked: Boolean = false

    init {
        // Pre-render common sounds for zero-latency instant playback
        preRenderSounds()
    }

    private fun preRenderSounds() {
        try {
            preRenderedSounds["click"] = generateTone(800.0, 0.025, 0.4, 0.002, 0.02)
            preRenderedSounds["appear"] = generateChime(listOf(880.0, 1174.66), 0.08, 0.35)
            preRenderedSounds["correct"] = generateChord(listOf(523.25, 659.25, 783.99), 0.25, 0.6)
            preRenderedSounds["incorrect"] = generateErrorBuzz(185.0, 146.0, 0.16, 0.5)
            preRenderedSounds["speed_bonus"] = generateChime(listOf(1046.5, 1318.5, 1567.98), 0.22, 0.65)
            preRenderedSounds["difficulty_increase"] = generateArpeggio(listOf(523.25, 659.25, 783.99, 1046.5), 0.06, 0.6)
            preRenderedSounds["timer_warning"] = generateTone(330.0, 0.08, 0.4, 0.01, 0.06)
            preRenderedSounds["countdown_tick"] = generateTone(980.0, 0.035, 0.5, 0.002, 0.03)
            preRenderedSounds["challenge_complete"] = generateChord(listOf(440.0, 554.37, 659.25, 880.0), 0.55, 0.7)
            preRenderedSounds["victory"] = generateVictoryFanfare()
            preRenderedSounds["defeat"] = generateChord(listOf(392.0, 466.16, 587.33), 0.45, 0.5)
            preRenderedSounds["draw"] = generateChord(listOf(440.0, 523.25, 659.25), 0.35, 0.5)
            preRenderedSounds["lobby_joined"] = generateChime(listOf(587.33, 880.0), 0.18, 0.5)
            preRenderedSounds["challenge_start"] = generateArpeggio(listOf(440.0, 659.25, 880.0), 0.07, 0.65)
        } catch (e: Exception) {
            Log.w(TAG, "Failed pre-rendering sounds: ${e.message}")
        }
    }

    private fun getEffectiveSfxVolume(): Float {
        val s = settingsManager.settings.value
        if (!s.soundEffectsEnabled) return 0f
        return (s.masterVolume * s.sfxVolume).coerceIn(0f, 1f)
    }

    private fun getEffectiveMusicVolume(): Float {
        val s = settingsManager.settings.value
        if (!s.musicEnabled) return 0f
        val duckingFactor = if (isQuizDucked) 0.25f else 1.0f
        return (s.masterVolume * s.musicVolume * duckingFactor).coerceIn(0f, 1f)
    }

    fun playButtonTap() = playPreRendered("click")
    fun playQuestionAppear() = playPreRendered("appear")
    fun playAnswerSelected() = playPreRendered("click")
    fun playCorrect() = playPreRendered("correct")
    fun playIncorrect() = playPreRendered("incorrect")
    fun playSpeedBonus() = playPreRendered("speed_bonus")
    fun playDifficultyIncrease() = playPreRendered("difficulty_increase")
    fun playTimerWarning() = playPreRendered("timer_warning")
    fun playCountdownTick() = playPreRendered("countdown_tick")
    fun playChallengeCompleted() = playPreRendered("challenge_complete")
    fun playVictory() = playPreRendered("victory")
    fun playDefeat() = playPreRendered("defeat")
    fun playDraw() = playPreRendered("draw")
    fun playLobbyJoined() = playPreRendered("lobby_joined")
    fun playChallengeStarted() = playPreRendered("challenge_start")

    fun playCombo(combo: Int) {
        val vol = getEffectiveSfxVolume()
        if (vol <= 0f) return
        scope.launch {
            // Ascending major pentatonic scale: C5, D5, E5, G5, A5, C6, D6, E6...
            val scale = listOf(523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98)
            val noteIndex = ((combo - 1).coerceAtLeast(0)) % scale.size
            val baseFreq = scale[noteIndex]
            val buffer = generateTone(baseFreq, 0.12, 0.55 * vol, 0.005, 0.10)
            playPcm(buffer)
        }
    }

    fun playComboMilestone(milestone: Int) {
        val vol = getEffectiveSfxVolume()
        if (vol <= 0f) return
        scope.launch {
            val chord = when {
                milestone >= 20 -> listOf(523.25, 659.25, 783.99, 1046.5, 1318.51)
                milestone >= 15 -> listOf(523.25, 659.25, 783.99, 1046.5)
                milestone >= 10 -> listOf(440.0, 554.37, 659.25, 880.0)
                else -> listOf(523.25, 659.25, 783.99)
            }
            val buffer = generateChord(chord, 0.35, 0.7 * vol)
            playPcm(buffer)
        }
    }

    private fun playPreRendered(name: String) {
        val vol = getEffectiveSfxVolume()
        if (vol <= 0f) return
        val samples = preRenderedSounds[name] ?: return
        scope.launch {
            val adjusted = if (vol < 0.98f) {
                ShortArray(samples.size) { i -> (samples[i] * vol).toInt().toShort() }
            } else samples
            playPcm(adjusted)
        }
    }

    private fun playPcm(buffer: ShortArray) {
        try {
            val audioTrack = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_GAME)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                        .build()
                )
                .setBufferSizeInBytes(buffer.size * 2)
                .setTransferMode(AudioTrack.MODE_STATIC)
                .build()

            audioTrack.write(buffer, 0, buffer.size)
            audioTrack.play()
            // Release after playback finishes
            val durationMs = (buffer.size * 1000L) / sampleRate
            scope.launch {
                delay(durationMs + 100L)
                try {
                    audioTrack.stop()
                    audioTrack.release()
                } catch (_: Exception) {}
            }
        } catch (e: Exception) {
            Log.w(TAG, "AudioTrack play error: ${e.message}")
        }
    }

    // Background Ambient Music Loop
    fun startAmbientMusic(inQuiz: Boolean = false) {
        isQuizDucked = inQuiz
        val vol = getEffectiveMusicVolume()
        if (vol <= 0f || musicJob?.isActive == true) return

        musicJob = scope.launch {
            while (isActive) {
                val currentVol = getEffectiveMusicVolume()
                if (currentVol > 0f) {
                    // Contemplative warm pad progression: Cmaj -> Gmaj -> Amin -> Fmaj
                    val chords = listOf(
                        listOf(261.63, 329.63, 392.0),  // C
                        listOf(196.0, 246.94, 293.66),  // G
                        listOf(220.0, 261.63, 329.63),  // Am
                        listOf(174.61, 220.0, 261.63)   // F
                    )
                    for (chord in chords) {
                        if (!isActive) break
                        val padVol = getEffectiveMusicVolume() * 0.18f
                        if (padVol > 0f) {
                            val padBuffer = generateAmbientPad(chord, durationSeconds = 3.0, volume = padVol.toDouble())
                            playPcm(padBuffer)
                        }
                        delay(2900L)
                    }
                } else {
                    delay(500L)
                }
            }
        }
    }

    fun setQuizMusicDucking(inQuiz: Boolean) {
        isQuizDucked = inQuiz
    }

    fun stopAmbientMusic() {
        musicJob?.cancel()
        musicJob = null
        try {
            musicTrack?.stop()
            musicTrack?.release()
        } catch (_: Exception) {}
        musicTrack = null
    }

    // Audio Synthesis Generators
    private fun generateTone(
        freq: Double,
        durationSeconds: Double,
        volume: Double,
        attackSeconds: Double,
        decaySeconds: Double
    ): ShortArray {
        val totalSamples = (durationSeconds * sampleRate).toInt()
        val buffer = ShortArray(totalSamples)
        val attackSamples = (attackSeconds * sampleRate).toInt()
        val decaySamples = (decaySeconds * sampleRate).toInt()

        for (i in 0 until totalSamples) {
            val t = i.toDouble() / sampleRate
            val sample = sin(2.0 * PI * freq * t)
            val envelope = when {
                i < attackSamples -> i.toDouble() / attackSamples
                i > totalSamples - decaySamples -> (totalSamples - i).toDouble() / decaySamples
                else -> 1.0
            }
            buffer[i] = (sample * envelope * volume * 32767.0).toInt().coerceIn(-32768, 32767).toShort()
        }
        return buffer
    }

    private fun generateChime(freqs: List<Double>, durationSeconds: Double, volume: Double): ShortArray {
        val totalSamples = (durationSeconds * sampleRate).toInt()
        val buffer = ShortArray(totalSamples)
        val noteCount = freqs.size

        for (i in 0 until totalSamples) {
            val t = i.toDouble() / sampleRate
            var sum = 0.0
            freqs.forEachIndexed { idx, freq ->
                val delayOffset = idx * 0.02
                if (t >= delayOffset) {
                    val localT = t - delayOffset
                    val env = exp(-localT * 12.0)
                    sum += sin(2.0 * PI * freq * localT) * env
                }
            }
            val norm = sum / noteCount
            buffer[i] = (norm * volume * 32767.0).toInt().coerceIn(-32768, 32767).toShort()
        }
        return buffer
    }

    private fun generateChord(freqs: List<Double>, durationSeconds: Double, volume: Double): ShortArray {
        val totalSamples = (durationSeconds * sampleRate).toInt()
        val buffer = ShortArray(totalSamples)

        for (i in 0 until totalSamples) {
            val t = i.toDouble() / sampleRate
            val env = exp(-t * 6.0)
            var sum = 0.0
            for (f in freqs) {
                sum += sin(2.0 * PI * f * t) + 0.3 * sin(4.0 * PI * f * t) // harmonic overtone
            }
            val norm = sum / (freqs.size * 1.3)
            buffer[i] = (norm * env * volume * 32767.0).toInt().coerceIn(-32768, 32767).toShort()
        }
        return buffer
    }

    private fun generateErrorBuzz(startFreq: Double, endFreq: Double, durationSeconds: Double, volume: Double): ShortArray {
        val totalSamples = (durationSeconds * sampleRate).toInt()
        val buffer = ShortArray(totalSamples)

        for (i in 0 until totalSamples) {
            val t = i.toDouble() / sampleRate
            val progress = i.toDouble() / totalSamples
            val curFreq = startFreq + (endFreq - startFreq) * progress
            val env = 1.0 - progress
            // Triangle/square blended wave for soft low buzz
            val phase = (t * curFreq) % 1.0
            val wave = if (phase < 0.5) 4.0 * phase - 1.0 else 3.0 - 4.0 * phase
            buffer[i] = (wave * env * volume * 32767.0).toInt().coerceIn(-32768, 32767).toShort()
        }
        return buffer
    }

    private fun generateArpeggio(notes: List<Double>, noteDuration: Double, volume: Double): ShortArray {
        val totalSamples = (notes.size * noteDuration * sampleRate).toInt()
        val buffer = ShortArray(totalSamples)

        for (i in 0 until totalSamples) {
            val t = i.toDouble() / sampleRate
            val noteIdx = (t / noteDuration).toInt().coerceIn(0, notes.size - 1)
            val noteT = t - (noteIdx * noteDuration)
            val freq = notes[noteIdx]
            val env = exp(-noteT * 15.0)
            val sample = sin(2.0 * PI * freq * noteT)
            buffer[i] = (sample * env * volume * 32767.0).toInt().coerceIn(-32768, 32767).toShort()
        }
        return buffer
    }

    private fun generateVictoryFanfare(): ShortArray {
        val notes = listOf(392.0, 523.25, 659.25, 783.99, 1046.5) // G4, C5, E5, G5, C6
        val durations = listOf(0.1, 0.1, 0.1, 0.15, 0.45)
        val totalDuration = durations.sum()
        val totalSamples = (totalDuration * sampleRate).toInt()
        val buffer = ShortArray(totalSamples)

        var timeOffset = 0.0
        for (idx in notes.indices) {
            val dur = durations[idx]
            val startSample = (timeOffset * sampleRate).toInt()
            val endSample = ((timeOffset + dur) * sampleRate).toInt().coerceAtMost(totalSamples)
            val freq = notes[idx]

            for (s in startSample until endSample) {
                val localT = (s - startSample).toDouble() / sampleRate
                val env = if (idx == notes.size - 1) exp(-localT * 3.5) else exp(-localT * 10.0)
                val sample = sin(2.0 * PI * freq * localT) + 0.25 * sin(4.0 * PI * freq * localT)
                buffer[s] = (sample * env * 0.7 * 32767.0).toInt().coerceIn(-32768, 32767).toShort()
            }
            timeOffset += dur
        }
        return buffer
    }

    private fun generateAmbientPad(chordFreqs: List<Double>, durationSeconds: Double, volume: Double): ShortArray {
        val totalSamples = (durationSeconds * sampleRate).toInt()
        val buffer = ShortArray(totalSamples)
        val attackSamples = (0.5 * sampleRate).toInt()
        val releaseSamples = (0.6 * sampleRate).toInt()

        for (i in 0 until totalSamples) {
            val t = i.toDouble() / sampleRate
            val env = when {
                i < attackSamples -> i.toDouble() / attackSamples
                i > totalSamples - releaseSamples -> (totalSamples - i).toDouble() / releaseSamples
                else -> 1.0
            }
            var sum = 0.0
            for (f in chordFreqs) {
                // Soft warm sine wave with subtle LFO vibrato
                val lfo = 1.0 + 0.003 * sin(2.0 * PI * 2.0 * t)
                sum += sin(2.0 * PI * f * lfo * t)
            }
            val norm = sum / chordFreqs.size
            buffer[i] = (norm * env * volume * 32767.0).toInt().coerceIn(-32768, 32767).toShort()
        }
        return buffer
    }

    companion object {
        private const val TAG = "GameAudioEngine"

        @Volatile
        private var INSTANCE: GameAudioEngine? = null

        fun getInstance(context: Context): GameAudioEngine {
            return INSTANCE ?: synchronized(this) {
                val inst = GameAudioEngine(context)
                INSTANCE = inst
                inst
            }
        }
    }
}
