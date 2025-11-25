package com.chopadelab.core.config;

import com.chopadelab.core.entity.LabTest;
import com.chopadelab.core.repository.LabTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class LabTestSeeder implements CommandLineRunner {

    private final LabTestRepository labTestRepository;

    @Override
    public void run(String... args) throws Exception {
        if (labTestRepository.count() == 0) {
            List<LabTest> tests = List.of(
                    LabTest.builder().testName("CBC / Hemogram").price(new BigDecimal("250")).category("Hematology")
                            .description("Complete Blood Count").active(true).build(),
                    LabTest.builder().testName("Lipid Profile").price(new BigDecimal("600")).category("Biochemistry")
                            .description("Cholesterol, Triglycerides, HDL, LDL").active(true).build(),
                    LabTest.builder().testName("Liver Function Test (LFT)").price(new BigDecimal("500"))
                            .category("Biochemistry").description("Bilirubin, SGOT, SGPT").active(true).build(),
                    LabTest.builder().testName("Kidney Function Test (KFT)").price(new BigDecimal("500"))
                            .category("Biochemistry").description("Creatinine, Urea, Uric Acid").active(true).build(),
                    LabTest.builder().testName("Thyroid Profile (T3, T4, TSH)").price(new BigDecimal("500"))
                            .category("Hormones").description("Thyroid Function Test").active(true).build(),
                    LabTest.builder().testName("Blood Sugar (Fasting)").price(new BigDecimal("70")).category("Diabetes")
                            .description("Fasting Blood Glucose").active(true).build(),
                    LabTest.builder().testName("Blood Sugar (PP)").price(new BigDecimal("70")).category("Diabetes")
                            .description("Post Prandial Blood Glucose").active(true).build(),
                    LabTest.builder().testName("Urine Routine").price(new BigDecimal("150")).category("Pathology")
                            .description("Urine Analysis").active(true).build(),
                    LabTest.builder().testName("Widal").price(new BigDecimal("200")).category("Serology")
                            .description("Typhoid Test").active(true).build());

            labTestRepository.saveAll(tests);
            System.out.println("Lab Tests seeded successfully.");
        }
    }
}
