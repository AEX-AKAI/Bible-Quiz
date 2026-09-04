package com.example.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import com.example.ui.theme.AmberAccent
import com.example.ui.theme.GoldHighlight
import com.example.ui.theme.IndigoDark
import com.example.ui.theme.IndigoPrimary

/**
 * High-quality offline biblical vector art renderer.
 * Provides instant zero-network visual illustrations for visual questions
 * ensuring offline mode is 100% playable with vibrant, polished graphics.
 */
@Composable
fun BibleVisualArt(
    imageId: String,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        IndigoDark,
                        Color(0xFF1E1B4B),
                        Color(0xFF0F172A)
                    )
                )
            )
            .padding(16.dp)
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            when {
                imageId.contains("ark_covenant", ignoreCase = true) -> drawArkOfCovenant()
                imageId.contains("menorah", ignoreCase = true) -> drawGoldenMenorah()
                imageId.contains("scroll", ignoreCase = true) -> drawAncientScroll()
                imageId.contains("alabaster", ignoreCase = true) -> drawAlabasterJar()
                imageId.contains("shekel", ignoreCase = true) || imageId.contains("coin", ignoreCase = true) -> drawAncientCoin()
                imageId.contains("staff", ignoreCase = true) || imageId.contains("shepherd", ignoreCase = true) -> drawShepherdsStaff()
                imageId.contains("breastplate", ignoreCase = true) -> drawHighPriestBreastplate()
                imageId.contains("map_galilee", ignoreCase = true) -> drawMapGalilee()
                imageId.contains("map_israel", ignoreCase = true) || imageId.contains("map", ignoreCase = true) -> drawBiblicalMap()
                imageId.contains("mount_sinai", ignoreCase = true) || imageId.contains("sinai", ignoreCase = true) -> drawMountSinai()
                imageId.contains("jerusalem", ignoreCase = true) || imageId.contains("temple", ignoreCase = true) -> drawAncientJerusalem()
                imageId.contains("sea_galilee", ignoreCase = true) || imageId.contains("galilee", ignoreCase = true) -> drawSeaOfGalilee()
                imageId.contains("bethlehem", ignoreCase = true) -> drawBethlehemScene()
                imageId.contains("burning_bush", ignoreCase = true) -> drawBurningBush()
                imageId.contains("red_sea", ignoreCase = true) -> drawPartingRedSea()
                imageId.contains("noah_ark", ignoreCase = true) || imageId.contains("dove", ignoreCase = true) -> drawNoahsArk()
                imageId.contains("loaves", ignoreCase = true) || imageId.contains("fish", ignoreCase = true) -> drawLoavesAndFishes()
                imageId.contains("tablets", ignoreCase = true) || imageId.contains("moses", ignoreCase = true) -> drawStoneTablets()
                imageId.contains("harp", ignoreCase = true) || imageId.contains("david", ignoreCase = true) -> drawDavidsHarp()
                imageId.contains("storm", ignoreCase = true) -> drawStormOnSea()
                else -> drawGenericBiblicalIcon()
            }
        }
    }
}

private fun DrawScope.drawArkOfCovenant() {
    val w = size.width
    val h = size.height

    // Radiance glow
    drawCircle(
        brush = Brush.radialGradient(
            colors = listOf(GoldHighlight.copy(alpha = 0.4f), Color.Transparent),
            center = Offset(w * 0.5f, h * 0.5f),
            radius = w * 0.45f
        )
    )

    // Ark Chest Body (Acacia overlaid with pure gold)
    val chestW = w * 0.52f
    val chestH = h * 0.28f
    val chestLeft = (w - chestW) / 2f
    val chestTop = h * 0.52f

    drawRoundRect(
        color = GoldHighlight,
        topLeft = Offset(chestLeft, chestTop),
        size = Size(chestW, chestH),
        cornerRadius = CornerRadius(6.dp.toPx(), 6.dp.toPx())
    )

    // Golden molding rim
    drawRect(
        color = AmberAccent,
        topLeft = Offset(chestLeft - 6.dp.toPx(), chestTop - 8.dp.toPx()),
        size = Size(chestW + 12.dp.toPx(), 10.dp.toPx())
    )

    // Mercy Seat (Lid)
    drawRoundRect(
        color = Color(0xFFFDE047),
        topLeft = Offset(chestLeft - 4.dp.toPx(), chestTop - 18.dp.toPx()),
        size = Size(chestW + 8.dp.toPx(), 12.dp.toPx()),
        cornerRadius = CornerRadius(4.dp.toPx(), 4.dp.toPx())
    )

    // Carrying Poles
    val poleY = chestTop + chestH * 0.6f
    drawLine(
        color = Color(0xFFD97706),
        start = Offset(w * 0.12f, poleY),
        end = Offset(w * 0.88f, poleY),
        strokeWidth = 6.dp.toPx()
    )

    // Cherubim Wings arching over Mercy Seat
    val cherubPathLeft = Path().apply {
        moveTo(chestLeft + 16.dp.toPx(), chestTop - 18.dp.toPx())
        cubicTo(
            chestLeft - 20.dp.toPx(), h * 0.28f,
            w * 0.42f, h * 0.22f,
            w * 0.48f, h * 0.28f
        )
        lineTo(w * 0.44f, h * 0.32f)
        cubicTo(
            w * 0.38f, h * 0.32f,
            chestLeft + 8.dp.toPx(), h * 0.38f,
            chestLeft + 16.dp.toPx(), chestTop - 18.dp.toPx()
        )
    }
    drawPath(cherubPathLeft, color = GoldHighlight)

    val cherubPathRight = Path().apply {
        moveTo(chestLeft + chestW - 16.dp.toPx(), chestTop - 18.dp.toPx())
        cubicTo(
            chestLeft + chestW + 20.dp.toPx(), h * 0.28f,
            w * 0.58f, h * 0.22f,
            w * 0.52f, h * 0.28f
        )
        lineTo(w * 0.56f, h * 0.32f)
        cubicTo(
            w * 0.62f, h * 0.32f,
            chestLeft + chestW - 8.dp.toPx(), h * 0.38f,
            chestLeft + chestW - 16.dp.toPx(), chestTop - 18.dp.toPx()
        )
    }
    drawPath(cherubPathRight, color = GoldHighlight)
}

