package com.chopadelab.core.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "lab_tests")
public class LabTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String testName;

    @Column(nullable = false)
    private BigDecimal price;

    private String category;
    private String description;

    @Builder.Default
    private boolean active = true;
}
