package com.chopadelab.core.controller;

import com.chopadelab.core.dto.BookAppointmentRequest;
import com.chopadelab.core.dto.UpdateAppointmentStatusRequest;
import com.chopadelab.core.entity.Appointment;
import com.chopadelab.core.entity.User;
import com.chopadelab.core.repository.UserRepository;
import com.chopadelab.core.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    // User: Book Appointment
    @PostMapping("/appointments/book")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody BookAppointmentRequest request,
            Authentication authentication) {
        User patient = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(appointmentService.bookAppointment(request, patient));
    }

    // User: Get My History
    @GetMapping("/appointments/my-history")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Appointment>> getMyHistory(Authentication authentication) {
        User patient = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(appointmentService.getUserHistory(patient));
    }

    // Admin: Get ALL Appointments
    @GetMapping("/admin/appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    // Admin: Update Status
    @PutMapping("/admin/appointments/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id,
            @RequestBody UpdateAppointmentStatusRequest request) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, request.getStatus(), request.getReportUrl()));
    }
}