private fun DrawScope.drawGoldenMenorah() {
    val w = size.width
    val h = size.height
    val cx = w * 0.5f

    // Base pedestal
    val basePath = Path().apply {
        moveTo(cx - 36.dp.toPx(), h * 0.88f)
        lineTo(cx + 36.dp.toPx(), h * 0.88f)
        lineTo(cx + 20.dp.toPx(), h * 0.82f)
        lineTo(cx - 20.dp.toPx(), h * 0.82f)
        close()
    }
    drawPath(basePath, color = GoldHighlight)

    // Central Shaft
    drawLine(
        color = GoldHighlight,
        start = Offset(cx, h * 0.82f),
        end = Offset(cx, h * 0.24f),
        strokeWidth = 8.dp.toPx()
    )

    // 3 pairs of curved branches
    val branchRadii = listOf(w * 0.12f, w * 0.22f, w * 0.32f)
    val branchTops = listOf(h * 0.58f, h * 0.66f, h * 0.74f)

    branchRadii.forEachIndexed { i, radius ->
        val branchY = branchTops[i]
        // Left Branch
        val leftPath = Path().apply {
            moveTo(cx, branchY)
            cubicTo(
                cx - radius * 0.6f, branchY,
                cx - radius, branchY - radius * 0.4f,
                cx - radius, h * 0.24f
            )
        }
        drawPath(leftPath, color = GoldHighlight, style = Stroke(width = 6.dp.toPx()))

        // Right Branch
        val rightPath = Path().apply {
            moveTo(cx, branchY)
            cubicTo(
                cx + radius * 0.6f, branchY,
                cx + radius, branchY - radius * 0.4f,
                cx + radius, h * 0.24f
            )
        }
        drawPath(rightPath, color = GoldHighlight, style = Stroke(width = 6.dp.toPx()))
    }

    // 7 Lamps with golden flame bowls
    val lampPositions = listOf(
        cx - branchRadii[2],
        cx - branchRadii[1],
        cx - branchRadii[0],
        cx,
        cx + branchRadii[0],
        cx + branchRadii[1],
        cx + branchRadii[2]
    )

    lampPositions.forEach { x ->
        // Oil bowl
        drawArc(
            color = AmberAccent,
            startAngle = 0f,
            sweepAngle = 180f,
            useCenter = true,
            topLeft = Offset(x - 8.dp.toPx(), h * 0.22f),
            size = Size(16.dp.toPx(), 10.dp.toPx())
        )
        // Olive oil flame
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(Color(0xFFFEF08A), Color(0xFFF97316), Color.Transparent),
                center = Offset(x, h * 0.18f),
                radius = 12.dp.toPx()
            ),
            radius = 12.dp.toPx(),
            center = Offset(x, h * 0.18f)
        )
    }
}

