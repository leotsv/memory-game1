package com.memorygame.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String playerName;
    private int turns;
    private int timeInSeconds;
    private LocalDateTime playedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }
    
    public int getTurns() { return turns; }
    public void setTurns(int turns) { this.turns = turns; }
    
    public int getTimeInSeconds() { return timeInSeconds; }
    public void setTimeInSeconds(int timeInSeconds) { this.timeInSeconds = timeInSeconds; }
    
    public LocalDateTime getPlayedAt() { return playedAt; }
    public void setPlayedAt(LocalDateTime playedAt) { this.playedAt = playedAt; }
} 