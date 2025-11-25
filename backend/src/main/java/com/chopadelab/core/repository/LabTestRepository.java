package com.chopadelab.core.repository;

import com.chopadelab.core.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {
    List<LabTest> findByActiveTrue();

    Optional<LabTest> findByTestName(String testName);
}