private fun DrawScope.drawAncientScroll() {
    val w = size.width
    val h = size.height

    // Parchment parchment sheet
    val parchmentLeft = w * 0.25f
    val parchmentRight = w * 0.75f
    val parchmentTop = h * 0.25f
    val parchmentBottom = h * 0.75f

    drawRoundRect(
        color = Color(0xFFFEF3C7),
        topLeft = Offset(parchmentLeft, parchmentTop),
        size = Size(parchmentRight - parchmentLeft, parchmentBottom - parchmentTop),
        cornerRadius = CornerRadius(6.dp.toPx(), 6.dp.toPx())
    )

    // Hebrew-style scripture lines
    for (i in 0..7) {
        val y = parchmentTop + 24.dp.toPx() + i * 16.dp.toPx()
        drawLine(
            color = Color(0xFF78350F).copy(alpha = 0.7f),
            start = Offset(parchmentLeft + 20.dp.toPx(), y),
            end = Offset(parchmentRight - 20.dp.toPx(), y),
            strokeWidth = 3.dp.toPx()
        )
    }

    // Wooden Rollers (Etz Chayim)
    val rollerWidth = 18.dp.toPx()
    val rollerHeight = (parchmentBottom - parchmentTop) + 40.dp.toPx()

    // Left Roller
    drawRoundRect(
        color = Color(0xFF92400E),
        topLeft = Offset(parchmentLeft - rollerWidth * 0.6f, parchmentTop - 20.dp.toPx()),
        size = Size(rollerWidth, rollerHeight),
        cornerRadius = CornerRadius(6.dp.toPx(), 6.dp.toPx())
    )
    // Left Knobs
    drawCircle(GoldHighlight, radius = 12.dp.toPx(), center = Offset(parchmentLeft, parchmentTop - 20.dp.toPx()))
    drawCircle(GoldHighlight, radius = 12.dp.toPx(), center = Offset(parchmentLeft, parchmentBottom + 20.dp.toPx()))

    // Right Roller
    drawRoundRect(
        color = Color(0xFF92400E),
        topLeft = Offset(parchmentRight - rollerWidth * 0.4f, parchmentTop - 20.dp.toPx()),
        size = Size(rollerWidth, rollerHeight),
        cornerRadius = CornerRadius(6.dp.toPx(), 6.dp.toPx())
    )
    // Right Knobs
    drawCircle(GoldHighlight, radius = 12.dp.toPx(), center = Offset(parchmentRight, parchmentTop - 20.dp.toPx()))
    drawCircle(GoldHighlight, radius = 12.dp.toPx(), center = Offset(parchmentRight, parchmentBottom + 20.dp.toPx()))
}

private fun DrawScope.drawAlabasterJar() {
    val w = size.width
    val h = size.height
    val cx = w * 0.5f

    val jarPath = Path().apply {
        moveTo(cx - 14.dp.toPx(), h * 0.22f) // Lip left
        lineTo(cx + 14.dp.toPx(), h * 0.22f) // Lip right
        lineTo(cx + 10.dp.toPx(), h * 0.32f) // Neck right
        cubicTo(
            cx + 42.dp.toPx(), h * 0.42f,
            cx + 46.dp.toPx(), h * 0.68f,
            cx + 18.dp.toPx(), h * 0.82f // Base right
        )
        lineTo(cx - 18.dp.toPx(), h * 0.82f) // Base left
        cubicTo(
            cx - 46.dp.toPx(), h * 0.68f,
            cx - 42.dp.toPx(), h * 0.42f,
            cx - 10.dp.toPx(), h * 0.32f // Neck left
        )
        close()
    }

    // Alabaster stone texture (smooth ivory & soft cream)
    drawPath(
        path = jarPath,
        brush = Brush.linearGradient(
            colors = listOf(Color(0xFFFFFFFF), Color(0xFFF1F5F9), Color(0xFFE2E8F0)),
            start = Offset(cx - 40.dp.toPx(), h * 0.2f),
            end = Offset(cx + 40.dp.toPx(), h * 0.8f)
        )
    )

    // Golden neck band
    drawRoundRect(
        color = GoldHighlight,
        topLeft = Offset(cx - 12.dp.toPx(), h * 0.30f),
        size = Size(24.dp.toPx(), 6.dp.toPx()),
        cornerRadius = CornerRadius(2.dp.toPx(), 2.dp.toPx())
    )
}

