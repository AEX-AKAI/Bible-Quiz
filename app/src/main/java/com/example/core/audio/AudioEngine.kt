package com.example.core.audio

import android.content.Context
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.SoundPool
import android.util.Log
import com.example.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.util.concurrent.ConcurrentHashMap

enum class GameSfx {
    CLICK_NORMAL,
    BTN_START,
    BTN_JOIN,
    BTN_CREATE,
    TAP_OPT_A,
    TAP_OPT_B,
    TAP_OPT_C,
    TAP_OPT_D,
    HINT,
    BONUS_REWARD,
    BONUS_CLAIM,
    BONUS_AVAILABLE,
    BONUS_UNLOCKED,
    BONUS_EXPIRED,
    NAV_BACK,
    NAV_CLOSE,
    NAV_SETTINGS,
    CHALLENGE_READY,
    CHALLENGE_START,
    CHALLENGE_COMPLETE,
    DIFFICULTY_INCREASE,
    TIMER_10S,
    TIMER_5S,
    TIMER_FINAL_SEC,
    CORRECT,
    INCORRECT,
    COMBO_SMALL,
    COMBO_5,
    COMBO_10,
    COMBO_15,
    COMBO_20,
    VICTORY,
    DEFEAT
}

enum class AmbientMood {
    NORMAL,
    HIGH_COMBO,
    TENSION
}

/**
 * Centralized AudioEngine component managing:
 * - SoundPool for subtle, high-responsiveness button taps, answer options (A/B/C/D),
 *   hints, milestones, bonuses, and timer warnings.
 * - MediaPlayer for peaceful, spiritual, immersive ambient soundscapes with smooth fades.
 * - Reactive volume & mute settings stored persistently.
 */
class AudioEngine private constructor(context: Context) {

    private val appContext = context.applicationContext
    private val settingsManager = AudioSettingsManager.getInstance(appContext)
    private val scope = CoroutineScope(Dispatchers.Main.immediate + Job())

    // SoundPool for game effects
    private val soundPool: SoundPool
    private val soundIdMap = ConcurrentHashMap<GameSfx, Int>()
    private val loadedSounds = ConcurrentHashMap.newKeySet<Int>()

    // MediaPlayer for subtle ambient atmospheric soundscapes
    private var activePlayer: MediaPlayer? = null
    private var fadeJob: Job? = null
    private var currentMood: AmbientMood = AmbientMood.NORMAL
    private var isQuizActive = false
    private var isAmbientDesired = false

    init {
        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_GAME)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        soundPool = SoundPool.Builder()
            .setMaxStreams(10)
            .setAudioAttributes(audioAttributes)
            .build()

        soundPool.setOnLoadCompleteListener { _, sampleId, status ->
            if (status == 0) {
                loadedSounds.add(sampleId)
            }
        }

        // Load all fine-grained sound effects into SoundPool
        load(GameSfx.CLICK_NORMAL, R.raw.sfx_click_normal)
        load(GameSfx.BTN_START, R.raw.sfx_btn_start)
        load(GameSfx.BTN_JOIN, R.raw.sfx_btn_join)
        load(GameSfx.BTN_CREATE, R.raw.sfx_btn_create)
        load(GameSfx.TAP_OPT_A, R.raw.sfx_tap_opt_a)
        load(GameSfx.TAP_OPT_B, R.raw.sfx_tap_opt_b)
        load(GameSfx.TAP_OPT_C, R.raw.sfx_tap_opt_c)
        load(GameSfx.TAP_OPT_D, R.raw.sfx_tap_opt_d)
        load(GameSfx.HINT, R.raw.sfx_hint)
        load(GameSfx.BONUS_REWARD, R.raw.sfx_bonus_reward)
        load(GameSfx.BONUS_CLAIM, R.raw.sfx_bonus_claim)
        load(GameSfx.BONUS_AVAILABLE, R.raw.sfx_bonus_available)
        load(GameSfx.BONUS_UNLOCKED, R.raw.sfx_bonus_unlocked)
        load(GameSfx.BONUS_EXPIRED, R.raw.sfx_bonus_expired)
        load(GameSfx.NAV_BACK, R.raw.sfx_nav_back)
        load(GameSfx.NAV_CLOSE, R.raw.sfx_nav_close)
        load(GameSfx.NAV_SETTINGS, R.raw.sfx_nav_settings)
        load(GameSfx.CHALLENGE_READY, R.raw.sfx_challenge_ready)
        load(GameSfx.CHALLENGE_START, R.raw.sfx_challenge_start)
        load(GameSfx.CHALLENGE_COMPLETE, R.raw.sfx_challenge_complete)
        load(GameSfx.DIFFICULTY_INCREASE, R.raw.sfx_difficulty_increase)
        load(GameSfx.TIMER_10S, R.raw.sfx_timer_10s)
        load(GameSfx.TIMER_5S, R.raw.sfx_timer_5s)
        load(GameSfx.TIMER_FINAL_SEC, R.raw.sfx_timer_final_sec)
        load(GameSfx.CORRECT, R.raw.sfx_correct)
        load(GameSfx.INCORRECT, R.raw.sfx_incorrect)
        load(GameSfx.COMBO_SMALL, R.raw.sfx_combo_small)
        load(GameSfx.COMBO_5, R.raw.sfx_combo_5)
        load(GameSfx.COMBO_10, R.raw.sfx_combo_10)
        load(GameSfx.COMBO_15, R.raw.sfx_combo_15)
        load(GameSfx.COMBO_20, R.raw.sfx_combo_20)
        load(GameSfx.VICTORY, R.raw.sfx_victory)
        load(GameSfx.DEFEAT, R.raw.sfx_defeat)

