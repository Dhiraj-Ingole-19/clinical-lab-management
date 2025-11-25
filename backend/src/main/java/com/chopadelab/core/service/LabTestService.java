package com.chopadelab.core.service;

import com.chopadelab.core.entity.LabTest;
import com.chopadelab.core.repository.LabTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LabTestService {

    private final LabTestRepository labTestRepository;

    public List<LabTest> getAllActiveTests() {
        return labTestRepository.findByActiveTrue();
    }

    public List<LabTest> getAllTests() {
        return labTestRepository.findAll();
    }

    public LabTest createTest(LabTest labTest) {
        return labTestRepository.save(labTest);
    }

    public LabTest updateTest(Long id, LabTest updatedTest) {
        return labTestRepository.findById(id)
                .map(test -> {
                    test.setTestName(updatedTest.getTestName());
                    test.setPrice(updatedTest.getPrice());
                    test.setCategory(updatedTest.getCategory());
                    test.setDescription(updatedTest.getDescription());
                    test.setActive(updatedTest.isActive());
                    return labTestRepository.save(test);
                })
                .orElseThrow(() -> new RuntimeException("Test not found with id " + id));
    }

    public void deleteTest(Long id) {
        labTestRepository.deleteById(id);
    }
}
