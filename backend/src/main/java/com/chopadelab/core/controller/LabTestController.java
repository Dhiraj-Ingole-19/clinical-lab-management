package com.chopadelab.core.controller;

import com.chopadelab.core.entity.LabTest;
import com.chopadelab.core.service.LabTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LabTestController {

    private final LabTestService labTestService;

    // Public/User: List all active tests
    @GetMapping("/tests")
    public ResponseEntity<List<LabTest>> getAllActiveTests() {
        return ResponseEntity.ok(labTestService.getAllActiveTests());
    }

    // Admin: List ALL tests (including inactive)
    @GetMapping("/admin/tests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LabTest>> getAllTests() {
        return ResponseEntity.ok(labTestService.getAllTests());
    }

    // Admin: Create new test
    @PostMapping("/admin/tests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LabTest> createTest(@RequestBody LabTest labTest) {
        return ResponseEntity.ok(labTestService.createTest(labTest));
    }

    // Admin: Update test
    @PutMapping("/admin/tests/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LabTest> updateTest(@PathVariable Long id, @RequestBody LabTest labTest) {
        return ResponseEntity.ok(labTestService.updateTest(id, labTest));
    }

    // Admin: Delete test
    @DeleteMapping("/admin/tests/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTest(@PathVariable Long id) {
        labTestService.deleteTest(id);
        return ResponseEntity.noContent().build();
    }
}
