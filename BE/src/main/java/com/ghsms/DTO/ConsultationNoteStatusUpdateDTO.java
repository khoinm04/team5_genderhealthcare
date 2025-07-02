package com.ghsms.DTO;

import com.ghsms.file_enum.ConsultationStatus;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConsultationNoteStatusUpdateDTO {

    @Size(max = 1000, message = "Ghi chú không được vượt quá 1000 ký tự")
    private String note;

    private ConsultationStatus status;
}