private fun DrawScope.drawAncientCoin() {
    val w = size.width
    val h = size.height
    val center = Offset(w * 0.5f, h * 0.5f)
    val radius = w * 0.32f

    // Ancient Silver Tyrian Shekel / Widow's Mite
    drawCircle(
        brush = Brush.radialGradient(
            colors = listOf(Color(0xFFE2E8F0), Color(0xFF94A3B8), Color(0xFF475569)),
            center = center,
            radius = radius
        ),
        radius = radius,
        center = center
    )

    // Beaded Rim
    drawCircle(
        color = Color(0xFFCBD5E1),
        radius = radius - 6.dp.toPx(),
        center = center,
        style = Stroke(width = 3.dp.toPx())
    )

    // Pomegranate / Chalice motif in relief
    val chalicePath = Path().apply {
        moveTo(center.x - 22.dp.toPx(), center.y - 12.dp.toPx())
        lineTo(center.x + 22.dp.toPx(), center.y - 12.dp.toPx())
        cubicTo(
            center.x + 18.dp.toPx(), center.y + 16.dp.toPx(),
            center.x - 18.dp.toPx(), center.y + 16.dp.toPx(),
            center.x - 22.dp.toPx(), center.y - 12.dp.toPx()
        )
    }
    drawPath(chalicePath, color = Color(0xFFF8FAFC).copy(alpha = 0.85f))
    drawLine(
        color = Color(0xFFF8FAFC),
        start = Offset(center.x, center.y + 14.dp.toPx()),
        end = Offset(center.x, center.y + 28.dp.toPx()),
        strokeWidth = 4.dp.toPx()
    )
    drawRoundRect(
        color = Color(0xFFF8FAFC),
        topLeft = Offset(center.x - 16.dp.toPx(), center.y + 26.dp.toPx()),
        size = Size(32.dp.toPx(), 5.dp.toPx()),
        cornerRadius = CornerRadius(2.dp.toPx(), 2.dp.toPx())
    )
}

private fun DrawScope.drawShepherdsStaff() {
    val w = size.width
    val h = size.height

    // Crook curve + shaft
    val staffPath = Path().apply {
        moveTo(w * 0.42f, h * 0.28f)
        cubicTo(
            w * 0.42f, h * 0.12f,
            w * 0.65f, h * 0.12f,
            w * 0.65f, h * 0.28f
        )
        lineTo(w * 0.65f, h * 0.88f)
    }

    drawPath(
        staffPath,
        color = Color(0xFFB45309),
        style = Stroke(width = 12.dp.toPx(), cap = androidx.compose.ui.graphics.StrokeCap.Round)
    )

    // Polished grain highlight
    val highlightPath = Path().apply {
        moveTo(w * 0.44f, h * 0.26f)
        cubicTo(
            w * 0.44f, h * 0.15f,
            w * 0.63f, h * 0.15f,
            w * 0.63f, h * 0.28f
        )
        lineTo(w * 0.63f, h * 0.86f)
    }
    drawPath(
        highlightPath,
        color = Color(0xFFFDE68A),
        style = Stroke(width = 3.dp.toPx(), cap = androidx.compose.ui.graphics.StrokeCap.Round)
    )
}

private fun DrawScope.drawHighPriestBreastplate() {
    val w = size.width
    val h = size.height

    // Gold square breastplate (Hoshen)
    val bpW = w * 0.65f
    val bpH = h * 0.65f
    val bpLeft = (w - bpW) / 2f
    val bpTop = (h - bpH) / 2f

    drawRoundRect(
        color = GoldHighlight,
        topLeft = Offset(bpLeft, bpTop),
        size = Size(bpW, bpH),
        cornerRadius = CornerRadius(10.dp.toPx(), 10.dp.toPx())
    )

    // 12 Precious Gemstones (4 rows of 3)
    val gemColors = listOf(
        Color(0xFFEF4444), Color(0xFF3B82F6), Color(0xFF10B981), // Sardius, Topaz, Carbuncle
        Color(0xFF06B6D4), Color(0xFF6366F1), Color(0xFFEC4899), // Emerald, Sapphire, Diamond
        Color(0xFFF59E0B), Color(0xFF8B5CF6), Color(0xFF14B8A6), // Jacinth, Agate, Amethyst
        Color(0xFFF97316), Color(0xFF84CC16), Color(0xFFE11D48)  // Beryl, Onyx, Jasper
    )

    val cellW = bpW / 3f
    val cellH = bpH / 4f

    gemColors.forEachIndexed { i, color ->
        val col = i % 3
        val row = i / 3
        val gemCx = bpLeft + col * cellW + cellW * 0.5f
        val gemCy = bpTop + row * cellH + cellH * 0.5f

        // Gold bezel
        drawCircle(color = Color(0xFFB45309), radius = 14.dp.toPx(), center = Offset(gemCx, gemCy))
        // Gem
        drawCircle(color = color, radius = 11.dp.toPx(), center = Offset(gemCx, gemCy))
        // Highlight glint
        drawCircle(color = Color.White.copy(alpha = 0.7f), radius = 3.dp.toPx(), center = Offset(gemCx - 4.dp.toPx(), gemCy - 4.dp.toPx()))
    }
}