        // Observe settings changes in real-time
        scope.launch {
            settingsManager.settings.collectLatest { settings ->
                syncAmbientVolume(settings)
            }
        }
    }

    private fun load(sfx: GameSfx, resId: Int) {
        try {
            val id = soundPool.load(appContext, resId, 1)
            soundIdMap[sfx] = id
        } catch (e: Exception) {
            Log.e(TAG, "Error loading sfx $sfx", e)
        }
    }

    private fun play(sfx: GameSfx, priority: Int = 1, rate: Float = 1.0f) {
        val volume = settingsManager.settings.value.effectiveSfxVolume
        if (volume <= 0f) return

        val soundId = soundIdMap[sfx] ?: return
        if (loadedSounds.contains(soundId)) {
            soundPool.play(soundId, volume, volume, priority, 0, rate.coerceIn(0.5f, 2.0f))
        }
    }

    // ------------------------------------------------------------------------
    // Button-Specific Sound Effects
    // ------------------------------------------------------------------------

    fun playButtonTap() = play(GameSfx.CLICK_NORMAL)
    fun playNormalClick() = play(GameSfx.CLICK_NORMAL)
    fun playStartChallenge() = play(GameSfx.BTN_START, priority = 2)
    fun playJoinChallenge() = play(GameSfx.BTN_JOIN, priority = 2)
    fun playCreateChallenge() = play(GameSfx.BTN_CREATE, priority = 2)

    /**
     * Answer Option A, B, C, D have cohesive yet subtly distinct tap frequencies
     */
    fun playOptionTap(optionIndex: Int) {
        when (optionIndex) {
            0 -> play(GameSfx.TAP_OPT_A, priority = 1)
            1 -> play(GameSfx.TAP_OPT_B, priority = 1)
            2 -> play(GameSfx.TAP_OPT_C, priority = 1)
            3 -> play(GameSfx.TAP_OPT_D, priority = 1)
            else -> play(GameSfx.CLICK_NORMAL, priority = 1)
        }
    }

    fun playAnswerSelected() = play(GameSfx.TAP_OPT_A)

    fun playHintDiscovery() = play(GameSfx.HINT, priority = 2)
    fun playBonusReward() = play(GameSfx.BONUS_REWARD, priority = 2)
    fun playBonusClaim() = play(GameSfx.BONUS_CLAIM, priority = 2)
    fun playBonusAvailable() = play(GameSfx.BONUS_AVAILABLE, priority = 1)
    fun playBonusUnlocked() = play(GameSfx.BONUS_UNLOCKED, priority = 2)
    fun playBonusExpired() = play(GameSfx.BONUS_EXPIRED, priority = 1)

    fun playNavBack() = play(GameSfx.NAV_BACK, priority = 1)
    fun playNavClose() = play(GameSfx.NAV_CLOSE, priority = 1)
    fun playNavSettings() = play(GameSfx.NAV_SETTINGS, priority = 1)

    fun playChallengeReady() = play(GameSfx.CHALLENGE_READY, priority = 2)
    fun playChallengeStarted() = play(GameSfx.CHALLENGE_START, priority = 2)
    fun playChallengeStart() = playChallengeStarted()
    fun playChallengeCompleted() = play(GameSfx.CHALLENGE_COMPLETE, priority = 3)
    fun playDifficultyIncrease() = play(GameSfx.DIFFICULTY_INCREASE, priority = 3)

    fun playTimer10sWarning() = play(GameSfx.TIMER_10S, priority = 2)
    fun playTimer5sTick() = play(GameSfx.TIMER_5S, priority = 2)
    fun playTimerFinalSecond() = play(GameSfx.TIMER_FINAL_SEC, priority = 3)
    fun playCountdownTick() = playTimer5sTick()
    fun playTimerWarning() = playTimer10sWarning()

    fun playCorrect() = play(GameSfx.CORRECT, priority = 2)
    fun playCorrectAnswer() = playCorrect()
    fun playIncorrect() = play(GameSfx.INCORRECT, priority = 2)
    fun playSpeedBonus() = play(GameSfx.BONUS_REWARD, priority = 2)

    /**
     * Combo progression:
     * ×1-4: small positive sound
     * ×5: special milestone sound
     * ×10: stronger milestone sound
     * ×15: more exciting sound
     * ×20+: signature high-combo celestial sound
     */
    fun playCombo(combo: Int) {
        when {
            combo <= 0 -> return
            combo == 5 -> play(GameSfx.COMBO_5, priority = 3)
            combo == 10 -> play(GameSfx.COMBO_10, priority = 3)
            combo == 15 -> play(GameSfx.COMBO_15, priority = 3)
            combo >= 20 && combo % 5 == 0 -> play(GameSfx.COMBO_20, priority = 3)
            else -> {
                val rate = 1.0f + ((combo - 1) % 5) * 0.04f
                play(GameSfx.COMBO_SMALL, priority = 1, rate = rate)
            }
        }
    }

    fun playComboMilestone(milestone: Int) = playCombo(milestone)

    fun playVictory() = play(GameSfx.VICTORY, priority = 3)
    fun playDefeat() = play(GameSfx.DEFEAT, priority = 3)
    fun playDraw() = play(GameSfx.CHALLENGE_COMPLETE, priority = 3)
    fun playLobbyJoined() = play(GameSfx.BTN_JOIN, priority = 1)

    // ------------------------------------------------------------------------
    // Dynamic Ambient Soundscape (Peaceful, Spiritual, Calm, Smooth Fades)
    // ------------------------------------------------------------------------

    fun startAmbientMusic(inQuiz: Boolean = false) = startAmbientSoundscape(inQuiz)
    fun startBackgroundMusic(inQuiz: Boolean = false) = startAmbientSoundscape(inQuiz)

    fun startAmbientSoundscape(inQuiz: Boolean = false, mood: AmbientMood = AmbientMood.NORMAL) {
        isQuizActive = inQuiz
        isAmbientDesired = true
        currentMood = mood

        val effectiveVol = settingsManager.settings.value.getEffectiveAmbientVolume(isDucked = isQuizActive)
        if (effectiveVol <= 0f) return

        if (activePlayer == null) {
            setupPlayer(mood, effectiveVol)
        } else {
            smoothFadeVolume(effectiveVol, durationMs = 350)
        }
    }

    fun setAmbientMood(mood: AmbientMood) {
        if (currentMood == mood && activePlayer != null) return
        currentMood = mood
        if (!isAmbientDesired) return

        val targetVol = settingsManager.settings.value.getEffectiveAmbientVolume(isDucked = isQuizActive)
        if (targetVol <= 0f) return

        // Smooth crossfade to the new mood soundscape
        fadeJob?.cancel()
        fadeJob = scope.launch {
            // Fade out current player slightly
            activePlayer?.let { player ->
                val steps = 6
                val currentVol = targetVol
                for (i in steps downTo 1) {
                    val v = currentVol * (i.toFloat() / steps)
                    try { player.setVolume(v, v) } catch (_: Exception) {}
                    delay(35)
                }
                try {
                    player.stop()
                    player.release()
                } catch (_: Exception) {}
            }
            activePlayer = null

            // Setup new player for the mood and smoothly fade in
            setupPlayer(mood, 0f)
            activePlayer?.let { newPlayer ->
                val steps = 8
                for (i in 1..steps) {
                    val v = targetVol * (i.toFloat() / steps)
                    try { newPlayer.setVolume(v, v) } catch (_: Exception) {}
                    delay(40)
                }
            }
        }
    }

    fun setQuizMusicDucking(inQuiz: Boolean) {
        isQuizActive = inQuiz
        val targetVol = settingsManager.settings.value.getEffectiveAmbientVolume(isDucked = isQuizActive)
        smoothFadeVolume(targetVol, durationMs = 400)
    }

    fun fadeOutAmbient(durationMs: Long = 600, onComplete: (() -> Unit)? = null) {
        isAmbientDesired = false
        fadeJob?.cancel()
        fadeJob = scope.launch {
            activePlayer?.let { player ->
                val steps = 10
                val initialVol = settingsManager.settings.value.getEffectiveAmbientVolume(isDucked = isQuizActive)
                for (i in steps downTo 0) {
                    val v = initialVol * (i.toFloat() / steps)
                    try { player.setVolume(v, v) } catch (_: Exception) {}
                    delay(durationMs / steps)
                }
                try {
                    if (player.isPlaying) player.stop()
                    player.release()
                } catch (_: Exception) {}
            }
            activePlayer = null
            onComplete?.invoke()
        }
    }

    fun stopAmbientSoundscape() {
        isAmbientDesired = false
        fadeJob?.cancel()
        try {
            if (activePlayer?.isPlaying == true) {
                activePlayer?.stop()
            }
            activePlayer?.release()
            activePlayer = null
        } catch (e: Exception) {
            Log.w(TAG, "Error stopping ambient player: ${e.message}")
        }
    }

    fun stopAmbientMusic() = stopAmbientSoundscape()
    fun stopBackgroundMusic() = stopAmbientSoundscape()
    fun pauseBackgroundMusic() = stopAmbientSoundscape()
    fun resumeBackgroundMusic() = startAmbientSoundscape(isQuizActive, currentMood)

    private fun setupPlayer(mood: AmbientMood, initialVol: Float) {
        try {
            val rawRes = when (mood) {
                AmbientMood.NORMAL -> R.raw.bgm_ambient
                AmbientMood.HIGH_COMBO -> R.raw.bgm_ambient_high_combo
                AmbientMood.TENSION -> R.raw.bgm_ambient_tension
            }
            val player = MediaPlayer.create(appContext, rawRes)
            if (player != null) {
                player.isLooping = true
                player.setVolume(initialVol, initialVol)
                player.setOnErrorListener { _, what, extra ->
                    Log.w(TAG, "MediaPlayer error: what=$what, extra=$extra")
                    stopAmbientSoundscape()
                    true
                }
                player.start()
                activePlayer = player
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize ambient soundscape", e)
        }
    }

    private fun smoothFadeVolume(targetVol: Float, durationMs: Long = 300) {
        val player = activePlayer ?: return
        fadeJob?.cancel()
        fadeJob = scope.launch {
            val steps = 8
            val currentVol = settingsManager.settings.value.getEffectiveAmbientVolume(isDucked = isQuizActive)
            val diff = targetVol - currentVol
            for (i in 1..steps) {
                val v = (currentVol + diff * (i.toFloat() / steps)).coerceIn(0f, 1f)
                try { player.setVolume(v, v) } catch (_: Exception) {}
                delay(durationMs / steps)
            }
        }
    }

    private fun syncAmbientVolume(settings: AudioSettings) {
        val targetVol = settings.getEffectiveAmbientVolume(isDucked = isQuizActive)
        if (!settings.masterAudioEnabled || !settings.ambientSoundEnabled || targetVol <= 0f) {
            activePlayer?.let { player ->
                try {
                    player.setVolume(0f, 0f)
                    if (player.isPlaying) player.pause()
                } catch (_: Exception) {}
            }
        } else {
            if (activePlayer == null && isAmbientDesired) {
                setupPlayer(currentMood, targetVol)
            } else {
                activePlayer?.let { player ->
                    try {
                        if (!player.isPlaying && isAmbientDesired) player.start()
                        player.setVolume(targetVol, targetVol)
                    } catch (_: Exception) {}
                }
            }
        }
    }

    fun release() {
        stopAmbientSoundscape()
        try {
            soundPool.release()
        } catch (_: Exception) {}
    }

    companion object {
        private const val TAG = "AudioEngine"

        @Volatile
        private var INSTANCE: AudioEngine? = null

        fun getInstance(context: Context): AudioEngine {
            return INSTANCE ?: synchronized(this) {
                val inst = AudioEngine(context)
                INSTANCE = inst
                inst
            }
        }
    }
}
