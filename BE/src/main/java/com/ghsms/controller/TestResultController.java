package com.ghsms.controller;

import com.ghsms.DTO.TestResultDTO;
import com.ghsms.config.UserPrincipal;
import com.ghsms.service.TestResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test-results")
@RequiredArgsConstructor
public class TestResultController {
    private final TestResultService testResultService;

    @GetMapping("/{testResultId}/details")
    public ResponseEntity<TestResultDTO> getTestResultDetails(@PathVariable Long testResultId,
                                                              @AuthenticationPrincipal UserPrincipal user) {
        Long userId = user.getId();
        TestResultDTO dto = testResultService.getTestResultDetailsById(testResultId);

        return ResponseEntity.ok(dto);
    }

}