private fun DrawScope.drawMapGalilee() {
    val w = size.width
    val h = size.height

    // Land terrain
    drawRect(color = Color(0xFFD4B996)) // Sandy hills

    // Sea of Galilee (Harp-shaped water body)
    val seaPath = Path().apply {
        moveTo(w * 0.45f, h * 0.22f) // Jordan river entry north
        cubicTo(
            w * 0.78f, h * 0.32f,
            w * 0.72f, h * 0.62f,
            w * 0.48f, h * 0.74f // South end
        )
        cubicTo(
            w * 0.28f, h * 0.62f,
            w * 0.25f, h * 0.32f,
            w * 0.45f, h * 0.22f
        )
        close()
    }
    drawPath(seaPath, color = Color(0xFF0284C7))

    // Jordan River (entering from north and exiting to south)
    drawLine(Color(0xFF0284C7), Offset(w * 0.45f, h * 0.08f), Offset(w * 0.45f, h * 0.22f), strokeWidth = 5.dp.toPx())
    drawLine(Color(0xFF0284C7), Offset(w * 0.48f, h * 0.74f), Offset(w * 0.50f, h * 0.92f), strokeWidth = 5.dp.toPx())

    // Cities marker pins: Capernaum (NW shore), Tiberias (W shore), Bethsaida (NE shore)
    drawCircle(Color.Red, radius = 6.dp.toPx(), center = Offset(w * 0.36f, h * 0.28f)) // Capernaum
    drawCircle(Color.Red, radius = 6.dp.toPx(), center = Offset(w * 0.30f, h * 0.52f)) // Tiberias
    drawCircle(Color.Red, radius = 6.dp.toPx(), center = Offset(w * 0.62f, h * 0.28f)) // Bethsaida
}

private fun DrawScope.drawBiblicalMap() {
    val w = size.width
    val h = size.height

    // Mediterranean Coastline on left
    val landPath = Path().apply {
        moveTo(w * 0.25f, 0f)
        cubicTo(w * 0.28f, h * 0.3f, w * 0.18f, h * 0.6f, w * 0.14f, h)
        lineTo(w, h)
        lineTo(w, 0f)
        close()
    }
    drawRect(color = Color(0xFF0284C7)) // Mediterranean sea
    drawPath(landPath, color = Color(0xFFD4B996)) // Ancient Israel land

    // Sea of Galilee & Dead Sea & Jordan
    drawCircle(Color(0xFF0284C7), radius = 12.dp.toPx(), center = Offset(w * 0.72f, h * 0.28f)) // Sea of Galilee
    val deadSea = Path().apply {
        moveTo(w * 0.74f, h * 0.62f)
        cubicTo(w * 0.78f, h * 0.70f, w * 0.76f, h * 0.82f, w * 0.72f, h * 0.88f)
        cubicTo(w * 0.68f, h * 0.82f, w * 0.68f, h * 0.70f, w * 0.74f, h * 0.62f)
    }
    drawPath(deadSea, color = Color(0xFF0369A1)) // Dead Sea
    drawLine(Color(0xFF0284C7), Offset(w * 0.72f, h * 0.28f), Offset(w * 0.74f, h * 0.62f), strokeWidth = 3.dp.toPx()) // Jordan

    // Jerusalem Pin
    drawCircle(Color(0xFFDC2626), radius = 7.dp.toPx(), center = Offset(w * 0.60f, h * 0.64f))
}

private fun DrawScope.drawMountSinai() {
    val w = size.width
    val h = size.height

    // Dawn desert sky
    drawRect(
        brush = Brush.verticalGradient(
            colors = listOf(Color(0xFF991B1B), Color(0xFFD97706), Color(0xFFFEF08A))
        )
    )

    // Rugged Granite Peaks
    val peakPath = Path().apply {
        moveTo(0f, h)
        lineTo(w * 0.25f, h * 0.45f)
        lineTo(w * 0.52f, h * 0.24f) // Mount Sinai summit
        lineTo(w * 0.78f, h * 0.48f)
        lineTo(w, h * 0.38f)
        lineTo(w, h)
        close()
    }
    drawPath(peakPath, color = Color(0xFF451A03))

    // Cloud of Glory at summit
    drawCircle(
        color = Color.White.copy(alpha = 0.5f),
        radius = 28.dp.toPx(),
        center = Offset(w * 0.52f, h * 0.22f)
    )
}

