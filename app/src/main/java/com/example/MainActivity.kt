package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.example.ui.LeaderboardScreen
import com.example.ui.LobbyScreen
import com.example.ui.QuestionExplorerScreen
import com.example.ui.QuizGameScreen
import com.example.ui.QuizViewModel
import com.example.ui.ResultsScreen
import com.example.ui.ScreenState
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {

    private val viewModel: QuizViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                val uiState by viewModel.uiState.collectAsState()
                val leaderboard by viewModel.leaderboard.collectAsState()

                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    when (uiState.currentScreen) {
                        ScreenState.LOBBY,
                        ScreenState.CREATE_CHALLENGE,
                        ScreenState.JOIN_CHALLENGE -> {
                            LobbyScreen(
                                state = uiState,
                                onStartChallenge = { config -> viewModel.startChallenge(config) },
                                onPopulate10kBank = { viewModel.populateFull10k() },
                                onNavigateLeaderboard = { viewModel.navigateTo(ScreenState.LEADERBOARD) },
                                onNavigateExplorer = { viewModel.navigateTo(ScreenState.QUESTION_EXPLORER) },
                                modifier = Modifier.padding(innerPadding)
                            )
                        }
                        ScreenState.IN_GAME -> {
                            BackHandler {
                                viewModel.finishChallenge()
                            }
                            QuizGameScreen(
                                state = uiState,
                                onAnswerSelected = { answer -> viewModel.submitAnswer(answer) },
                                onQuitGame = { viewModel.finishChallenge() },
                                onClearDifficultyTransition = { viewModel.clearDifficultyTransition() },
                                modifier = Modifier.padding(innerPadding)
                            )
                        }
                        ScreenState.RESULTS -> {
                            BackHandler {
                                viewModel.navigateTo(ScreenState.LOBBY)
                            }
                            ResultsScreen(
                                result = uiState.latestResult,
                                matchLeaderboard = uiState.matchLeaderboard,
                                answerHistory = uiState.answerHistory,
                                onPlayAgainSameSeed = { viewModel.restartChallengeSameSeed() },
                                onNewChallenge = { viewModel.restartChallengeNewSeed() },
                                onBackToLobby = { viewModel.navigateTo(ScreenState.LOBBY) },
                                modifier = Modifier.padding(innerPadding)
                            )
                        }
                        ScreenState.LEADERBOARD -> {
                            BackHandler {
                                viewModel.navigateTo(ScreenState.LOBBY)
                            }
                            LeaderboardScreen(
                                leaderboard = leaderboard,
                                onBack = { viewModel.navigateTo(ScreenState.LOBBY) },
                                modifier = Modifier.padding(innerPadding)
                            )
                        }
                        ScreenState.QUESTION_EXPLORER -> {
                            BackHandler {
                                viewModel.navigateTo(ScreenState.LOBBY)
                            }
                            QuestionExplorerScreen(
                                masterCount = uiState.masterQuestionCount,
                                searchQuery = uiState.searchQuery,
                                searchResults = uiState.searchResults,
                                onSearch = { q -> viewModel.searchMasterBank(q) },
                                onBack = { viewModel.navigateTo(ScreenState.LOBBY) },
                                modifier = Modifier.padding(innerPadding)
                            )
                        }
                    }
                }
            }
        }
    }
}

