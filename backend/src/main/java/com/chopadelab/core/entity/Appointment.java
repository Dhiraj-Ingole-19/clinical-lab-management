package com.chopadelab.core.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User patient;

    @ManyToMany
    @JoinTable(name = "appointment_tests", joinColumns = @JoinColumn(name = "appointment_id"), inverseJoinColumns = @JoinColumn(name = "test_id"))
    private Set<LabTest> tests = new HashSet<>();

    private LocalDateTime appointmentTime;

    // Patient Details
    private String patientName;
    private Integer patientAge;
    private String patientGender;
    private String patientMobile;

    // Logistics
    private boolean isHomeVisit;
    private String collectionAddress;
    private BigDecimal totalAmount;

    // Status: PENDING, CONFIRMED, COMPLETED, CANCELLED
    private String status;

    // Report
    private String reportUrl;
}