private fun DrawScope.drawAncientJerusalem() {
    val w = size.width
    val h = size.height

    // Golden limestone city walls & battlements
    val wallTop = h * 0.55f
    drawRect(
        color = Color(0xFFD97706),
        topLeft = Offset(w * 0.12f, wallTop),
        size = Size(w * 0.76f, h * 0.35f)
    )

    // Crenellations (battlements)
    val teethCount = 7
    val toothWidth = (w * 0.76f) / (teethCount * 2 - 1)
    for (i in 0 until teethCount) {
        drawRect(
            color = Color(0xFFB45309),
            topLeft = Offset(w * 0.12f + i * 2 * toothWidth, wallTop - 12.dp.toPx()),
            size = Size(toothWidth, 14.dp.toPx())
        )
    }

    // Temple Sanctuary / Royal Portico behind the walls
    val templePath = Path().apply {
        moveTo(w * 0.35f, wallTop)
        lineTo(w * 0.35f, h * 0.28f)
        lineTo(w * 0.65f, h * 0.28f)
        lineTo(w * 0.65f, wallTop)
        close()
    }
    drawPath(templePath, color = Color(0xFFFEF3C7))
    // Gold roof
    drawRect(GoldHighlight, Offset(w * 0.32f, h * 0.26f), Size(w * 0.36f, 8.dp.toPx()))
}

private fun DrawScope.drawSeaOfGalilee() {
    val w = size.width
    val h = size.height

    // Hills of Galilee in twilight
    val hillPath = Path().apply {
        moveTo(0f, h * 0.5f)
        cubicTo(w * 0.3f, h * 0.38f, w * 0.7f, h * 0.42f, w, h * 0.48f)
        lineTo(w, h)
        lineTo(0f, h)
        close()
    }
    drawPath(hillPath, color = Color(0xFF1E3A8A))

    // Water
    drawRect(
        brush = Brush.verticalGradient(
            colors = listOf(Color(0xFF0284C7), Color(0xFF0369A1), Color(0xFF0C4A6E))
        ),
        topLeft = Offset(0f, h * 0.52f),
        size = Size(w, h * 0.48f)
    )

    // Galilean Fishing Boat
    val boatPath = Path().apply {
        moveTo(w * 0.42f, h * 0.68f)
        cubicTo(w * 0.46f, h * 0.74f, w * 0.62f, h * 0.74f, w * 0.66f, h * 0.68f)
        close()
    }
    drawPath(boatPath, color = Color(0xFF92400E))
    // Mast
    drawLine(Color(0xFFB45309), Offset(w * 0.54f, h * 0.68f), Offset(w * 0.54f, h * 0.56f), strokeWidth = 4.dp.toPx())
}

private fun DrawScope.drawBethlehemScene() {
    val w = size.width
    val h = size.height

    // Night Sky with Star of Bethlehem
    drawRect(
        brush = Brush.verticalGradient(
            colors = listOf(Color(0xFF0F172A), Color(0xFF1E1B4B), Color(0xFF312E81))
        )
    )

    // The Radiant Star
    val starCenter = Offset(w * 0.5f, h * 0.26f)
    drawCircle(Color(0xFFFEF08A).copy(alpha = 0.4f), radius = 24.dp.toPx(), center = starCenter)
    drawLine(GoldHighlight, Offset(starCenter.x, starCenter.y - 20.dp.toPx()), Offset(starCenter.x, starCenter.y + 20.dp.toPx()), strokeWidth = 3.dp.toPx())
    drawLine(GoldHighlight, Offset(starCenter.x - 20.dp.toPx(), starCenter.y), Offset(starCenter.x + 20.dp.toPx(), starCenter.y), strokeWidth = 3.dp.toPx())

    // Hill country of Judah
    val hillPath = Path().apply {
        moveTo(0f, h * 0.62f)
        cubicTo(w * 0.4f, h * 0.55f, w * 0.6f, h * 0.65f, w, h * 0.58f)
        lineTo(w, h)
        lineTo(0f, h)
        close()
    }
    drawPath(hillPath, color = Color(0xFF1E293B))
}

private fun DrawScope.drawBurningBush() {
    val w = size.width
    val h = size.height
    val cx = w * 0.5f

    // Bush branches
    drawLine(Color(0xFF92400E), Offset(cx, h * 0.85f), Offset(cx, h * 0.55f), strokeWidth = 8.dp.toPx())
    drawLine(Color(0xFF92400E), Offset(cx, h * 0.68f), Offset(cx - 30.dp.toPx(), h * 0.48f), strokeWidth = 6.dp.toPx())
    drawLine(Color(0xFF92400E), Offset(cx, h * 0.62f), Offset(cx + 30.dp.toPx(), h * 0.46f), strokeWidth = 6.dp.toPx())

    // Divine fire flame (yet not consumed)
    val flamePath = Path().apply {
        moveTo(cx, h * 0.22f)
        cubicTo(cx + 42.dp.toPx(), h * 0.38f, cx + 50.dp.toPx(), h * 0.62f, cx, h * 0.72f)
        cubicTo(cx - 50.dp.toPx(), h * 0.62f, cx - 42.dp.toPx(), h * 0.38f, cx, h * 0.22f)
    }
    drawPath(
        flamePath,
        brush = Brush.radialGradient(
            colors = listOf(Color(0xFFFEF08A), Color(0xFFF97316), Color(0xFFDC2626)),
            center = Offset(cx, h * 0.52f),
            radius = 60.dp.toPx()
        )
    )
}

