const userGroupDetails = {
  "nam-gioi": {
    title: "Nam giới",
    icon: "👨",
    overview: "Chăm sóc sức khỏe toàn diện dành riêng cho nam giới, từ tuổi dậy thì đến tuổi già.",
    ageGroups: [
      {
        range: "13-18 tuổi (Tuổi dậy thì)",
        issues: ["Phát triển sinh dục", "Thay đổi hormone", "Giáo dục giới tính"],
        services: ["Tư vấn tâm lý", "Khám phát triển", "Giáo dục sức khỏe"],
        notes: "Giai đoạn quan trọng cần sự hướng dẫn đúng đắn."
      },
      {
        range: "19-40 tuổi (Tuổi trưởng thành)",
        issues: ["Sức khỏe sinh sản", "Stress công việc", "Lối sống không lành mạnh"],
        services: ["Khám định kỳ", "Tư vấn dinh dưỡng", "Quản lý stress"],
        notes: "Thời kỳ năng động nhất, cần chú ý cân bằng cuộc sống."
      },
      {
        range: "40+ tuổi (Trung niên và cao tuổi)",
        issues: ["Suy giảm testosterone", "Vấn đề tuyến tiền liệt", "Bệnh mãn tính"],
        services: ["Khám chuyên khoa", "Xét nghiệm hormone", "Theo dõi sức khỏe"],
        notes: "Cần theo dõi sức khỏe thường xuyên và điều trị kịp thời."
      }
    ],
    tips: [
      "Tập thể dục đều đặn để duy trì sức khỏe",
      "Khám sức khỏe định kỳ 6 tháng/lần",
      "Duy trì chế độ ăn uống cân bằng",
      "Hạn chế rượu bia và thuốc lá",
      "Quản lý stress hiệu quả"
    ]
  },
  "nu-gioi": {
    title: "Nữ giới",
    icon: "👩",
    overview: "Chăm sóc sức khỏe phụ nữ qua các giai đoạn từ tuổi dậy thì đến mãn kinh.",
    ageGroups: [
      {
        range: "12-18 tuổi (Tuổi dậy thì)",
        issues: ["Kinh nguyệt không đều", "Thay đổi cơ thể", "Vấn đề tâm lý"],
        services: ["Tư vấn phụ khoa", "Giáo dục sức khỏe", "Hỗ trợ tâm lý"],
        notes: "Cần sự quan tâm đặc biệt từ gia đình và bác sĩ."
      },
      {
        range: "18-45 tuổi (Tuổi sinh sản)",
        issues: ["Kế hoạch hóa gia đình", "Thai kỳ", "Các bệnh phụ khoa"],
        services: ["Khám phụ khoa", "Tư vấn thai sản", "Xét nghiệm định kỳ"],
        notes: "Giai đoạn quan trọng nhất trong đời phụ nữ."
      },
      {
        range: "45+ tuổi (Tiền mãn kinh và mãn kinh)",
        issues: ["Rối loạn hormone", "Loãng xương", "Thay đổi tâm lý"],
        services: ["Điều trị hormone", "Khám mật độ xương", "Tư vấn dinh dưỡng"],
        notes: "Cần chăm sóc đặc biệt để duy trì chất lượng cuộc sống."
      }
    ],
    tips: [
      "Khám phụ khoa định kỳ 6 tháng/lần",
      "Tự khám vú hàng tháng",
      "Duy trì cân nặng hợp lý",
      "Bổ sung canxi và vitamin D",
      "Quản lý stress và nghỉ ngơi đầy đủ"
    ]
  },
  "me-bau": {
    title: "Mẹ bầu",
    icon: "🤰",
    overview: "Chăm sóc toàn diện cho mẹ và bé trong suốt thai kỳ.",
    ageGroups: [
      {
        range: "3 tháng đầu (Tam cá nguyệt 1)",
        issues: ["Nghẹt thở buổi sáng", "Mệt mỏi", "Thay đổi hormone"],
        services: ["Khám thai định kỳ", "Xét nghiệm máu", "Tư vấn dinh dưỡng"],
        notes: "Giai đoạn quan trọng nhất, cần chú ý đặc biệt."
      },
      {
        range: "3 tháng giữa (Tam cá nguyệt 2)",
        issues: ["Tăng cân", "Đau lưng", "Biến đổi cơ thể"],
        services: ["Siêu âm thai", "Theo dõi cân nặng", "Tập yoga bầu"],
        notes: "Giai đoạn thoải mái nhất của thai kỳ."
      },
      {
        range: "3 tháng cuối (Tam cá nguyệt 3)",
        issues: ["Khó ngủ", "Phù chân tay", "Chuẩn bị sinh"],
        services: ["Theo dõi sát", "Chuẩn bị sinh", "Tư vấn sau sinh"],
        notes: "Cần chuẩn bị kỹ lưỡng cho việc sinh nở."
      }
    ],
    tips: [
      "Khám thai đều đặn theo lịch hẹn",
      "Bổ sung acid folic và vitamin",
      "Tập thể dục nhẹ nhàng",
      "Ăn uống đầy đủ chất dinh dưỡng",
      "Nghỉ ngơi đầy đủ và tránh stress"
    ]
  },
  "tre-em": {
    title: "Trẻ em",
    icon: "🧒",
    overview: "Chăm sóc sức khỏe và phát triển toàn diện cho trẻ em từ sơ sinh đến vị thành niên.",
    ageGroups: [
      {
        range: "0-2 tuổi (Sơ sinh và bú mẹ)",
        issues: ["Phát triển thể chất", "Tiêm chủng", "Dinh dưỡng"],
        services: ["Khám định kỳ", "Tiêm chủng", "Tư vấn nuôi con"],
        notes: "Giai đoạn phát triển nhanh nhất."
      },
      {
        range: "2-12 tuổi (Mầm non và tiểu học)",
        issues: ["Phát triển trí tuệ", "Hoạt động xã hội", "Sức khỏe răng miệng"],
        services: ["Khám tổng quát", "Nha khoa", "Tư vấn dinh dưỡng"],
        notes: "Thời kỳ học hỏi và khám phá."
      },
      {
        range: "12-18 tuổi (Vị thành niên)",
        issues: ["Dậy thì", "Thay đổi tâm lý", "Áp lực học tập"],
        services: ["Tư vấn tâm lý", "Giáo dục giới tính", "Khám phát triển"],
        notes: "Cần sự hỗ trợ và hiểu biết từ gia đình."
      }
    ],
    tips: [
      "Tiêm chủng đầy đủ theo lịch",
      "Khám sức khỏe định kỳ",
      "Chế độ ăn uống cân bằng",
      "Hoạt động thể chất phù hợp",
      "Theo dõi phát triển tâm lý"
    ]
  },
  "nguoi-gia": {
    title: "Người già",
    icon: "🧓",
    overview: "Chăm sóc sức khỏe toàn diện cho người cao tuổi, nâng cao chất lượng cuộc sống.",
    ageGroups: [
      {
        range: "60-70 tuổi (Tuổi về hưu)",
        issues: ["Thay đổi lối sống", "Sức khỏe tổng quát", "Hoạt động xã hội"],
        services: ["Khám tổng quát", "Tư vấn dinh dưỡng", "Hoạt động nhóm"],
        notes: "Thời kỳ chuyển tiếp quan trọng."
      },
      {
        range: "70-80 tuổi (Cao tuổi)",
        issues: ["Bệnh mãn tính", "Suy giảm chức năng", "Cô đơn"],
        services: ["Theo dõi bệnh lý", "Phục hồi chức năng", "Hỗ trợ tâm lý"],
        notes: "Cần chăm sóc đặc biệt và theo dõi sát."
      },
      {
        range: "80+ tuổi (Tuổi rất cao)",
        issues: ["Phụ thuộc", "Đa bệnh lý", "Chăm sóc cuối đời"],
        services: ["Chăm sóc tại nhà", "Điều trị giảm nhẹ", "Hỗ trợ gia đình"],
        notes: "Tập trung vào chất lượng cuộc sống."
      }
    ],
    tips: [
      "Khám sức khỏe định kỳ 3 tháng/lần",
      "Duy trì hoạt động thể chất phù hợp",
      "Chế độ ăn uống lành mạnh",
      "Tham gia hoạt động xã hội",
      "Theo dõi và điều trị bệnh mãn tính"
    ]
  }
};

export default userGroupDetails;