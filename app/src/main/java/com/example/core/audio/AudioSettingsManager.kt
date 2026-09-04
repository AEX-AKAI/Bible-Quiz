package com.example.core.audio

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class AudioSettings(
    val soundEffectsEnabled: Boolean = true,
    val musicEnabled: Boolean = true,
    val vibrationEnabled: Boolean = true,
    val masterVolume: Float = 0.85f,
    val sfxVolume: Float = 0.9f,
    val musicVolume: Float = 0.45f
)

class AudioSettingsManager(context: Context) {

    private val prefs: SharedPreferences =
        context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private val _settings = MutableStateFlow(loadSettings())
    val settings: StateFlow<AudioSettings> = _settings.asStateFlow()

    private fun loadSettings(): AudioSettings {
        return AudioSettings(
            soundEffectsEnabled = prefs.getBoolean(KEY_SFX_ENABLED, true),
            musicEnabled = prefs.getBoolean(KEY_MUSIC_ENABLED, true),
            vibrationEnabled = prefs.getBoolean(KEY_VIBRATION_ENABLED, true),
            masterVolume = prefs.getFloat(KEY_MASTER_VOL, 0.85f),
            sfxVolume = prefs.getFloat(KEY_SFX_VOL, 0.9f),
            musicVolume = prefs.getFloat(KEY_MUSIC_VOL, 0.45f)
        )
    }

    fun updateSoundEffects(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_SFX_ENABLED, enabled).apply()
        _settings.value = _settings.value.copy(soundEffectsEnabled = enabled)
    }

    fun updateMusic(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_MUSIC_ENABLED, enabled).apply()
        _settings.value = _settings.value.copy(musicEnabled = enabled)
    }

    fun updateVibration(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_VIBRATION_ENABLED, enabled).apply()
        _settings.value = _settings.value.copy(vibrationEnabled = enabled)
    }

    fun updateMasterVolume(vol: Float) {
        val clamped = vol.coerceIn(0f, 1f)
        prefs.edit().putFloat(KEY_MASTER_VOL, clamped).apply()
        _settings.value = _settings.value.copy(masterVolume = clamped)
    }

    fun updateSfxVolume(vol: Float) {
        val clamped = vol.coerceIn(0f, 1f)
        prefs.edit().putFloat(KEY_SFX_VOL, clamped).apply()
        _settings.value = _settings.value.copy(sfxVolume = clamped)
    }

    fun updateMusicVolume(vol: Float) {
        val clamped = vol.coerceIn(0f, 1f)
        prefs.edit().putFloat(KEY_MUSIC_VOL, clamped).apply()
        _settings.value = _settings.value.copy(musicVolume = clamped)
    }

    companion object {
        private const val PREFS_NAME = "bible_quiz_audio_prefs"
        private const val KEY_SFX_ENABLED = "key_sfx_enabled"
        private const val KEY_MUSIC_ENABLED = "key_music_enabled"
        private const val KEY_VIBRATION_ENABLED = "key_vibration_enabled"
        private const val KEY_MASTER_VOL = "key_master_vol"
        private const val KEY_SFX_VOL = "key_sfx_vol"
        private const val KEY_MUSIC_VOL = "key_music_vol"

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
