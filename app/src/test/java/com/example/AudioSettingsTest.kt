package com.example

import com.example.core.audio.AudioSettings
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class AudioSettingsTest {

    @Test
    fun defaultSettings_haveExpectedVolumes() {
        val settings = AudioSettings()
        assertTrue(settings.masterAudioEnabled)
        assertTrue(settings.ambientSoundEnabled)
        assertTrue(settings.soundEffectsEnabled)
        assertTrue(settings.hapticFeedbackEnabled)
        assertEquals(0.85f, settings.masterVolume, 0.001f)
        assertEquals(0.85f, settings.soundEffectsVolume, 0.001f)
        assertEquals(0.40f, settings.ambientVolume, 0.001f)
    }

    @Test
    fun masterMute_silencesAllEffectiveVolumes() {
        val settings = AudioSettings(
            masterAudioEnabled = false,
            masterVolume = 1.0f,
            soundEffectsVolume = 1.0f,
            ambientVolume = 1.0f
        )
        assertEquals(0f, settings.effectiveMasterVolume, 0.001f)
        assertEquals(0f, settings.effectiveSfxVolume, 0.001f)
        assertEquals(0f, settings.getEffectiveAmbientVolume(isDucked = false), 0.001f)
        assertEquals(0f, settings.getEffectiveAmbientVolume(isDucked = true), 0.001f)
    }

    @Test
    fun sfxDisabled_silencesSfxOnly() {
        val settings = AudioSettings(
            soundEffectsEnabled = false,
            ambientSoundEnabled = true,
            masterVolume = 0.8f,
            soundEffectsVolume = 0.9f,
            ambientVolume = 0.5f
        )
        assertEquals(0f, settings.effectiveSfxVolume, 0.001f)
        assertEquals(0.4f, settings.getEffectiveAmbientVolume(isDucked = false), 0.001f)
    }

    @Test
    fun ambientDucking_reducesVolume() {
        val settings = AudioSettings(
            masterVolume = 1.0f,
            ambientVolume = 1.0f
        )
        val normalVol = settings.getEffectiveAmbientVolume(isDucked = false)
        val duckedVol = settings.getEffectiveAmbientVolume(isDucked = true)

        assertEquals(1.0f, normalVol, 0.001f)
        assertEquals(0.35f, duckedVol, 0.001f)
        assertTrue(duckedVol < normalVol)
    }
}
