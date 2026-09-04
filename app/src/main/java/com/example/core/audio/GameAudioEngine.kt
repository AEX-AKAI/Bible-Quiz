package com.example.core.audio

import android.content.Context

/**
 * Backward-compatibility wrapper for GameAudioEngine delegating to the centralized [AudioEngine].
 */
class GameAudioEngine private constructor(context: Context) {
    private val engine: AudioEngine = AudioEngine.getInstance(context)

    fun playButtonTap() = engine.playButtonTap()
    fun playQuestionAppear() = engine.playChallengeStarted()
    fun playAnswerSelected() = engine.playAnswerSelected()
    fun playCorrect() = engine.playCorrect()
    fun playIncorrect() = engine.playIncorrect()
    fun playSpeedBonus() = engine.playSpeedBonus()
    fun playDifficultyIncrease() = engine.playDifficultyIncrease()
    fun playTimerWarning() = engine.playTimerWarning()
    fun playCountdownTick() = engine.playCountdownTick()
    fun playChallengeCompleted() = engine.playChallengeCompleted()
    fun playVictory() = engine.playVictory()
    fun playDefeat() = engine.playDefeat()
    fun playDraw() = engine.playDraw()
    fun playLobbyJoined() = engine.playLobbyJoined()
    fun playChallengeStarted() = engine.playChallengeStarted()
    fun playCombo(combo: Int) = engine.playCombo(combo)
    fun playComboMilestone(milestone: Int) = engine.playComboMilestone(milestone)
    fun startAmbientMusic(inQuiz: Boolean = false) = engine.startAmbientMusic(inQuiz)
    fun setQuizMusicDucking(inQuiz: Boolean) = engine.setQuizMusicDucking(inQuiz)
    fun stopAmbientMusic() = engine.stopAmbientMusic()

    companion object {
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
