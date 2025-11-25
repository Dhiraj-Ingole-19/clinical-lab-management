package com.chopadelab.core.service;

import com.chopadelab.core.dto.BookAppointmentRequest;
import com.chopadelab.core.entity.Appointment;
import com.chopadelab.core.entity.LabTest;
import com.chopadelab.core.entity.User;
import com.chopadelab.core.repository.AppointmentRepository;
import com.chopadelab.core.repository.LabTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final LabTestRepository labTestRepository;

    @Transactional
    public Appointment bookAppointment(BookAppointmentRequest request, User patient) {
        Set<LabTest> tests = new HashSet<>(labTestRepository.findAllById(request.getTestIds()));

        if (tests.isEmpty()) {
            throw new RuntimeException("No valid tests selected");
        }

        BigDecimal testsTotal = tests.stream()
                .map(LabTest::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal homeVisitCharge = request.isHomeVisit() ? new BigDecimal("100.00") : BigDecimal.ZERO;
        BigDecimal totalAmount = testsTotal.add(homeVisitCharge);

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .tests(tests)
                .appointmentTime(request.getAppointmentTime())
                .patientName(request.getPatientName())
                .patientAge(request.getPatientAge())
                .patientGender(request.getPatientGender())
                .patientMobile(request.getPatientMobile())
                .isHomeVisit(request.isHomeVisit())
                .collectionAddress(request.getCollectionAddress())
                .totalAmount(totalAmount)
                .status("PENDING")
                .build();

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getUserHistory(User patient) {
        return appointmentRepository.findByPatient(patient);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment updateStatus(Long id, String status, String reportUrl) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    if (status != null)
                        appointment.setStatus(status);
                    if (reportUrl != null)
                        appointment.setReportUrl(reportUrl);
                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found with id " + id));
    }
}
