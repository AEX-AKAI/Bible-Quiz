package com.example.core.audio

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class AudioSettings(
    val masterAudioEnabled: Boolean = true,
    val ambientSoundEnabled: Boolean = true,
    val soundEffectsEnabled: Boolean = true,
    val hapticFeedbackEnabled: Boolean = true,
    val masterVolume: Float = 0.85f,
    val ambientVolume: Float = 0.40f,
    val soundEffectsVolume: Float = 0.85f
) {
    // Backward compatibility aliases
    val isMasterMuted: Boolean get() = !masterAudioEnabled
    val musicEnabled: Boolean get() = ambientSoundEnabled
    val vibrationEnabled: Boolean get() = hapticFeedbackEnabled
    val sfxVolume: Float get() = soundEffectsVolume
    val musicVolume: Float get() = ambientVolume

    val effectiveMasterVolume: Float
        get() = if (masterAudioEnabled) masterVolume.coerceIn(0f, 1f) else 0f

    val effectiveSfxVolume: Float
        get() {
            if (!masterAudioEnabled || !soundEffectsEnabled) return 0f
            return (effectiveMasterVolume * soundEffectsVolume).coerceIn(0f, 1f)
        }

    fun getEffectiveAmbientVolume(isDucked: Boolean = false): Float {
        if (!masterAudioEnabled || !ambientSoundEnabled) return 0f
        val duckFactor = if (isDucked) 0.35f else 1.0f
        return (effectiveMasterVolume * ambientVolume * duckFactor).coerceIn(0f, 1f)
    }

    // Alias for existing usages
    fun getEffectiveMusicVolume(isDucked: Boolean = false): Float = getEffectiveAmbientVolume(isDucked)
}

class AudioSettingsManager(context: Context) {

    private val prefs: SharedPreferences =
        context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private val _settings = MutableStateFlow(loadSettings())
    val settings: StateFlow<AudioSettings> = _settings.asStateFlow()

    private fun loadSettings(): AudioSettings {
        return AudioSettings(
            masterAudioEnabled = prefs.getBoolean(KEY_MASTER_AUDIO, true),
            ambientSoundEnabled = prefs.getBoolean(KEY_AMBIENT_SOUND, true),
            soundEffectsEnabled = prefs.getBoolean(KEY_SFX_ENABLED, true),
            hapticFeedbackEnabled = prefs.getBoolean(KEY_HAPTIC_FEEDBACK, true),
            masterVolume = prefs.getFloat(KEY_MASTER_VOL, 0.85f),
            ambientVolume = prefs.getFloat(KEY_AMBIENT_VOL, 0.40f),
            soundEffectsVolume = prefs.getFloat(KEY_SFX_VOL, 0.85f)
        )
    }

    fun updateMasterAudio(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_MASTER_AUDIO, enabled).apply()
        _settings.value = _settings.value.copy(masterAudioEnabled = enabled)
    }

    fun updateMasterMuted(muted: Boolean) {
        updateMasterAudio(!muted)
    }

    fun updateAmbientSound(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_AMBIENT_SOUND, enabled).apply()
        _settings.value = _settings.value.copy(ambientSoundEnabled = enabled)
    }

    fun updateMusic(enabled: Boolean) = updateAmbientSound(enabled)

    fun updateSoundEffects(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_SFX_ENABLED, enabled).apply()
        _settings.value = _settings.value.copy(soundEffectsEnabled = enabled)
    }

    fun updateHapticFeedback(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_HAPTIC_FEEDBACK, enabled).apply()
        _settings.value = _settings.value.copy(hapticFeedbackEnabled = enabled)
    }

    fun updateVibration(enabled: Boolean) = updateHapticFeedback(enabled)

    fun updateMasterVolume(vol: Float) {
        val clamped = vol.coerceIn(0f, 1f)
        prefs.edit().putFloat(KEY_MASTER_VOL, clamped).apply()
        _settings.value = _settings.value.copy(masterVolume = clamped)
    }

    fun updateAmbientVolume(vol: Float) {
        val clamped = vol.coerceIn(0f, 1f)
        prefs.edit().putFloat(KEY_AMBIENT_VOL, clamped).apply()
        _settings.value = _settings.value.copy(ambientVolume = clamped)
    }

    fun updateMusicVolume(vol: Float) = updateAmbientVolume(vol)

    fun updateSoundEffectsVolume(vol: Float) {
        val clamped = vol.coerceIn(0f, 1f)
        prefs.edit().putFloat(KEY_SFX_VOL, clamped).apply()
        _settings.value = _settings.value.copy(soundEffectsVolume = clamped)
    }

    fun updateSfxVolume(vol: Float) = updateSoundEffectsVolume(vol)

    companion object {
        private const val PREFS_NAME = "bible_quiz_audio_prefs"
        private const val KEY_MASTER_AUDIO = "key_master_audio_enabled"
        private const val KEY_AMBIENT_SOUND = "key_ambient_sound_enabled"
        private const val KEY_SFX_ENABLED = "key_sfx_enabled"
        private const val KEY_HAPTIC_FEEDBACK = "key_haptic_feedback_enabled"
        private const val KEY_MASTER_VOL = "key_master_vol"
        private const val KEY_AMBIENT_VOL = "key_ambient_vol"
        private const val KEY_SFX_VOL = "key_sfx_vol"

        @Volatile
        private var INSTANCE: AudioSettingsManager? = null

        fun getInstance(context: Context): AudioSettingsManager {
            return INSTANCE ?: synchronized(this) {
                val inst = AudioSettingsManager(context)
                INSTANCE = inst
                inst
            }
        }
    }
}
