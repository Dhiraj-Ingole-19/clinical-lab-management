package com.chopadelab.core.dto;

import lombok.Data;

@Data
public class UpdateAppointmentStatusRequest {
    private String status;
    private String reportUrl;
}
