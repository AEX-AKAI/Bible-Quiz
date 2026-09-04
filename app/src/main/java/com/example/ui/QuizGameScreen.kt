package com.example.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.core.scoring.ScoringEngine
import com.example.ui.components.AnimatedScoreDisplay
import com.example.ui.components.DifficultyIncreaseAlert
import com.example.ui.components.FloatingScoreFeedback
import com.example.ui.components.ParticleBurst
import com.example.ui.components.PreloadNextQuestionImage
import com.example.ui.components.SoundSettingsDialog
import com.example.ui.components.TieredComboBadge
import com.example.ui.components.VisualQuestionCard
import com.example.ui.theme.AmberAccent
import com.example.ui.theme.CrimsonBreak
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldHighlight
import com.example.ui.theme.IndigoPrimary
import kotlinx.coroutines.delay

@Composable
fun QuizGameScreen(
    state: QuizUiState,
    onAnswerSelected: (String) -> Unit,
    onQuitGame: () -> Unit,
    onClearDifficultyTransition: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val question = state.currentQuestion
    var showSoundDialog by remember { mutableStateOf(false) }

    // Preload next question's image in background for 0ms latency
    val nextQuestion = state.questions.getOrNull(state.currentQuestionIndex + 1)
    PreloadNextQuestionImage(nextQuestion = nextQuestion)

    val timeRatio = if (state.totalTimeSeconds > 0) {
        state.timeRemainingSeconds.toFloat() / state.totalTimeSeconds.toFloat()
    } else 0f

    val isTimeUrgent = state.timeRemainingSeconds <= 10

    val timerColor by animateColorAsState(
        targetValue = if (isTimeUrgent) CrimsonBreak else MaterialTheme.colorScheme.primary,
        animationSpec = tween(300),
        label = "timerColor"
    )

    // Format remaining time MM:SS
    val minutes = state.timeRemainingSeconds / 60
    val seconds = state.timeRemainingSeconds % 60
    val formattedTime = "%02d:%02d".format(minutes, seconds)

    val comboMultiplier = ScoringEngine.getComboMultiplier(state.currentCombo)

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        MaterialTheme.colorScheme.background,
                        MaterialTheme.colorScheme.surface
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header Bar: Exit + Sound Settings + Time Left + Question Counter
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(
                        onClick = onQuitGame,
                        modifier = Modifier.testTag("exit_quiz_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Exit Quiz",
                            tint = MaterialTheme.colorScheme.onBackground
                        )
                    }

                    IconButton(
                        onClick = { showSoundDialog = true },
                        modifier = Modifier.testTag("sound_settings_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.VolumeUp,
                            contentDescription = "Sound Settings",
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }
                }

                // TIME LEFT DISPLAY
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = timerColor.copy(alpha = 0.15f),
                    border = androidx.compose.foundation.BorderStroke(1.5.dp, timerColor),
                    modifier = Modifier.testTag("timer_display")
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Timer,
                            contentDescription = null,
                            tint = timerColor,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "TIME: $formattedTime",
                            color = timerColor,
                            fontWeight = FontWeight.Black,
                            fontSize = 15.sp
                        )
                    }
                }

                // Question index and stage badge
                val qNumber = state.currentQuestionIndex + 1
                val stage = com.example.core.challenge.QuestionDifficultyStage.calculateDifficulty(qNumber)
                val stageBadgeColor = when (stage) {
                    com.example.core.challenge.QuestionDifficultyStage.EASY -> EmeraldSuccess
                    com.example.core.challenge.QuestionDifficultyStage.EASY_MEDIUM -> IndigoPrimary
                    com.example.core.challenge.QuestionDifficultyStage.MEDIUM -> AmberAccent
                    com.example.core.challenge.QuestionDifficultyStage.MEDIUM_HARD -> GoldHighlight
                    com.example.core.challenge.QuestionDifficultyStage.HARD -> CrimsonBreak
                    com.example.core.challenge.QuestionDifficultyStage.HARD_EXPERT -> CrimsonBreak
                    com.example.core.challenge.QuestionDifficultyStage.EXPERT -> CrimsonBreak
                }

                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = stageBadgeColor.copy(alpha = 0.15f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, stageBadgeColor.copy(alpha = 0.4f))
                    ) {
                        Text(
                            text = stage.displayName,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 5.dp),
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp,
                            color = stageBadgeColor
                        )
                    }

                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant
                    ) {
                        Text(
                            text = "Q#$qNumber",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 5.dp),
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // Time progress bar
            LinearProgressIndicator(
                progress = { timeRatio },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp)),
                color = timerColor,
                trackColor = MaterialTheme.colorScheme.surfaceVariant
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Score & Dynamic Tiered Combo HUD
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Score Box with smooth animated counter
                Card(
                    modifier = Modifier
                        .weight(1f)
                        .testTag("score_card"),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(10.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "SCORE",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
                            letterSpacing = 1.sp
                        )
                        AnimatedScoreDisplay(score = state.score)
                    }
                }

                // Tiered Combo HUD
                Card(
                    modifier = Modifier
                        .weight(1.2f)
                        .testTag("combo_card"),
                    colors = CardDefaults.cardColors(
                        containerColor = if (state.currentCombo > 0) GoldHighlight.copy(alpha = 0.12f)
                        else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                    ),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(10.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        TieredComboBadge(
                            combo = state.currentCombo,
                            multiplier = comboMultiplier
                        )
                        if (state.currentCombo == 0) {
                            Text(
                                text = "Combo multiplier ready",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            // Non-blocking difficulty increase alert banner (every 5 questions)
            state.difficultyTransition?.let { (fromDiff, toDiff) ->
                Spacer(modifier = Modifier.height(8.dp))
                DifficultyIncreaseAlert(
                    fromDifficulty = fromDiff,
                    toDifficulty = toDiff,
                    onDismissed = onClearDifficultyTransition
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Speed Bonus indicator bar (5.0s window countdown)
            SpeedBonusIndicatorBar(
                key = state.currentQuestionIndex,
                isTimerActive = state.isTimerActive
            )

            // Speed feedback transient alert banner
            state.lastFeedback?.let { feedback ->
                Spacer(modifier = Modifier.height(6.dp))
                AnimatedVisibility(
                    visible = true,
                    enter = scaleIn() + fadeIn(),
                    exit = scaleOut() + fadeOut()
                ) {
                    FloatingScoreFeedback(
                        feedback = feedback,
                        responseTimeSeconds = state.lastResponseTimeSeconds
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Question Card + Visual Question Card
            if (question != null) {
                // If question is a visual question, display high-resolution illustration / vector card
                if (question.isVisualQuestion) {
                    VisualQuestionCard(
                        question = question,
                        modifier = Modifier.padding(bottom = 12.dp)
                    )
                }

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("question_card"),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.MenuBook,
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = question.scriptureReference,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                }
                            }

                            Text(
                                text = "${question.category} • ${question.difficulty}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Question Text
                        Text(
                            text = question.question,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface,
                            lineHeight = 25.sp,
                            modifier = Modifier.testTag("question_text")
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Answer Options (A, B, C, D) with interactive response feedback states
                val labels = listOf("A", "B", "C", "D")
                question.options.forEachIndexed { index, optionText ->
                    val label = labels.getOrElse(index) { "${index + 1}" }
                    val isSelected = state.selectedOptionFeedback == optionText
                    val isTrueCorrect = optionText == question.correctAnswer
                    val isEvaluating = state.isEvaluatingAnswer

                    OptionButton(
                        label = label,
                        optionText = optionText,
                        isSelected = isSelected,
                        isTrueCorrect = isTrueCorrect,
                        isEvaluating = isEvaluating,
                        isCorrectFeedback = state.lastFeedback?.isCorrect == true,
                        onClick = {
                            if (!isEvaluating) {
                                onAnswerSelected(optionText)
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .testTag("option_button_$index")
                    )
                }
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Loading next challenge question...",
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }

        // Particle burst overlay for correct answers and milestone combos
        if (state.particleTrigger > 0L) {
            ParticleBurst(
                trigger = state.particleTrigger,
                isMilestone = state.isMilestoneParticle,
                modifier = Modifier.fillMaxSize()
            )
        }

        // Sound Settings Dialog
        if (showSoundDialog) {
            SoundSettingsDialog(onDismiss = { showSoundDialog = false })
        }
    }
}

@Composable
fun OptionButton(
    label: String,
    optionText: String,
    isSelected: Boolean,
    isTrueCorrect: Boolean,
    isEvaluating: Boolean,
    isCorrectFeedback: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Determine high-contrast feedback colors during the 280ms transition
    val (containerColor, borderColor, textColor, badgeColor) = when {
        isEvaluating && isSelected && isCorrectFeedback -> Quadruple(
            EmeraldSuccess.copy(alpha = 0.25f),
            EmeraldSuccess,
            EmeraldSuccess,
            EmeraldSuccess
        )
        isEvaluating && isSelected && !isCorrectFeedback -> Quadruple(
            CrimsonBreak.copy(alpha = 0.25f),
            CrimsonBreak,
            CrimsonBreak,
            CrimsonBreak
        )
        isEvaluating && !isSelected && isTrueCorrect -> Quadruple(
            EmeraldSuccess.copy(alpha = 0.15f),
            EmeraldSuccess,
            MaterialTheme.colorScheme.onSurface,
            EmeraldSuccess
        )
        else -> Quadruple(
            MaterialTheme.colorScheme.surface,
            MaterialTheme.colorScheme.outline.copy(alpha = 0.4f),
            MaterialTheme.colorScheme.onSurface,
            MaterialTheme.colorScheme.primary
        )
    }

    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        color = containerColor,
        border = androidx.compose.foundation.BorderStroke(1.5.dp, borderColor),
        modifier = modifier.height(62.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(badgeColor.copy(alpha = 0.18f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = label,
                        fontWeight = FontWeight.Black,
                        fontSize = 15.sp,
                        color = badgeColor
                    )
                }

                Spacer(modifier = Modifier.width(14.dp))

                Text(
                    text = optionText,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = textColor,
                    maxLines = 2
                )
            }

            // Visual feedback icon if evaluated
            if (isEvaluating && isSelected) {
                Icon(
                    imageVector = if (isCorrectFeedback) Icons.Default.Check else Icons.Default.Close,
                    contentDescription = if (isCorrectFeedback) "Correct" else "Incorrect",
                    tint = if (isCorrectFeedback) EmeraldSuccess else CrimsonBreak,
                    modifier = Modifier.size(24.dp)
                )
            }
        }
    }
}

private data class Quadruple<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)

@Composable
fun SpeedBonusIndicatorBar(key: Any, isTimerActive: Boolean) {
    var progress by remember(key) { mutableFloatStateOf(1f) }

    LaunchedEffect(key, isTimerActive) {
        if (!isTimerActive) return@LaunchedEffect
        val startTime = System.currentTimeMillis()
        val totalMs = 5000L
        while (true) {
            val elapsed = System.currentTimeMillis() - startTime
            val remaining = (totalMs - elapsed).coerceAtLeast(0L)
            progress = remaining.toFloat() / totalMs.toFloat()
            if (remaining <= 0) break
            delay(50L)
        }
    }

    val animatedProgress by animateFloatAsState(
        targetValue = progress,
        animationSpec = tween(50),
        label = "speedProgress"
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Bolt,
                    contentDescription = null,
                    tint = if (progress > 0f) AmberAccent else MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(13.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = if (progress > 0f) "SPEED BONUS WINDOW (5s)" else "SPEED BONUS EXPIRED (+0 bonus)",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (progress > 0f) AmberAccent else MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Text(
                text = "%.1fs".format(progress * 5.0f),
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = if (progress > 0f) AmberAccent else MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        Spacer(modifier = Modifier.height(3.dp))

        LinearProgressIndicator(
            progress = { animatedProgress },
            modifier = Modifier
                .fillMaxWidth()
                .height(4.dp)
                .clip(RoundedCornerShape(2.dp)),
            color = if (progress > 0.4f) EmeraldSuccess else if (progress > 0.1f) AmberAccent else CrimsonBreak,
            trackColor = MaterialTheme.colorScheme.surfaceVariant
        )
    }
}
