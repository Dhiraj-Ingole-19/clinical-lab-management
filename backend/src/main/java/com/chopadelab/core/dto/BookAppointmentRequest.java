package com.chopadelab.core.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookAppointmentRequest {
    private List<Long> testIds;
    private LocalDateTime appointmentTime;

    private String patientName;
    private Integer patientAge;
    private String patientGender;
    private String patientMobile;

    private boolean isHomeVisit;
    private String collectionAddress;
}
