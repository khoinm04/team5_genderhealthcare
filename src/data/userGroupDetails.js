const userGroupDetails = {
  "nam-gioi": {
    title: "Nam giới",
    icon: "👨",
    overview:
      "Nam giới ở mỗi độ tuổi đều đối mặt với những vấn đề sức khỏe giới tính khác nhau. Chủ động phòng ngừa, kiểm tra định kỳ giúp bảo vệ sức khỏe, nâng cao chất lượng sống.",
    ageGroups: [
      {
        range: "20-35 tuổi",
        issues: [
          "Suy giảm ham muốn tình dục do áp lực cuộc sống",
          "Dễ mắc các bệnh lây truyền qua đường tình dục (STI) do hoạt động tình dục chưa an toàn",
          "Rối loạn cương dương tạm thời, stress sinh lý"
        ],
        services: [
          "Tư vấn sức khỏe sinh sản và phòng tránh STI",
          "Xét nghiệm tổng quát, kiểm tra hormone",
          "Tư vấn tâm lý, giảm stress"
        ],
        notes:
          "Khuyến khích duy trì thói quen sống lành mạnh, chủ động khám sức khỏe định kỳ, sử dụng bao cao su đúng cách để phòng bệnh.",
      },
      {
        range: "36-50 tuổi",
        issues: [
          "Suy giảm nội tiết tố nam (testosterone), mệt mỏi, mất ngủ",
          "Mãn dục sớm, giảm chất lượng tinh trùng, khó có con",
          "Tăng nguy cơ mắc bệnh tim mạch do thay đổi hormone"
        ],
        services: [
          "Khám sức khỏe sinh sản nam định kỳ",
          "Tầm soát ung thư tuyến tiền liệt, xét nghiệm testosterone",
          "Tư vấn chế độ dinh dưỡng và luyện tập phù hợp"
        ],
        notes:
          "Duy trì luyện tập thể thao, kiểm tra chỉ số nội tiết tố, tầm soát ung thư tiền liệt tuyến 1-2 lần/năm.",
      },
      {
        range: "Trên 50 tuổi",
        issues: [
          "Suy giảm ham muốn, rối loạn cương dương kéo dài",
          "Tăng nguy cơ ung thư tuyến tiền liệt và các bệnh mãn tính",
          "Sức khỏe tâm lý dễ bị ảnh hưởng (lo âu, cô đơn, tự ti)"
        ],
        services: [
          "Kiểm tra tổng quát sức khỏe nam giới tuổi già",
          "Tư vấn và hỗ trợ điều trị rối loạn chức năng sinh lý",
          "Hỗ trợ tâm lý, tham gia các câu lạc bộ sức khỏe"
        ],
        notes:
          "Khám sức khỏe định kỳ 6 tháng/lần, chú ý dấu hiệu bất thường về tiểu tiện, không chủ quan với sức khỏe giới tính.",
      },
    ],
    tips: [
      "Chủ động trao đổi với bác sĩ khi có dấu hiệu bất thường.",
      "Không lạm dụng rượu bia, chất kích thích.",
      "Luôn duy trì vận động thể thao phù hợp tuổi."
    ]
  },

  "nu-gioi": {
    title: "Nữ giới",
    icon: "👩",
    overview:
    "Nữ giới cần chú trọng chăm sóc sức khỏe giới tính xuyên suốt các giai đoạn: dậy thì, trưởng thành, tiền mãn kinh và mãn kinh để bảo vệ sức khỏe sinh sản, tâm lý và sắc đẹp.",
    ageGroups: [
      {
        range: "Dậy thì (10-18 tuổi)",
        issues: [
          "Rối loạn kinh nguyệt, đau bụng kinh, chưa hiểu biết về chăm sóc bản thân",
          "Dễ bị tác động bởi thông tin sai lệch, ngại chia sẻ vấn đề nhạy cảm",
        ],
        services: [
          "Tư vấn giáo dục giới tính, hướng dẫn vệ sinh cá nhân",
          "Khám phụ khoa tuổi dậy thì, tầm soát bất thường sinh dục",
        ],
        notes:
          "Phụ huynh cần đồng hành, giải thích về thay đổi cơ thể, định hướng sức khỏe sinh sản an toàn.",
      },
      {
        range: "Trưởng thành (19-45 tuổi)",
        issues: [
          "Nguy cơ viêm nhiễm phụ khoa, bệnh lây truyền qua đường tình dục",
          "Khó khăn về thụ thai, rối loạn nội tiết, stress",
          "Ung thư cổ tử cung, ung thư vú",
        ],
        services: [
          "Khám phụ khoa định kỳ 6 tháng/lần",
          "Tầm soát ung thư cổ tử cung (PAP test), tiêm ngừa HPV",
          "Tư vấn kế hoạch hóa gia đình, tiền hôn nhân, sức khỏe tiền thai"
        ],
        notes:
          "Luôn chú ý vệ sinh cá nhân, khám sức khỏe định kỳ, không tự ý dùng thuốc nội tiết hoặc kháng sinh.",
      },
      {
        range: "Tiền mãn kinh & mãn kinh (45+)",
        issues: [
          "Bốc hỏa, rối loạn giấc ngủ, trầm cảm, loãng xương",
          "Tăng nguy cơ bệnh lý tim mạch, ung thư vú/cổ tử cung",
        ],
        services: [
          "Tư vấn cân bằng nội tiết tố, bổ sung canxi, vitamin D",
          "Khám tổng quát, tầm soát các bệnh lý ung thư, tim mạch",
        ],
        notes:
          "Chủ động kiểm tra sức khỏe 1 năm/lần, tập luyện nhẹ nhàng và duy trì lối sống tích cực.",
      },
    ],
    tips: [
      "Duy trì chế độ ăn giàu rau xanh, bổ sung vitamin, khoáng chất.",
      "Tập thể dục đều đặn, giữ tâm lý lạc quan.",
      "Thường xuyên trao đổi, chia sẻ với chuyên gia khi gặp khó khăn."
    ]
  },

  "me-bau": {
    title: "Mẹ bầu",
    icon: "🤰",
    overview:
      "Mẹ bầu cần được chăm sóc sức khỏe giới tính và sinh sản xuyên suốt 3 giai đoạn thai kỳ để đảm bảo an toàn, khỏe mạnh cho cả mẹ và bé.",
    ageGroups: [
      {
        range: "3 tháng đầu thai kỳ",
        issues: [
          "Ốm nghén, buồn nôn, mệt mỏi",
          "Thiếu máu, nguy cơ sảy thai, dị tật thai nhi",
        ],
        services: [
          "Khám thai sớm, siêu âm xác định tuổi thai",
          "Xét nghiệm máu, nước tiểu, tầm soát bệnh truyền nhiễm",
          "Tư vấn dinh dưỡng, bổ sung axit folic, sắt"
        ],
        notes:
          "Hạn chế tự ý dùng thuốc, nghỉ ngơi hợp lý, tránh căng thẳng.",
      },
      {
        range: "3 tháng giữa thai kỳ",
        issues: [
          "Tiểu đường thai kỳ, tăng cân nhanh",
          "Thiếu canxi, chuột rút, phù nề",
        ],
        services: [
          "Khám thai định kỳ hàng tháng, kiểm tra đường huyết",
          "Siêu âm phát triển thai, tư vấn bổ sung dinh dưỡng, canxi"
        ],
        notes:
          "Theo dõi cân nặng, bổ sung đa dạng thực phẩm, vận động nhẹ nhàng (yoga bầu, đi bộ)",
      },
      {
        range: "3 tháng cuối thai kỳ",
        issues: [
          "Tiền sản giật, cao huyết áp",
          "Căng thẳng tâm lý khi chuẩn bị sinh, nguy cơ sinh non",
        ],
        services: [
          "Khám thai sát ngày sinh, đo tim thai, kiểm tra nước ối",
          "Tư vấn chuyển dạ an toàn, chuẩn bị kế hoạch sinh nở"
        ],
        notes:
          "Chuẩn bị vật dụng sinh, tâm lý vững vàng, luôn theo dõi cử động thai, có số liên hệ bác sĩ/cơ sở y tế sẵn sàng.",
      },
    ],
    tips: [
      "Khám thai, siêu âm đầy đủ theo lịch hẹn.",
      "Ăn đa dạng thực phẩm, chia nhỏ bữa, không kiêng khem quá mức.",
      "Chủ động chia sẻ với bác sĩ mọi triệu chứng bất thường."
    ]
  },

  "tre-em": {
    title: "Trẻ em",
    icon: "🧒",
    overview:
      "Trẻ em phát triển lành mạnh về thể chất, tâm sinh lý và sức khỏe giới tính cần được quan tâm, hướng dẫn, bảo vệ từ sớm.",
    ageGroups: [
      {
        range: "0-6 tuổi",
        issues: [
          "Chậm phát triển chiều cao, cân nặng",
          "Thiếu vi chất dinh dưỡng, dễ mắc các bệnh truyền nhiễm",
        ],
        services: [
          "Khám sức khỏe tổng quát, đánh giá dinh dưỡng định kỳ",
          "Tư vấn chế độ ăn phù hợp, tiêm chủng đầy đủ"
        ],
        notes:
          "Theo dõi sát chiều cao, cân nặng, chủ động bổ sung vitamin A, D, sắt, kẽm.",
      },
      {
        range: "6-12 tuổi",
        issues: [
          "Dậy thì sớm, thay đổi tâm sinh lý",
          "Khó khăn trong nhận thức về giới tính, vệ sinh cá nhân chưa đúng"
        ],
        services: [
          "Tư vấn phát triển giới tính, giáo dục vệ sinh thân thể",
          "Khám tổng quát, tư vấn phòng tránh xâm hại"
        ],
        notes:"Gia đình cần hướng dẫn kỹ năng phòng vệ cá nhân, xây dựng sự tự tin cho trẻ.",
      },
      {
        range: "13-18 tuổi",
        issues: [
          "Khủng hoảng tâm lý tuổi mới lớn, áp lực học tập, dễ bị xâm hại qua mạng xã hội",
          "Nguy cơ quan hệ tình dục sớm, thiếu kiến thức phòng tránh thai/STI"
        ],
        services: [
          "Tư vấn tâm lý vị thành niên, giáo dục giới tính an toàn",
          "Khám sức khỏe sinh sản tuổi học đường, hướng nghiệp"
        ],
        notes:
          "Khuyến khích trẻ chủ động trao đổi với cha mẹ, thầy cô hoặc chuyên gia, cung cấp thông tin phòng tránh an toàn.",
      },
    ],
    tips: [
      "Gia đình, nhà trường cần phối hợp chăm sóc, hướng dẫn trẻ về giới tính.",
      "Dạy trẻ kỹ năng nhận biết, phòng tránh nguy cơ xâm hại.",
      "Khám sức khỏe định kỳ, chú ý phát hiện bất thường sớm."
    ]
  },

  "nguoi-gia": {
    title: "Người già",
    icon: "🧓",
    overview:
      "Người cao tuổi vẫn cần duy trì đời sống tình dục an toàn, phòng ngừa các bệnh tuổi già, sống khỏe mạnh, hạnh phúc.",
    ageGroups: [
      {
        range: "Trên 60 tuổi",
        issues: [
          "Mãn dục nam/nữ, suy giảm chức năng sinh lý",
          "Loãng xương, tiểu đường, tăng huyết áp, suy giảm trí nhớ",
          "Nguy cơ ung thư tuyến tiền liệt (nam), ung thư vú/cổ tử cung (nữ)"
        ],
        services: [
          "Tầm soát ung thư định kỳ, kiểm tra nội tiết tố tuổi già",
          "Khám sức khỏe tổng quát, kiểm soát bệnh mãn tính",
          "Tư vấn tâm lý, hoạt động xã hội cho người cao tuổi"
        ],
        notes:
          "Khám sức khỏe 6-12 tháng/lần, tăng cường vận động phù hợp (đi bộ, dưỡng sinh), duy trì giao tiếp xã hội.",
      },
    ],
    tips: [
      "Không ngại chia sẻ vấn đề giới tính, sức khỏe với bác sĩ hoặc gia đình.",
      "Tập thể dục nhẹ nhàng hàng ngày.",
      "Giữ tinh thần lạc quan, gắn kết cộng đồng để sống vui, sống khỏe."
    ]
  }
};

export default userGroupDetails;