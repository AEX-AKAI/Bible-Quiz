package com.example.core.audio

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager

class HapticEngine private constructor(context: Context) {

    private val appContext = context.applicationContext
    private val settingsManager = AudioSettingsManager.getInstance(appContext)

    @Suppress("DEPRECATION")
    private val vibrator: Vibrator? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val vibratorManager = appContext.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
        vibratorManager?.defaultVibrator
    } else {
        appContext.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    }

    private fun isEnabled(): Boolean {
        return settingsManager.settings.value.vibrationEnabled && (vibrator?.hasVibrator() == true)
    }

    fun vibrateCorrect() {
        if (!isEnabled()) return
        vibratePattern(longArrayOf(0, 25), intArrayOf(0, 140))
    }

    fun vibrateIncorrect() {
        if (!isEnabled()) return
        vibratePattern(longArrayOf(0, 50, 40, 50), intArrayOf(0, 180, 0, 120))
    }

    fun vibrateSpeedBonus() {
        if (!isEnabled()) return
        vibratePattern(longArrayOf(0, 15, 25, 20), intArrayOf(0, 180, 0, 240))
    }

    fun vibrateComboMilestone() {
        if (!isEnabled()) return
        vibratePattern(longArrayOf(0, 30, 40, 30, 40, 50), intArrayOf(0, 160, 0, 200, 0, 255))
    }

    fun vibrateButtonTap() {
        if (!isEnabled()) return
        vibratePattern(longArrayOf(0, 10), intArrayOf(0, 80))
    }

    fun vibrateChallengeCompleted() {
        if (!isEnabled()) return
        vibratePattern(longArrayOf(0, 60, 50, 80), intArrayOf(0, 180, 0, 255))
    }

    @Suppress("DEPRECATION")
    private fun vibratePattern(timings: LongArray, amplitudes: IntArray) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val effect = VibrationEffect.createWaveform(timings, amplitudes, -1)
                vibrator?.vibrate(effect)
            } else {
                vibrator?.vibrate(timings.sum())
            }
        } catch (_: Exception) {}
    }

    companion object {
        @Volatile
        private var INSTANCE: HapticEngine? = null

        fun getInstance(context: Context): HapticEngine {
            return INSTANCE ?: synchronized(this) {
                val inst = HapticEngine(context)
                INSTANCE = inst
                inst
            }
        }
    }
}
