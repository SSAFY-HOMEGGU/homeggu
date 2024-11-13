package com.homeggu.domain.saledBoardLike.entity;

import com.homeggu.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SalesBoardLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int salesBoardLikeId;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId", nullable = false)
    private User user;

    @Column(nullable = false)
    private int salesBoardId;
}
