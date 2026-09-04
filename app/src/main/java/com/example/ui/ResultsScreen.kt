package com.example.ui

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
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Replay
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import com.example.core.audio.AudioEngine
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.AnswerReviewItem
import com.example.data.model.ChallengeResult
import com.example.ui.theme.AmberAccent
import com.example.ui.theme.CrimsonBreak
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldHighlight
import com.example.ui.theme.IndigoDark
import com.example.ui.theme.IndigoPrimary

import androidx.compose.material.icons.filled.Image
import com.example.ui.components.VictoryConfettiShower

@Composable
fun ResultsScreen(
    result: ChallengeResult?,
    matchLeaderboard: List<ChallengeResult>,
    answerHistory: List<AnswerReviewItem>,
    onPlayAgainSameSeed: () -> Unit,
    onNewChallenge: () -> Unit,
    onBackToLobby: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (result == null) {
        Box(modifier = modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No result data available")
        }
        return
    }

    val context = LocalContext.current
    val audioEngine = AudioEngine.getInstance(context)

    var selectedTabIndex by remember { mutableIntStateOf(0) } // 0: Overview & Leaderboard, 1: Question Review
    val isTopScore = matchLeaderboard.isNotEmpty() && matchLeaderboard.first().resultId == result.resultId

    Box(modifier = modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
        Spacer(modifier = Modifier.height(8.dp))

        // Header Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .testTag("challenge_complete_card"),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.linearGradient(
                            colors = listOf(
                                IndigoDark,
                                IndigoPrimary
                            )
                        )
                    )
                    .padding(20.dp)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Surface(
                        shape = CircleShape,
                        color = GoldHighlight.copy(alpha = 0.2f),
                        modifier = Modifier.size(54.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Default.EmojiEvents,
                                contentDescription = null,
                                tint = GoldHighlight,
                                modifier = Modifier.size(32.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "CHALLENGE COMPLETE",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White,
                        letterSpacing = 1.sp
                    )

                    Text(
                        text = "Challenge ID: ${result.challengeId}",
                        fontSize = 12.sp,
                        color = Color.White.copy(alpha = 0.75f),
                        fontWeight = FontWeight.Medium
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "FINAL SCORE",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = GoldHighlight,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "${result.finalScore.toInt()}",
                        fontSize = 42.sp,
                        fontWeight = FontWeight.Black,
                        color = GoldHighlight
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Core Statistics Grid strictly matching Section #14
        Text(
            text = "PERFORMANCE BREAKDOWN",
            fontSize = 13.sp,
            fontWeight = FontWeight.Black,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.fillMaxWidth(),
            letterSpacing = 0.5.sp
        )

        Spacer(modifier = Modifier.height(8.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                StatRow(label = "Questions Answered", value = "${result.questionsAnswered}")
                StatRow(label = "Correct Answers", value = "${result.correctAnswers}", valueColor = EmeraldSuccess)
                StatRow(label = "Incorrect Answers", value = "${result.incorrectAnswers}", valueColor = CrimsonBreak)
                StatRow(label = "Accuracy", value = "%.1f%%".format(result.accuracyPercentage))
                StatRow(label = "Fast Answers (<= 5s)", value = "${result.fastAnswersCount}", valueColor = AmberAccent)
                StatRow(label = "Best Combo", value = "×${result.bestCombo}", valueColor = GoldHighlight)
                StatRow(label = "Average Answer Time", value = "%.1f sec".format(result.averageResponseTimeSeconds))
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Tabs: Match Leaderboard vs Question Review
        TabRow(
            selectedTabIndex = selectedTabIndex,
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
            modifier = Modifier.clip(RoundedCornerShape(12.dp))
        ) {
            Tab(
                selected = selectedTabIndex == 0,
                onClick = { selectedTabIndex = 0 },
                text = { Text("Match Leaderboard", fontWeight = FontWeight.Bold, fontSize = 13.sp) }
            )
            Tab(
                selected = selectedTabIndex == 1,
                onClick = { selectedTabIndex = 1 },
                text = { Text("Scripture Review (${answerHistory.size})", fontWeight = FontWeight.Bold, fontSize = 13.sp) }
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        if (selectedTabIndex == 0) {
            // Leaderboard strictly matching Section #15 and #16 Tie-Breakers
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Rank", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.width(36.dp))
                        Text("Player", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.weight(1.2f))
                        Text("Score", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.width(50.dp), textAlign = TextAlign.End)
                        Text("Correct", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.width(48.dp), textAlign = TextAlign.End)
                        Text("Acc", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.width(48.dp), textAlign = TextAlign.End)
                        Text("Combo", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.width(48.dp), textAlign = TextAlign.End)
                    }

                    matchLeaderboard.forEachIndexed { idx, player ->
                        val isUser = player.playerName == result.playerName
                        val rankText = "${idx + 1}"
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (isUser) MaterialTheme.colorScheme.primary.copy(alpha = 0.15f) else Color.Transparent,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 3.dp)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 8.dp, horizontal = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(rankText, fontWeight = FontWeight.Black, fontSize = 13.sp, color = if (idx == 0) GoldHighlight else MaterialTheme.colorScheme.onSurface, modifier = Modifier.width(36.dp))
                                Text(player.playerName, fontWeight = if (isUser) FontWeight.Black else FontWeight.SemiBold, fontSize = 13.sp, color = if (isUser) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface, modifier = Modifier.weight(1.2f), maxLines = 1)
                                Text("${player.finalScore.toInt()}", fontWeight = FontWeight.Black, fontSize = 13.sp, color = GoldHighlight, modifier = Modifier.width(50.dp), textAlign = TextAlign.End)
                                Text("${player.correctAnswers}", fontWeight = FontWeight.Medium, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface, modifier = Modifier.width(48.dp), textAlign = TextAlign.End)
                                Text("%.1f%%".format(player.accuracyPercentage), fontWeight = FontWeight.Medium, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface, modifier = Modifier.width(48.dp), textAlign = TextAlign.End)
                                Text("×${player.bestCombo}", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = AmberAccent, modifier = Modifier.width(48.dp), textAlign = TextAlign.End)
                            }
                        }
                    }
                }
            }
        } else {
            // Scripture Review list
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                answerHistory.forEach { item ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (item.isCorrect) EmeraldSuccess.copy(alpha = 0.3f) else CrimsonBreak.copy(alpha = 0.3f)
                        )
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = if (item.isCorrect) Icons.Default.CheckCircle else Icons.Default.Close,
                                        contentDescription = null,
                                        tint = if (item.isCorrect) EmeraldSuccess else CrimsonBreak,
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "Q#${item.sequenceNumber} • ${item.question.scriptureReference}",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                }
                                Text(
                                    text = "%.1fs • +${item.pointsEarned.toInt()} pts".format(item.responseTimeSeconds),
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (item.isCorrect) EmeraldSuccess else CrimsonBreak
                                )
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            if (item.question.isVisualQuestion) {
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = MaterialTheme.colorScheme.tertiary.copy(alpha = 0.15f),
                                    modifier = Modifier.padding(bottom = 6.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Image,
                                            contentDescription = null,
                                            tint = MaterialTheme.colorScheme.tertiary,
                                            modifier = Modifier.size(13.dp)
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = "VISUAL: ${item.question.imageAltText ?: item.question.category}",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.tertiary
                                        )
                                    }
                                }
                            }

                            Text(
                                text = item.question.question,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onSurface
                            )

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = "Your Answer: ${item.selectedAnswer}",
                                fontSize = 12.sp,
                                color = if (item.isCorrect) EmeraldSuccess else CrimsonBreak,
                                fontWeight = FontWeight.Medium
                            )

                            if (!item.isCorrect) {
                                Text(
                                    text = "Correct: ${item.question.correctAnswer}",
                                    fontSize = 12.sp,
                                    color = EmeraldSuccess,
                                    fontWeight = FontWeight.Bold
                                )
                            }

                            if (item.question.explanation.isNotBlank()) {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = item.question.explanation,
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Action Buttons
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Button(
                onClick = {
                    audioEngine.playStartChallenge()
                    onPlayAgainSameSeed()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
                    .testTag("play_again_same_seed_button"),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
            ) {
                Icon(imageVector = Icons.Default.Replay, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("REPLAY SAME SEED (IDENTICAL QUESTIONS)", fontWeight = FontWeight.Bold, fontSize = 13.sp)
            }

            Button(
                onClick = {
                    audioEngine.playStartChallenge()
                    onNewChallenge()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
                    .testTag("new_challenge_button"),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AmberAccent)
            ) {
                Icon(imageVector = Icons.Default.Refresh, contentDescription = null, tint = Color.Black)
                Spacer(modifier = Modifier.width(8.dp))
                Text("NEW RANDOMIZED CHALLENGE", fontWeight = FontWeight.Bold, color = Color.Black, fontSize = 13.sp)
            }

            OutlinedButton(
                onClick = {
                    audioEngine.playNavBack()
                    onBackToLobby()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
                    .testTag("lobby_return_button"),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(imageVector = Icons.Default.Home, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("LOBBY & CHALLENGES", fontWeight = FontWeight.Bold, fontSize = 13.sp)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
        }

        // Victory Confetti Shower if player takes #1 or gets high accuracy (>= 75%)
        if (isTopScore || result.accuracyPercentage >= 75.0) {
            VictoryConfettiShower(
                modifier = Modifier.fillMaxSize()
            )
        }
    }
}

@Composable
fun StatRow(
    label: String,
    value: String,
    valueColor: Color = MaterialTheme.colorScheme.onSurface
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 5.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            fontSize = 13.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = valueColor
        )
    }
}
