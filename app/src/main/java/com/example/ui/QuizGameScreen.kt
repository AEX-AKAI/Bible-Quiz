package com.example.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.filled.Tune
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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.core.scoring.ScoringEngine
import com.example.ui.components.PreloadNextQuestionImage
import com.example.ui.components.SoundSettingsDialog
import com.example.ui.components.VisualQuestionCard
import com.example.ui.theme.AmberAccent
import com.example.ui.theme.CrimsonBreak
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldHighlight

/**
 * Redesigned QuizGameScreen adhering strictly to the minimal, fast, focused layout:
 *
 * ┌─────────────────────────────┐
 * │ TIME     SCORE      COMBO   │
 * ├─────────────────────────────┤
 * │                             │
 * │        QUESTION             │
 * │                             │
 * │        [IMAGE]              │
 * │                             │
 * │    ┌───────────────────┐    │
 * │    │ A. Answer         │    │
 * │    └───────────────────┘    │
 * │    │ B. Answer         │    │
 * │    │ C. Answer         │    │
 * │    │ D. Answer         │    │
 * ├─────────────────────────────┤
 * │ 💡 HINT                     │
 * └─────────────────────────────┘
 */
@Composable
fun QuizGameScreen(
    state: QuizUiState,
    onAnswerSelected: (selectedAnswer: String, optionIndex: Int) -> Unit,
    onQuitGame: () -> Unit,
    onHintRequested: () -> Unit = {},
    onClearDifficultyTransition: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val question = state.currentQuestion
    var showSoundDialog by remember { mutableStateOf(false) }
    var isHintExpanded by remember { mutableStateOf(false) }

    // Preload next question's image in background for instantaneous rendering
    val nextQuestion = state.questions.getOrNull(state.currentQuestionIndex + 1)
    PreloadNextQuestionImage(nextQuestion = nextQuestion)

    // Reset hint expansion whenever moving to a new question
    LaunchedEffect(question?.questionId) {
        isHintExpanded = false
    }

    val timeRatio = if (state.totalTimeSeconds > 0) {
        state.timeRemainingSeconds.toFloat() / state.totalTimeSeconds.toFloat()
    } else 0f

    val isTimeUrgent = state.timeRemainingSeconds <= 10

    val timerColor by animateColorAsState(
        targetValue = if (isTimeUrgent) CrimsonBreak else MaterialTheme.colorScheme.primary,
        animationSpec = tween(300),
        label = "timerColor"
    )

    val minutes = state.timeRemainingSeconds / 60
    val seconds = state.timeRemainingSeconds % 60
    val formattedTime = "%02d:%02d".format(minutes, seconds)

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
            modifier = Modifier.fillMaxSize()
        ) {
            // ==========================================
            // TOP BAR: TIME / SCORE / COMBO (Section #18)
            // ==========================================
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("quiz_header_bar"),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 2.dp,
                shadowElevation = 2.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    // Controls row: Exit, Question counter, Audio Settings
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(
                            onClick = onQuitGame,
                            modifier = Modifier
                                .size(36.dp)
                                .testTag("exit_quiz_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Exit Quiz",
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(20.dp)
                            )
                        }

                        // Category & Q Number
                        val qNumber = state.currentQuestionIndex + 1
                        Text(
                            text = "Q#$qNumber • ${question?.category?.uppercase() ?: "BIBLE QUIZ"}",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                            letterSpacing = 0.5.sp
                        )

                        IconButton(
                            onClick = { showSoundDialog = true },
                            modifier = Modifier
                                .size(36.dp)
                                .testTag("sound_settings_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Tune,
                                contentDescription = "Sound Settings",
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Minimal 3-part HUD: TIME | SCORE | COMBO
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // TIME
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = timerColor.copy(alpha = 0.12f),
                            border = BorderStroke(1.dp, timerColor.copy(alpha = 0.4f)),
                            modifier = Modifier.testTag("timer_display")
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Timer,
                                    contentDescription = null,
                                    tint = timerColor,
                                    modifier = Modifier.size(15.dp)
                                )
                                Spacer(modifier = Modifier.width(5.dp))
                                Text(
                                    text = formattedTime,
                                    color = timerColor,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 14.sp
                                )
                            }
                        }

                        // SCORE + Small Inline Transient Feedback (Section #19)
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = "SCORE",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f),
                                    letterSpacing = 0.5.sp
                                )
                                Text(
                                    text = "${state.score.toInt()}",
                                    fontWeight = FontWeight.Black,
                                    fontSize = 16.sp,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    modifier = Modifier.testTag("score_text")
                                )
                            }

                            // Transient speed bonus indicator (+15 / +5 SPEED)
                            AnimatedVisibility(
                                visible = state.isEvaluatingAnswer && state.lastFeedback != null,
                                enter = fadeIn() + expandVertically(),
                                exit = fadeOut() + shrinkVertically()
                            ) {
                                state.lastFeedback?.let { fb ->
                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = if (fb.isCorrect) EmeraldSuccess.copy(alpha = 0.2f) else CrimsonBreak.copy(alpha = 0.2f),
                                        border = BorderStroke(1.dp, if (fb.isCorrect) EmeraldSuccess else CrimsonBreak),
                                        modifier = Modifier.padding(start = 6.dp)
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                text = fb.pointsText,
                                                fontWeight = FontWeight.Black,
                                                fontSize = 11.sp,
                                                color = if (fb.isCorrect) EmeraldSuccess else CrimsonBreak
                                            )
                                            if (fb.speedBonusPoints > 0) {
                                                Spacer(modifier = Modifier.width(3.dp))
                                                Icon(
                                                    imageVector = Icons.Default.Bolt,
                                                    contentDescription = "Speed bonus",
                                                    tint = AmberAccent,
                                                    modifier = Modifier.size(11.dp)
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // COMBO
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = if (state.currentCombo > 0) GoldHighlight.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant,
                            border = if (state.currentCombo > 0) BorderStroke(1.dp, GoldHighlight.copy(alpha = 0.5f)) else null,
                            modifier = Modifier.testTag("combo_display")
                        ) {
                            Text(
                                text = if (state.currentCombo > 0) "COMBO ×${state.currentCombo}" else "COMBO —",
                                modifier = Modifier.padding(horizontal = 9.dp, vertical = 5.dp),
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = if (state.currentCombo > 0) GoldHighlight else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Sleek time progress line
                    LinearProgressIndicator(
                        progress = { timeRatio },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(3.dp)
                            .clip(RoundedCornerShape(2.dp)),
                        color = timerColor,
                        trackColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
                    )
                }
            }

            // =========================================================================
            // CENTER GAMEPLAY: QUESTION -> [IMAGE] -> ANSWER OPTIONS A, B, C, D (Section #10, #12, #16)
            // =========================================================================
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 18.dp, vertical = 10.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Spacer(modifier = Modifier.height(2.dp))

                // 1. PRIMARY FOCUS: QUESTION (Section #10 & #12)
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("question_card"),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f)
                    ),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.15f))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 18.dp, vertical = 14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = question?.question ?: "Loading question...",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            lineHeight = 25.sp,
                            textAlign = TextAlign.Center,
                            color = MaterialTheme.colorScheme.onSurface,
                            modifier = Modifier.testTag("question_text")
                        )
                    }
                }

                // 2. SECONDARY FOCUS: OPTIONAL QUESTION IMAGE (Section #10, #12, #16)
                if (question != null && question.isVisualQuestion) {
                    VisualQuestionCard(
                        question = question,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 4.dp)
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                // 3. PRIMARY INTERACTION: FOUR ANSWER OPTIONS (A, B, C, D) (Section #10, #12, #20)
                val options = question?.options ?: emptyList()
                val labels = listOf("A", "B", "C", "D")

                options.forEachIndexed { index, optionText ->
                    val label = labels.getOrElse(index) { "${index + 1}" }
                    val isSelected = state.selectedOptionFeedback == optionText
                    val isTrueCorrect = optionText == question?.correctAnswer
                    val isEvaluating = state.isEvaluatingAnswer
                    val isCorrectFeedback = state.lastFeedback?.isCorrect == true

                    MinimalAnswerOptionButton(
                        label = label,
                        optionText = optionText,
                        isSelected = isSelected,
                        isTrueCorrect = isTrueCorrect,
                        isEvaluating = isEvaluating,
                        isCorrectFeedback = isCorrectFeedback,
                        onClick = {
                            if (!state.isEvaluatingAnswer && state.isTimerActive && state.timeRemainingSeconds > 0) {
                                onAnswerSelected(optionText, index)
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("option_${label.lowercase()}")
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))
            }

            // =========================================================================
            // BOTTOM: DEDICATED ANCHORED HINT BAR (Sections #11, #13, #14, #15, #24)
            // =========================================================================
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("bottom_hint_surface"),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 3.dp,
                shadowElevation = 4.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    // Expanded Hint Clue Card (Animates slightly upward, never covers options)
                    AnimatedVisibility(
                        visible = isHintExpanded,
                        enter = fadeIn() + expandVertically(),
                        exit = fadeOut() + shrinkVertically()
                    ) {
                        Card(
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = AmberAccent.copy(alpha = 0.12f)
                            ),
                            border = BorderStroke(1.dp, AmberAccent.copy(alpha = 0.4f)),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 8.dp)
                                .testTag("hint_content_card")
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            imageVector = Icons.Default.Lightbulb,
                                            contentDescription = null,
                                            tint = AmberAccent,
                                            modifier = Modifier.size(16.dp)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = "SCRIPTURE CLUE",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 11.sp,
                                            color = AmberAccent,
                                            letterSpacing = 0.5.sp
                                        )
                                    }
                                    IconButton(
                                        onClick = { isHintExpanded = false },
                                        modifier = Modifier.size(24.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Close,
                                            contentDescription = "Close hint",
                                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(4.dp))

                                Text(
                                    text = question?.hintText ?: "No hint available for this question.",
                                    fontSize = 13.sp,
                                    fontStyle = FontStyle.Italic,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    lineHeight = 18.sp
                                )
                            }
                        }
                    }

                    // Compact Anchor Button at the very bottom (Section #11 & #15)
                    Surface(
                        onClick = {
                            if (!isHintExpanded) {
                                onHintRequested()
                            }
                            isHintExpanded = !isHintExpanded
                        },
                        shape = RoundedCornerShape(12.dp),
                        color = if (isHintExpanded) AmberAccent.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                        border = BorderStroke(
                            1.dp,
                            if (isHintExpanded) AmberAccent.copy(alpha = 0.5f) else MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(44.dp)
                            .testTag("bottom_hint_button")
                    ) {
                        Row(
                            modifier = Modifier.fillMaxSize(),
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Lightbulb,
                                contentDescription = null,
                                tint = if (isHintExpanded) AmberAccent else MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(17.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHintExpanded) "HIDE HINT" else "💡 HINT",
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                letterSpacing = 1.sp,
                                color = if (isHintExpanded) AmberAccent else MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
            }
        }

        // Sound & Audio Settings Dialog (Modal overlay when explicitly requested)
        if (showSoundDialog) {
            SoundSettingsDialog(
                onDismiss = { showSoundDialog = false }
            )
        }
    }
}