private fun DrawScope.drawPartingRedSea() {
    val w = size.width
    val h = size.height

    // Left wall of water
    val leftWater = Path().apply {
        moveTo(0f, 0f)
        lineTo(w * 0.32f, 0f)
        cubicTo(w * 0.38f, h * 0.3f, w * 0.36f, h * 0.7f, w * 0.30f, h)
        lineTo(0f, h)
        close()
    }
    drawPath(leftWater, color = Color(0xFF0284C7))

    // Right wall of water
    val rightWater = Path().apply {
        moveTo(w, 0f)
        lineTo(w * 0.68f, 0f)
        cubicTo(w * 0.62f, h * 0.3f, w * 0.64f, h * 0.7f, w * 0.70f, h)
        lineTo(w, h)
        close()
    }
    drawPath(rightWater, color = Color(0xFF0284C7))

    // Dry ground pathway in middle
    val pathGround = Path().apply {
        moveTo(w * 0.32f, 0f)
        lineTo(w * 0.68f, 0f)
        lineTo(w * 0.70f, h)
        lineTo(w * 0.30f, h)
        close()
    }
    drawPath(pathGround, color = Color(0xFFD4B996))
}

private fun DrawScope.drawNoahsArk() {
    val w = size.width
    val h = size.height

    // Floodwaters
    drawRect(
        brush = Brush.verticalGradient(
            colors = listOf(Color(0xFF0369A1), Color(0xFF0F172A))
        ),
        topLeft = Offset(0f, h * 0.52f),
        size = Size(w, h * 0.48f)
    )

    // The Ark (Gopher wood hull)
    val arkPath = Path().apply {
        moveTo(w * 0.20f, h * 0.58f)
        lineTo(w * 0.80f, h * 0.58f)
        lineTo(w * 0.74f, h * 0.72f)
        lineTo(w * 0.26f, h * 0.72f)
        close()
    }
    drawPath(arkPath, color = Color(0xFF78350F))

    // Ark Cabin Roof
    val cabinPath = Path().apply {
        moveTo(w * 0.32f, h * 0.58f)
        lineTo(w * 0.32f, h * 0.45f)
        lineTo(w * 0.68f, h * 0.45f)
        lineTo(w * 0.68f, h * 0.58f)
        close()
    }
    drawPath(cabinPath, color = Color(0xFF92400E))

    // Dove carrying olive branch above
    drawCircle(Color.White, radius = 6.dp.toPx(), center = Offset(w * 0.5f, h * 0.30f))
    drawCircle(Color(0xFF16A34A), radius = 3.dp.toPx(), center = Offset(w * 0.54f, h * 0.31f)) // Olive leaf
}

private fun DrawScope.drawLoavesAndFishes() {
    val w = size.width
    val h = size.height
    val cx = w * 0.5f
    val cy = h * 0.5f

    // Basket
    drawArc(
        color = Color(0xFF92400E),
        startAngle = 0f,
        sweepAngle = 180f,
        useCenter = true,
        topLeft = Offset(cx - 48.dp.toPx(), cy - 10.dp.toPx()),
        size = Size(96.dp.toPx(), 60.dp.toPx())
    )

    // 5 Barley Loaves
    val loafColors = listOf(Color(0xFFFDE68A), Color(0xFFFCD34D), Color(0xFFF59E0B))
    val loafOffsets = listOf(
        Offset(cx - 24.dp.toPx(), cy - 18.dp.toPx()),
        Offset(cx - 8.dp.toPx(), cy - 24.dp.toPx()),
        Offset(cx + 8.dp.toPx(), cy - 24.dp.toPx()),
        Offset(cx + 24.dp.toPx(), cy - 18.dp.toPx()),
        Offset(cx, cy - 12.dp.toPx())
    )
    loafOffsets.forEach { pos ->
        drawOval(loafColors[0], topLeft = Offset(pos.x - 10.dp.toPx(), pos.y - 6.dp.toPx()), size = Size(20.dp.toPx(), 12.dp.toPx()))
    }

    // 2 Fish
    drawOval(Color(0xFF94A3B8), topLeft = Offset(cx - 30.dp.toPx(), cy + 12.dp.toPx()), size = Size(26.dp.toPx(), 10.dp.toPx()))
    drawOval(Color(0xFF94A3B8), topLeft = Offset(cx + 6.dp.toPx(), cy + 14.dp.toPx()), size = Size(26.dp.toPx(), 10.dp.toPx()))
}

