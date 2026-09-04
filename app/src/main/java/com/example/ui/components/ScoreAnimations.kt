package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.animateIntAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.ElectricBolt
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
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
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.SpeedFeedbackVisual
import com.example.ui.theme.AmberAccent
import com.example.ui.theme.CrimsonBreak
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldHighlight
import com.example.ui.theme.IndigoDark
import com.example.ui.theme.IndigoPrimary
import kotlinx.coroutines.delay

/**
 * Animated Score Display (e.g. 428 -> 443) with smooth numeric tweening.
 */
@Composable
fun AnimatedScoreDisplay(
    score: Double,
    modifier: Modifier = Modifier
) {
    val animatedScore by animateIntAsState(
        targetValue = score.toInt(),
        animationSpec = tween(durationMillis = 350, easing = FastOutSlowInEasing),
        label = "scoreCounter"
    )

    Text(
        text = "$animatedScore",
        fontSize = 24.sp,
        fontWeight = FontWeight.Black,
        color = GoldHighlight,
        modifier = modifier.testTag("animated_score_text")
    )
}

/**
 * Progressive Tiered Combo HUD:
 * Tier 1 (1-4): Subtle clean indicator
 * Tier 2 (5-9): Pulsing glow + flame badge
 * Tier 3 (10-14): Strong electric glow + lightning aura
 * Tier 4 (15-19): Radiant gold aura + energetic pulses
 * Tier 5 (20+): Fiery legendary flame
 */
@Composable
fun TieredComboBadge(
    combo: Int,
    multiplier: Double,
    modifier: Modifier = Modifier
) {
    if (combo <= 0) return

    val tier = when {
        combo >= 20 -> 5
        combo >= 15 -> 4
        combo >= 10 -> 3
        combo >= 5 -> 2
        else -> 1
    }

    val (tierColor, tierBorder, tierIcon) = when (tier) {
        5 -> Triple(Color(0xFFE11D48), GoldHighlight, Icons.Default.LocalFireDepartment)
        4 -> Triple(GoldHighlight, AmberAccent, Icons.Default.ElectricBolt)
        3 -> Triple(Color(0xFF38BDF8), Color(0xFF0284C7), Icons.Default.Bolt)
        2 -> Triple(AmberAccent, Color(0xFFD97706), Icons.Default.LocalFireDepartment)
        else -> Triple(EmeraldSuccess, Color(0xFF059669), Icons.Default.Bolt)
    }

    val scale by animateFloatAsState(
        targetValue = if (combo >= 5) 1.08f else 1.0f,
        animationSpec = tween(150),
        label = "comboScale"
    )

    Surface(
        shape = RoundedCornerShape(12.dp),
        color = tierColor.copy(alpha = 0.2f),
        border = androidx.compose.foundation.BorderStroke(1.5.dp, tierBorder),
        modifier = modifier
            .scale(scale)
            .testTag("combo_badge_hud")
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = tierIcon,
                contentDescription = null,
                tint = tierColor,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "COMBO ×$combo",
                fontSize = 12.sp,
                fontWeight = FontWeight.Black,
                color = tierColor
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "(%.1fx)".format(multiplier),
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

/**
 * Non-blocking difficulty increase HUD alert (every 5 questions):
 * e.g. "DIFFICULTY INCREASED: EASY → MEDIUM"
 */
@Composable
fun DifficultyIncreaseAlert(
    fromDifficulty: String,
    toDifficulty: String,
    onDismissed: () -> Unit,
    modifier: Modifier = Modifier
) {
    var visible by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        delay(1400L)
        visible = false
        delay(300L)
        onDismissed()
    }

    AnimatedVisibility(
        visible = visible,
        enter = slideInVertically(initialOffsetY = { -it }) + fadeIn(),
        exit = slideOutVertically(targetOffsetY = { -it }) + fadeOut(),
        modifier = modifier
    ) {
        Card(
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(
                containerColor = IndigoDark
            ),
            border = androidx.compose.foundation.BorderStroke(1.5.dp, GoldHighlight),
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 4.dp)
                .testTag("difficulty_increase_banner")
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Surface(
                    shape = CircleShape,
                    color = GoldHighlight.copy(alpha = 0.25f),
                    modifier = Modifier.size(28.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.TrendingUp,
                            contentDescription = null,
                            tint = GoldHighlight,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "DIFFICULTY INCREASED",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        color = GoldHighlight,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "$fromDifficulty → $toDifficulty",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }
    }
}

/**
 * Floating feedback and visual speed response indicator:
 * Displays "+15", "PERFECT! +5 SPEED", "COMBO ×8", Response Time "0.82s"
 */
@Composable
fun FloatingScoreFeedback(
    feedback: SpeedFeedbackVisual,
    responseTimeSeconds: Double,
    modifier: Modifier = Modifier
) {
    val isCorrect = feedback.isCorrect
    val bgColor = if (isCorrect) EmeraldSuccess else CrimsonBreak

    Surface(
        shape = RoundedCornerShape(14.dp),
        color = bgColor,
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .testTag("speed_feedback_banner")
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = feedback.pointsText,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = feedback.title,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White,
                        letterSpacing = 0.5.sp
                    )
                    Text(
                        text = "Response: %.2fs • Speed: %s".format(
                            responseTimeSeconds,
                            if (feedback.speedBonusPoints > 0) "+${feedback.speedBonusPoints}" else "+0"
                        ),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White.copy(alpha = 0.85f)
                    )
                }
            }

            Text(
                text = feedback.comboText,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }
    }
}