/**
 * High-performance, clean Answer Option Button (Section #10, #12, #20):
 * - Large 48dp+ touch target
 * - Option badge ("A", "B", "C", "D")
 * - Brief 280ms feedback state with check/cross and color indication
 */
@Composable
private fun MinimalAnswerOptionButton(
    label: String,
    optionText: String,
    isSelected: Boolean,
    isTrueCorrect: Boolean,
    isEvaluating: Boolean,
    isCorrectFeedback: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val (containerColor, borderColor, textColor, badgeColor) = when {
        isEvaluating && isSelected && isCorrectFeedback -> OptionColors(
            container = EmeraldSuccess.copy(alpha = 0.22f),
            border = EmeraldSuccess,
            text = EmeraldSuccess,
            badge = EmeraldSuccess
        )
        isEvaluating && isSelected && !isCorrectFeedback -> OptionColors(
            container = CrimsonBreak.copy(alpha = 0.22f),
            border = CrimsonBreak,
            text = CrimsonBreak,
            badge = CrimsonBreak
        )
        isEvaluating && !isSelected && isTrueCorrect -> OptionColors(
            container = EmeraldSuccess.copy(alpha = 0.12f),
            border = EmeraldSuccess.copy(alpha = 0.8f),
            text = MaterialTheme.colorScheme.onSurface,
            badge = EmeraldSuccess
        )
        else -> OptionColors(
            container = MaterialTheme.colorScheme.surface,
            border = MaterialTheme.colorScheme.outline.copy(alpha = 0.35f),
            text = MaterialTheme.colorScheme.onSurface,
            badge = MaterialTheme.colorScheme.primary
        )
    }

    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(14.dp),
        color = containerColor,
        border = BorderStroke(1.5.dp, borderColor),
        modifier = modifier.height(58.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                // Badge: A, B, C, D
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(badgeColor.copy(alpha = 0.16f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = label,
                        fontWeight = FontWeight.Black,
                        fontSize = 14.sp,
                        color = badgeColor
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Text(
                    text = optionText,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Medium,
                    color = textColor,
                    maxLines = 2
                )
            }

            // Inline Brief Feedback Indicator (Section #20: ✓ Correct / ✕ Incorrect)
            if (isEvaluating && isSelected) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = if (isCorrectFeedback) Icons.Default.Check else Icons.Default.Close,
                        contentDescription = if (isCorrectFeedback) "Correct" else "Incorrect",
                        tint = if (isCorrectFeedback) EmeraldSuccess else CrimsonBreak,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (isCorrectFeedback) "Correct" else "Incorrect",
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        color = if (isCorrectFeedback) EmeraldSuccess else CrimsonBreak
                    )
                }
            }
        }
    }
}

private data class OptionColors(
    val container: androidx.compose.ui.graphics.Color,
    val border: androidx.compose.ui.graphics.Color,
    val text: androidx.compose.ui.graphics.Color,
    val badge: androidx.compose.ui.graphics.Color
)