private fun DrawScope.drawStoneTablets() {
    val w = size.width
    val h = size.height
    val cx = w * 0.5f

    // Left Tablet (Commands 1-4)
    val leftPath = Path().apply {
        moveTo(cx - 44.dp.toPx(), h * 0.35f)
        cubicTo(cx - 44.dp.toPx(), h * 0.22f, cx - 4.dp.toPx(), h * 0.22f, cx - 4.dp.toPx(), h * 0.35f)
        lineTo(cx - 4.dp.toPx(), h * 0.78f)
        lineTo(cx - 44.dp.toPx(), h * 0.78f)
        close()
    }
    drawPath(leftPath, color = Color(0xFF64748B))

    // Right Tablet (Commands 5-10)
    val rightPath = Path().apply {
        moveTo(cx + 4.dp.toPx(), h * 0.35f)
        cubicTo(cx + 4.dp.toPx(), h * 0.22f, cx + 44.dp.toPx(), h * 0.22f, cx + 44.dp.toPx(), h * 0.35f)
        lineTo(cx + 44.dp.toPx(), h * 0.78f)
        lineTo(cx + 4.dp.toPx(), h * 0.78f)
        close()
    }
    drawPath(rightPath, color = Color(0xFF64748B))

    // Inscribed Law Lines
    for (i in 0..3) {
        val y = h * 0.42f + i * 14.dp.toPx()
        drawLine(Color(0xFFE2E8F0), Offset(cx - 36.dp.toPx(), y), Offset(cx - 12.dp.toPx(), y), strokeWidth = 3.dp.toPx())
        drawLine(Color(0xFFE2E8F0), Offset(cx + 12.dp.toPx(), y), Offset(cx + 36.dp.toPx(), y), strokeWidth = 3.dp.toPx())
    }
}

private fun DrawScope.drawDavidsHarp() {
    val w = size.width
    val h = size.height
    val cx = w * 0.5f

    // Kinnor (Ancient Biblical Lyre / Harp)
    val framePath = Path().apply {
        moveTo(cx - 30.dp.toPx(), h * 0.25f)
        lineTo(cx - 24.dp.toPx(), h * 0.75f)
        cubicTo(cx - 20.dp.toPx(), h * 0.85f, cx + 20.dp.toPx(), h * 0.85f, cx + 24.dp.toPx(), h * 0.75f)
        lineTo(cx + 30.dp.toPx(), h * 0.25f)
    }
    drawPath(framePath, color = Color(0xFFB45309), style = Stroke(width = 8.dp.toPx()))

    // Crossbar
    drawLine(Color(0xFFB45309), Offset(cx - 32.dp.toPx(), h * 0.32f), Offset(cx + 32.dp.toPx(), h * 0.32f), strokeWidth = 7.dp.toPx())

    // 5 Strings
    for (i in -2..2) {
        val stringX = cx + i * 10.dp.toPx()
        drawLine(GoldHighlight, Offset(stringX, h * 0.32f), Offset(stringX, h * 0.75f), strokeWidth = 2.dp.toPx())
    }
}

private fun DrawScope.drawStormOnSea() {
    val w = size.width
    val h = size.height

    // Dramatic rolling waves
    val wavePath = Path().apply {
        moveTo(0f, h * 0.6f)
        cubicTo(w * 0.25f, h * 0.45f, w * 0.4f, h * 0.75f, w * 0.65f, h * 0.55f)
        cubicTo(w * 0.8f, h * 0.4f, w * 0.95f, h * 0.68f, w, h * 0.55f)
        lineTo(w, h)
        lineTo(0f, h)
        close()
    }
    drawPath(wavePath, color = Color(0xFF0C4A6E))

    // Fishing boat on stormy crest
    val boat = Path().apply {
        moveTo(w * 0.35f, h * 0.52f)
        cubicTo(w * 0.40f, h * 0.60f, w * 0.56f, h * 0.60f, w * 0.60f, h * 0.52f)
        close()
    }
    drawPath(boat, color = Color(0xFF78350F))
}

private fun DrawScope.drawGenericBiblicalIcon() {
    val w = size.width
    val h = size.height
    val center = Offset(w * 0.5f, h * 0.5f)

    drawCircle(
        brush = Brush.radialGradient(
            colors = listOf(IndigoPrimary.copy(alpha = 0.5f), Color.Transparent),
            center = center,
            radius = w * 0.4f
        ),
        center = center,
        radius = w * 0.4f
    )
    drawRoundRect(
        color = GoldHighlight,
        topLeft = Offset(center.x - 20.dp.toPx(), center.y - 30.dp.toPx()),
        size = Size(40.dp.toPx(), 60.dp.toPx()),
        cornerRadius = CornerRadius(4.dp.toPx(), 4.dp.toPx()),
        style = Stroke(width = 3.dp.toPx())
    )
}
