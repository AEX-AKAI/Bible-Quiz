package com.example.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Vibration
import androidx.compose.material.icons.filled.VolumeOff
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.core.audio.AudioEngine
import com.example.core.audio.AudioSettingsManager
import com.example.core.audio.HapticEngine

@Composable
fun SoundSettingsDialog(
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val settingsManager = AudioSettingsManager.getInstance(context)
    val settings by settingsManager.settings.collectAsState()
    val audioEngine = AudioEngine.getInstance(context)
    val hapticEngine = HapticEngine.getInstance(context)

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = modifier
                .fillMaxWidth()
                .testTag("sound_settings_dialog"),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(22.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                // Header
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f),
                        modifier = Modifier.size(42.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Tune,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Audio & Haptic Settings",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "Spiritual ambience & tactile feedback",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // MASTER AUDIO: ON / OFF
                SettingToggleRow(
                    icon = if (settings.masterAudioEnabled) Icons.Default.VolumeUp else Icons.Default.VolumeOff,
                    title = "MASTER AUDIO",
                    subtitle = if (settings.masterAudioEnabled) "All sound systems active" else "All sound systems muted",
                    checked = settings.masterAudioEnabled,
                    enabled = true,
                    onCheckedChange = { isEnabled ->
                        settingsManager.updateMasterAudio(isEnabled)
                        if (isEnabled) audioEngine.playNormalClick()
                    },
                    testTag = "toggle_master_audio"
                )

                if (settings.masterAudioEnabled) {
                    Spacer(modifier = Modifier.height(4.dp))
                    VolumeSliderRow(
                        label = "Master Volume",
                        value = settings.masterVolume,
                        enabled = true,
                        onValueChange = { settingsManager.updateMasterVolume(it) }
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                // AMBIENT SOUND: ON / OFF
                SettingToggleRow(
                    icon = Icons.Default.MusicNote,
                    title = "AMBIENT SOUND",
                    subtitle = "Peaceful, meditative atmospheric soundscape",
                    checked = settings.ambientSoundEnabled && settings.masterAudioEnabled,
                    enabled = settings.masterAudioEnabled,
                    onCheckedChange = { settingsManager.updateAmbientSound(it) },
                    testTag = "toggle_ambient_sound"
                )

                if (settings.ambientSoundEnabled && settings.masterAudioEnabled) {
                    Spacer(modifier = Modifier.height(4.dp))
                    VolumeSliderRow(
                        label = "Ambient Volume",
                        value = settings.ambientVolume,
                        enabled = true,
                        onValueChange = { settingsManager.updateAmbientVolume(it) }
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                // SOUND EFFECTS: ON / OFF
                SettingToggleRow(
                    icon = Icons.Default.GraphicEq,
                    title = "SOUND EFFECTS",
                    subtitle = "Answer taps, milestones, hints & timer alerts",
                    checked = settings.soundEffectsEnabled && settings.masterAudioEnabled,
                    enabled = settings.masterAudioEnabled,
                    onCheckedChange = { settingsManager.updateSoundEffects(it) },
                    testTag = "toggle_sound_effects"
                )

                if (settings.soundEffectsEnabled && settings.masterAudioEnabled) {
                    Spacer(modifier = Modifier.height(4.dp))
                    VolumeSliderRow(
                        label = "Sound Effects Volume",
                        value = settings.soundEffectsVolume,
                        enabled = true,
                        onValueChange = { settingsManager.updateSoundEffectsVolume(it) }
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    // Audio test buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = { audioEngine.playCorrectAnswer() },
                            modifier = Modifier
                                .weight(1f)
                                .height(38.dp)
                                .testTag("test_correct_button"),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.PlayArrow,
                                contentDescription = null,
                                modifier = Modifier.size(15.dp)
                            )
                            Spacer(modifier = Modifier.width(3.dp))
                            Text("Chime", fontSize = 11.sp)
                        }

                        OutlinedButton(
                            onClick = { audioEngine.playHintDiscovery() },
                            modifier = Modifier
                                .weight(1f)
                                .height(38.dp)
                                .testTag("test_hint_button"),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Lightbulb,
                                contentDescription = null,
                                modifier = Modifier.size(15.dp)
                            )
                            Spacer(modifier = Modifier.width(3.dp))
                            Text("Hint", fontSize = 11.sp)
                        }

                        OutlinedButton(
                            onClick = { audioEngine.playCombo(5) },
                            modifier = Modifier
                                .weight(1f)
                                .height(38.dp)
                                .testTag("test_milestone_button"),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.VolumeUp,
                                contentDescription = null,
                                modifier = Modifier.size(15.dp)
                            )
                            Spacer(modifier = Modifier.width(3.dp))
                            Text("Combo ×5", fontSize = 11.sp)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // HAPTIC FEEDBACK: ON / OFF
                SettingToggleRow(
                    icon = Icons.Default.Vibration,
                    title = "HAPTIC FEEDBACK",
                    subtitle = "Tactile response on button taps & answer evaluations",
                    checked = settings.hapticFeedbackEnabled,
                    enabled = true,
                    onCheckedChange = { isEnabled ->
                        settingsManager.updateHapticFeedback(isEnabled)
                        if (isEnabled) hapticEngine.vibrateCorrect()
                    },
                    testTag = "toggle_haptic_feedback"
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Done Button
                FilledTonalButton(
                    onClick = {
                        audioEngine.playNavClose()
                        onDismiss()
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("close_settings_button"),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text(
                        text = "Save & Return",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                }
            }
        }
    }
}

@Composable
private fun SettingToggleRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    checked: Boolean,
    enabled: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    testTag: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            modifier = Modifier.weight(1f),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (checked && enabled) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f),
                modifier = Modifier.size(22.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = title,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (enabled) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                )
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = if (enabled) 1f else 0.5f)
                )
            }
        }

        Switch(
            checked = checked,
            enabled = enabled,
            onCheckedChange = onCheckedChange,
            modifier = Modifier.testTag(testTag),
            colors = SwitchDefaults.colors(
                checkedThumbColor = MaterialTheme.colorScheme.primary,
                checkedTrackColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)
            )
        )
    }
}

@Composable
private fun VolumeSliderRow(
    label: String,
    value: Float,
    enabled: Boolean,
    onValueChange: (Float) -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = label,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = if (enabled) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f)
            )
            Text(
                text = if (enabled) "${(value * 100).toInt()}%" else "MUTED",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = if (enabled) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f)
            )
        }
        Slider(
            value = value,
            enabled = enabled,
            onValueChange = onValueChange,
            modifier = Modifier.height(28.dp),
            colors = SliderDefaults.colors(
                thumbColor = MaterialTheme.colorScheme.primary,
                activeTrackColor = MaterialTheme.colorScheme.primary,
                inactiveTrackColor = MaterialTheme.colorScheme.surfaceVariant
            )
        )
    }
}
