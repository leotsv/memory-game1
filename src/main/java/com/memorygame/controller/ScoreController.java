package com.memorygame.controller;

import com.memorygame.model.Score;
import com.memorygame.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "*")
public class ScoreController {
    
    @Autowired
    private ScoreRepository scoreRepository;

    @PostMapping
    public ResponseEntity<Score> saveScore(@RequestBody Score score) {
        score.setPlayedAt(LocalDateTime.now());
        Score savedScore = scoreRepository.save(score);
        return ResponseEntity.ok(savedScore);
    }

    @GetMapping("/top")
    public ResponseEntity<List<Score>> getTopScores() {
        List<Score> topScores = scoreRepository.findTop10ByOrderByTurnsAscTimeInSecondsAsc();
        return ResponseEntity.ok(topScores);
    }
} 