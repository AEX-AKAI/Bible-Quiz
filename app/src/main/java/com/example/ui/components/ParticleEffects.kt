package com.example.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import com.example.ui.theme.AmberAccent
import com.example.ui.theme.EmeraldSuccess
import com.example.ui.theme.GoldHighlight
import com.example.ui.theme.IndigoPrimary
import java.util.Random

private data class SparkleParticle(
    var x: Float,
    var y: Float,
    var vx: Float,
    var vy: Float,
    val color: Color,
    val size: Float,
    var alpha: Float = 1f,
    val decay: Float
)

/**
 * Lightweight 60 FPS canvas particle burst for correct answers and combo milestones.
 * Automatically cleans up after ~500ms without blocking UI or timer.
 */
@Composable
fun ParticleBurst(
    trigger: Any,
    isMilestone: Boolean = false,
    modifier: Modifier = Modifier
) {
    val particles = remember(trigger) { mutableStateListOf<SparkleParticle>() }
    var running by remember(trigger) { mutableStateOf(true) }

    LaunchedEffect(trigger) {
        val random = Random()
        val count = if (isMilestone) 36 else 18
        val colors = if (isMilestone) {
            listOf(GoldHighlight, AmberAccent, Color(0xFFF43F5E), Color(0xFF38BDF8), EmeraldSuccess)
        } else {
            listOf(GoldHighlight, EmeraldSuccess, Color(0xFF86EFAC), AmberAccent)
        }

        particles.clear()
        for (i in 0 until count) {
            val angle = random.nextDouble() * 2.0 * Math.PI
            val speed = if (isMilestone) (random.nextFloat() * 14f + 6f) else (random.nextFloat() * 10f + 4f)
            particles.add(
                SparkleParticle(
                    x = 0f, // Centered
                    y = 0f,
                    vx = (Math.cos(angle) * speed).toFloat(),
                    vy = (Math.sin(angle) * speed).toFloat(),
                    color = colors[random.nextInt(colors.size)],
                    size = random.nextFloat() * 6f + 4f,
                    decay = random.nextFloat() * 0.04f + 0.035f
                )
            )
        }

        // 60 FPS animation loop
        while (running && particles.isNotEmpty()) {
            withFrameNanos {
                val iterator = particles.iterator()
                while (iterator.hasNext()) {
                    val p = iterator.next()
                    p.x += p.vx
                    p.y += p.vy
                    p.vy += 0.35f // Gravity
                    p.alpha -= p.decay
                    if (p.alpha <= 0f) {
                        iterator.remove()
                    }
                }
            }
            if (particles.isEmpty()) {
                running = false
            }
        }
    }

    if (particles.isNotEmpty()) {
        Canvas(modifier = modifier.fillMaxSize()) {
            val cx = size.width / 2f
            val cy = size.height / 2f
            particles.forEach { p ->
                drawCircle(
                    color = p.color.copy(alpha = p.alpha.coerceIn(0f, 1f)),
                    radius = p.size,
                    center = Offset(cx + p.x, cy + p.y)
                )
            }
        }
    }
}

private data class ConfettiPiece(
    var x: Float,
    var y: Float,
    var vx: Float,
    var vy: Float,
    var rotation: Float,
    val rotSpeed: Float,
    val color: Color,
    val width: Float,
    val height: Float
)

/**
 * Celebratory victory confetti shower for Results screen.
 */
@Composable
fun VictoryConfettiShower(
    modifier: Modifier = Modifier
) {
    val confetti = remember { mutableStateListOf<ConfettiPiece>() }

    LaunchedEffect(Unit) {
        val random = Random()
        val colors = listOf(
            GoldHighlight,
            AmberAccent,
            EmeraldSuccess,
            IndigoPrimary,
            Color(0xFF38BDF8),
            Color(0xFFF43F5E),
            Color(0xFFA855F7)
        )

        for (i in 0 until 50) {
            confetti.add(
                ConfettiPiece(
                    x = random.nextFloat() * 1000f - 500f,
                    y = -random.nextFloat() * 600f,
                    vx = (random.nextFloat() - 0.5f) * 4f,
                    vy = random.nextFloat() * 5f + 3f,
                    rotation = random.nextFloat() * 360f,
                    rotSpeed = (random.nextFloat() - 0.5f) * 10f,
                    color = colors[random.nextInt(colors.size)],
                    width = random.nextFloat() * 12f + 8f,
                    height = random.nextFloat() * 8f + 6f
                )
            )
        }

        while (true) {
            withFrameNanos {
                confetti.forEach { c ->
                    c.x += c.vx
                    c.y += c.vy
                    c.rotation += c.rotSpeed
                    if (c.y > 1600f) {
                        c.y = -50f
                    }
                }
            }
        }
    }

    Canvas(modifier = modifier.fillMaxSize()) {
        val cx = size.width / 2f
        confetti.forEach { c ->
            val drawX = cx + c.x
            val drawY = c.y
            drawRect(
                color = c.color,
                topLeft = Offset(drawX, drawY),
                size = androidx.compose.ui.geometry.Size(c.width, c.height)
            )
        }
    }
}
