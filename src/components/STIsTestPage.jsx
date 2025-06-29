import { useEffect, useState } from "react";
import {
  TestTube,
  Calendar,
  FileText,
  User,
  Eye,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Home,
  ChevronLeft, // Add this import
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const STIsTestPage = () => {
  const [activeTab, setActiveTab] = useState("results");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // Placeholder for handleHomeExit function
  const handleHomeExit = () => {
    if (window.confirm('Bạn có chắc chắn muốn thoát khỏi hệ thống?')) {
      // In a real application, this would redirect to home page or close the application
      window.location.href = '/';
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`/api/bookings/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const bookings = res.data.bookings || [];

        const testResultsPromises = bookings.map((booking) =>
          axios.get(`/api/bookings/sti/${booking.bookingId}/test-results`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );

        Promise.all(testResultsPromises)
          .then((results) => {
            const allTestResults = results.flatMap((result) => result.data.testResults);
            setTestResults(
              allTestResults.map((result) => ({
                id: result.testResultId,
                bookingId: result.bookingId,
                patientName: result.customerName,
                testDate: result.scheduledTime,
                tests: [result.testName],
                status: result.status.toLowerCase(),
                currentPhase: result.currentPhase,
                progressPercentage: result.progressPercentage,
                estimatedMinutesRemaining: result.estimatedMinutesRemaining,
                details: {
                  patientInfo: {
                    name: result.customerName,
                    age: result.customerAge || "N/A",
                    gender: result.customerGender || "N/A",
                    phone: result.customerPhone || "N/A",
                    email: result.customerEmail || "N/A",
                  },
                  testResults: {
                    [result.testName]: {
                      status: result.result ? "abnormal" : "normal",
                      result: result.result || "Chưa có kết quả",
                      normalRange: "N/A",
                    },
                  },
                  doctorNotes: result.notes || "Không có ghi chú",
                  nextAppointment: null,
                },
                downloadUrl:
                  result.status === "completed"
                    ? `/api/bookings/sti/test-result/${result.bookingId}/report?format=PDF`
                    : null,
              }))
            );
          })
          .catch((err) => {
            console.error("Lỗi lấy kết quả xét nghiệm:", err);
          });
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách booking:", err);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "in_progress":
        return "text-blue-600 bg-blue-100";
      case "canceled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const translateGender = (gender) => {
    switch (gender) {
      case "MALE":
        return "Nam";
      case "FEMALE":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "canceled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedResult(null);
  };

  const handleDownload = (downloadUrl) => {
    axios
      .get(downloadUrl, {
        withCredentials: true,
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `test_result.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Lỗi tải file:", err);
        alert("Không thể tải file kết quả. Vui lòng thử lại.");
      });
  };

  const STIsTestBooking = () => {
    const [selectedTest, setSelectedTest] = useState(null);
    const [bookingData, setBookingData] = useState({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      notes: "",
      gender: "",
      age: "",
    });
    const navigate = useNavigate();

    const availableTests = [
      {
        id: 5,
        name: "Xét nghiệm HIV",
        description: "Phát hiện virus gây suy giảm miễn dịch mắc phải",
        price: 200000,
        duration: "30 phút",
        preparation: "Không cần nhịn ăn",
        category: "STI_HIV",
      },
      {
        id: 6,
        name: "Xét nghiệm giang mai (Syphilis)",
        description: "Phát hiện vi khuẩn Treponema pallidum",
        price: 150000,
        duration: "20 phút",
        preparation: "Không cần nhịn ăn",
        category: "STI_Syphilis",
      },
      {
        id: 7,
        name: "Xét nghiệm lậu (Gonorrhea)",
        description: "Phát hiện vi khuẩn Neisseria gonorrhoeae",
        price: 180000,
        duration: "25 phút",
        preparation: "Không quan hệ tình dục 24h trước xét nghiệm",
        category: "STI_Gonorrhea",
      },
      {
        id: 8,
        name: "Xét nghiệm Chlamydia",
        description: "Phát hiện vi khuẩn Chlamydia trachomatis",
        price: 170000,
        duration: "25 phút",
        preparation: "Không quan hệ tình dục 24h trước xét nghiệm",
        category: "STI_Chlamydia",
      },
    ];

    const timeSlots = [
      "08:00-08:30",
      "08:30-09:00",
      "09:00-09:30",
      "09:30-10:00",
      "10:00-10:30",
      "10:30-11:00",
      "14:00-14:30",
      "14:30-15:00",
      "15:00-15:30",
      "15:30-16:00",
      "16:00-16:30",
      "16:30-17:00",
    ];

    const handleTestSelection = (testId) => {
      setSelectedTest((prev) => {
        return prev?.id === testId
          ? null
          : availableTests.find((t) => t.id === testId);
      });
    };

    const handleInputChange = (field, value) => {
      setBookingData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const calculateTotal = () => (selectedTest ? selectedTest.price : 0);

    const handleBooking = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập để đặt lịch.");
        return;
      }

      if (!selectedTest) {
        alert("Vui lòng chọn ít nhất một xét nghiệm");
        return;
      }

      const { name, phone, email, date, time } = bookingData;

      if (!name || !phone || !email || !date || !time) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }

      const isValidEmail = email.includes("@");
      const isValidPhone = /^\d{10,11}$/.test(phone);

      if (!isValidEmail || !isValidPhone) {
        alert("Vui lòng nhập email hoặc số điện thoại hợp lệ.");
        return;
      }

      const amount = calculateTotal();

      const payload = {
        staffId: null,
        serviceIds: [selectedTest.id],
        bookingDate: date,
        timeSlot: time,
        paymentCode: null,
        status: null,
        isStiBooking: true,
        customerName: name,
        customerAge: bookingData.age,
        customerGender: bookingData.gender,
        customerPhone: phone,
        customerEmail: email,
        category: selectedTest.category,
      };

      try {
        const response = await axios.post("/api/bookings/sti", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (
          (response.status === 200 || response.status === 201) &&
          response.data?.paymentCode &&
          response.data?.booking?.bookingId
        ) {
          navigate("/payment", {
            state: {
              paymentCode: response.data.paymentCode,
              amount: amount,
              testName: selectedTest.name,
              bookingId: response.data.booking.bookingId,
            },
          });
        } else {
          alert("Lỗi phản hồi từ hệ thống. Vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Lỗi đặt lịch:", error.response?.data || error.message);
        alert("Không thể gửi đặt lịch. Vui lòng thử lại sau.");
      }
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Test Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Chọn xét nghiệm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTests.map((test) => (
                <div
                  key={test.id}
                  onClick={() => handleTestSelection(test.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedTest?.id === test.id
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <span className="text-purple-600 font-bold">
                      {test.price.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {test.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>⏱ {test.duration}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {test.category.replace("STI_", "")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Thông tin đặt lịch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={bookingData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tuổi *
                </label>
                <input
                  type="number"
                  value={bookingData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập tuổi"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính *
                </label>
                <select
                  value={bookingData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập địa chỉ email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày xét nghiệm *
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ xét nghiệm *
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleInputChange("time", time)}
                    className={`p-2 text-sm border rounded-lg transition-colors ${bookingData.time === time
                      ? "border-purple-600 bg-purple-50 text-purple-600"
                      : "border-gray-300 hover:border-purple-300"
                      }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú (không bắt buộc)
              </label>
              <textarea
                value={bookingData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Thông tin bổ sung..."
              />
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Tóm tắt đặt lịch
            </h3>

            {selectedTest ? (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedTest.name}</p>
                    <p className="text-sm text-gray-500">{selectedTest.duration}</p>
                  </div>
                  <span className="font-medium text-purple-600">
                    {selectedTest.price.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mb-6">Chưa chọn xét nghiệm nào</p>
            )}

            {selectedTest && (
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Tổng cộng:
                  </span>
                  <span className="text-xl font-bold text-purple-600">
                    {calculateTotal().toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={!selectedTest}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${selectedTest
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Đặt lịch xét nghiệm
            </button>

            {/* Important Notes */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Lưu ý quan trọng:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Mang theo CMND/CCCD khi đến xét nghiệm</li>
                <li>• Tuân thủ hướng dẫn chuẩn bị trước xét nghiệm</li>
                <li>• Kết quả sẽ có trong 1-3 ngày làm việc</li>
                <li>• Thông tin được bảo mật tuyệt đối</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const STIsTestInfo = () => {
    const availableTests = [
      {
        id: 5,
        name: "Xét nghiệm HIV",
        description: "Phát hiện virus gây suy giảm miễn dịch mắc phải",
        price: 200000,
        duration: "30 phút",
        preparation: "Không cần nhịn ăn",
        category: "STI_HIV",
      },
      {
        id: 6,
        name: "Xét nghiệm giang mai (Syphilis)",
        description: "Phát hiện vi khuẩn Treponema pallidum",
        price: 150000,
        duration: "20 phút",
        preparation: "Không cần nhịn ăn",
        category: "STI_Syphilis",
      },
      {
        id: 7,
        name: "Xét nghiệm lậu (Gonorrhea)",
        description: "Phát hiện vi khuẩn Neisseria gonorrhoeae",
        price: 180000,
        duration: "25 phút",
        preparation: "Không quan hệ tình dục 24h trước xét nghiệm",
        category: "STI_Gonorrhea",
      },
      {
        id: 8,
        name: "Xét nghiệm Chlamydia",
        description: "Phát hiện vi khuẩn Chlamydia trachomatis",
        price: 170000,
        duration: "25 phút",
        preparation: "Không quan hệ tình dục 24h trước xét nghiệm",
        category: "STI_Chlamydia",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Thông tin chi tiết các xét nghiệm STIs
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableTests.map((test) => (
              <div
                key={test.id}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {test.name}
                  </h3>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {test.category.replace("STI_", "")}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{test.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Giá:
                    </span>
                    <span className="text-purple-600 font-bold">
                      {test.price.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Thời gian:
                    </span>
                    <span className="text-gray-600">{test.duration}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Chuẩn bị:
                    </span>
                    <span className="text-gray-600 text-right flex-1 ml-4">
                      {test.preparation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Thông tin chung về xét nghiệm STIs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Tại sao cần xét nghiệm STIs?
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>• Phát hiện sớm các bệnh lây truyền qua đường tình dục</li>
                <li>• Điều trị kịp thời, tránh biến chứng nghiêm trọng</li>
                <li>• Bảo vệ sức khỏe bản thân và người thân</li>
                <li>• Yên tâm trong các mối quan hệ</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Ai nên xét nghiệm?
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>• Người có quan hệ tình dục không an toàn</li>
                <li>• Người có nhiều bạn tình</li>
                <li>• Người có triệu chứng nghi ngờ STIs</li>
                <li>• Định kỳ hàng năm cho người hoạt động tình dục</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Quy trình xét nghiệm
            </h4>
            <ol className="text-gray-600 space-y-2">
              <li>1. Đăng ký và điền thông tin cá nhân</li>
              <li>2. Tư vấn với chuyên viên y tế</li>
              <li>3. Lấy mẫu xét nghiệm (máu, nước tiểu, dịch tiết)</li>
              <li>4. Chờ kết quả (1-3 ngày làm việc)</li>
              <li>5. Nhận kết quả và tư vấn điều trị (nếu cần)</li>
            </ol>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Cam kết bảo mật
            </h4>
            <ul className="text-gray-600 space-y-2">
              <li>• Thông tin cá nhân được bảo mật tuyệt đối</li>
              <li>• Kết quả chỉ được cung cấp cho bản thân</li>
              <li>• Không chia sẻ thông tin với bên thứ ba</li>
              <li>• Tuân thủ nghiêm ngặt quy định pháp luật</li>
              <li>• Hệ thống bảo mật hiện đại và an toàn</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const STIsTestResults = () => {
    return (
      <div className="space-y-6">
        {/* Results List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Lịch sử xét nghiệm
            </h2>
            <p className="text-gray-600 mt-1">Kết quả và tiến trình xét nghiệm của bạn</p>
          </div>

          <div className="divide-y divide-gray-200">
            {testResults.map((result) => (
              <div
                key={result.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {result.patientName}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {new Date(result.testDate).toLocaleDateString("vi-VN")}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {result.tests.map((test, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {test}
                            </span>
                          ))}
                        </div>
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            result.status
                          )}`}
                        >
                          {getStatusIcon(result.status)}
                          <span>
                            {result.status === "completed" && "Hoàn thành"}
                            {result.status === "pending" && "Đang chờ"}
                            {result.status === "in_progress" && "Đang xử lý"}
                            {result.status === "canceled" && "Đã hủy"}
                          </span>
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Giai đoạn: {result.currentPhase}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div
                            className="bg-purple-600 h-2.5 rounded-full"
                            style={{ width: `${result.progressPercentage}%` }}
                          ></div>
                        </div>
                        {result.estimatedMinutesRemaining > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Thời gian hoàn thành dự kiến: {result.estimatedMinutesRemaining} phút
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleViewDetails(result)}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Xem chi tiết</span>
                    </button>
                    {result.downloadUrl && result.status === "completed" && (
                      <button
                        onClick={() => handleDownload(result.downloadUrl)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const DetailsModal = () => {
    if (!showDetailsModal || !selectedResult) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Chi tiết kết quả xét nghiệm
            </h2>
            <button
              onClick={closeDetailsModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Đóng modal"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Patient Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin bệnh nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Họ và tên:
                  </span>
                  <p className="text-gray-900">
                    {selectedResult.details.patientInfo.name}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Tuổi:
                  </span>
                  <p className="text-gray-900">
                    {selectedResult.details.patientInfo.age}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Giới tính:
                  </span>
                  <p className="text-gray-900">
                    {translateGender(selectedResult.details.patientInfo.gender)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Số điện thoại:
                  </span>
                  <p className="text-gray-900">
                    {selectedResult.details.patientInfo.phone}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">
                    Email:
                  </span>
                  <p className="text-gray-900">
                    {selectedResult.details.patientInfo.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Test Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin xét nghiệm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Ngày xét nghiệm:
                  </span>
                  <p className="text-gray-900">
                    {new Date(selectedResult.testDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Trạng thái:
                  </span>
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedResult.status
                    )}`}
                  >
                    {getStatusIcon(selectedResult.status)}
                    <span>
                      {selectedResult.status === "completed" && "Hoàn thành"}
                      {selectedResult.status === "pending" && "Đang chờ"}
                      {selectedResult.status === "in_progress" && "Đang xử lý"}
                      {selectedResult.status === "canceled" && "Đã hủy"}
                    </span>
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">
                    Giai đoạn hiện tại:
                  </span>
                  <p className="text-gray-900">{selectedResult.currentPhase}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">
                    Tiến độ:
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: `${selectedResult.progressPercentage}%` }}
                    ></div>
                  </div>
                  {selectedResult.estimatedMinutesRemaining > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Thời gian hoàn thành dự kiến: {selectedResult.estimatedMinutesRemaining} phút
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">
                    Các xét nghiệm đã thực hiện:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedResult.tests.map((test, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                      >
                        {test}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Test Results */}
            {selectedResult.status === "completed" &&
              Object.keys(selectedResult.details.testResults).length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Kết quả xét nghiệm
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(selectedResult.details.testResults).map(
                      ([testName, result]) => (
                        <div
                          key={testName}
                          className="border border-gray-100 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">
                              {testName}
                            </h4>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${result.status === "normal"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}
                            >
                              {result.result}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Kết quả:</span>
                              <span className="ml-2 font-medium">
                                {result.result}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Giá trị bình thường:
                              </span>
                              <span className="ml-2 font-medium">
                                {result.normalRange}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Doctor Notes */}
            {selectedResult.details.doctorNotes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Ghi chú của bác sĩ
                </h3>
                <p className="text-blue-800">
                  {selectedResult.details.doctorNotes}
                </p>
              </div>
            )}

            {/* Next Appointment */}
            {selectedResult.details.nextAppointment && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  Lịch hẹn tiếp theo
                </h3>
                <p className="text-green-800">
                  Ngày tái khám:{" "}
                  {new Date(
                    selectedResult.details.nextAppointment
                  ).toLocaleDateString("vi-VN")}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              {selectedResult.downloadUrl && selectedResult.status === "completed" && (
                <button
                  onClick={() => handleDownload(selectedResult.downloadUrl)}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Tải kết quả</span>
                </button>
              )}
              <button
                onClick={closeDetailsModal}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Home Button - fixed at top-left, purple, beautiful */}
      <button
        className="fixed top-6 left-6 z-50 flex items-center bg-purple-600 hover:bg-purple-700 text-white px-16 py-3 rounded-full font-bold text-[24px] shadow-xl"
        style={{
          minWidth: 0,
          boxShadow: "0 6px 32px 0 rgba(139, 92, 246, 0.18)",
        }}
        onClick={handleHomeExit}
      >
        <ChevronLeft className="w-8 h-8 mr-3 text-white" />
        Trang chủ
      </button>

      {/* Header */}
      <div className="bg-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <TestTube className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Xét nghiệm STIs</h1>
            </div>
            {/* Remove the old home-exit button from here */}
          </div>
          <p className="text-purple-100 text-lg">
            Dịch vụ xét nghiệm các bệnh lây truyền qua đường tình dục an toàn và
            bảo mật
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "book-test", label: "Đặt lịch xét nghiệm", icon: Calendar },
              {
                id: "test-info",
                label: "Thông tin xét nghiệm",
                icon: FileText,
              },
              {
                id: "results",
                label: "Kết quả xét nghiệm",
                icon: TestTube,
                badge: testResults.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "book-test" && <STIsTestBooking />}
        {activeTab === "test-info" && <STIsTestInfo />}
        {activeTab === "results" && <STIsTestResults />}
      </div>

      {/* Details Modal */}
      <DetailsModal />
    </div>
  );
};

export default STIsTestPage;