import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  User,
  Tag,
  Clock,
  Eye,
  Star,
  Share2,
  MessageCircle,
  ChevronRight,
  Filter,
  TrendingUp,
  BookOpen,
  ArrowLeft,
  Facebook,
  Twitter,
  Link as LinkIcon,
  Home,
  ChevronLeft,
  Send,
  ThumbsUp,
  Reply
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showFullPost, setShowFullPost] = useState(false);
  const [userRatings, setUserRatings] = useState(new Map());
  const [sortBy, setSortBy] = useState('latest');
  const [isScrolled, setIsScrolled] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(new Map());

  // Handle scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle home exit
  const handleHomeExit = () => {
    // if (window.confirm('Bạn có chắc chắn muốn quay về trang chủ?')) {
      window.location.href = '/';
    // }
  };

  // Mock blog data with ratings and comments
  const blogPosts = [
    {
      id: 1,
      title: "Hướng dẫn chăm sóc sức khỏe sinh sản cho phụ nữ",
      excerpt: "Tìm hiểu những kiến thức cơ bản về chăm sóc sức khỏe sinh sản, từ vệ sinh cá nhân đến các dấu hiệu cần lưu ý...",
      content: `
        <h2>Tầm quan trọng của việc chăm sóc sức khỏe sinh sản</h2>
        <p>Sức khỏe sinh sản là một phần quan trọng trong cuộc sống của mọi phụ nữ. Việc chăm sóc đúng cách không chỉ giúp phòng ngừa các bệnh lý mà còn nâng cao chất lượng cuộc sống.</p>
        
        <h3>1. Vệ sinh cá nhân hàng ngày</h3>
        <p>Vệ sinh vùng kín đúng cách là bước đầu tiên và quan trọng nhất:</p>
        <ul>
          <li>Sử dụng nước sạch và xà phòng pH trung tính</li>
          <li>Rửa từ trước ra sau để tránh nhiễm khuẩn</li>
          <li>Thay đồ lót hàng ngày, chọn chất liệu cotton thoáng khí</li>
          <li>Tránh sử dụng các sản phẩm có hương liệu mạnh</li>
        </ul>

        <h3>2. Theo dõi chu kỳ kinh nguyệt</h3>
        <p>Việc theo dõi chu kỳ kinh nguyệt giúp phát hiện sớm các bất thường:</p>
        <ul>
          <li>Ghi chép ngày bắt đầu và kết thúc chu kỳ</li>
          <li>Quan sát lượng kinh và màu sắc</li>
          <li>Chú ý đến các triệu chứng đau bụng, đau đầu</li>
          <li>Tham khảo ý kiến bác sĩ nếu có bất thường</li>
        </ul>

        <h3>3. Dinh dưỡng và lối sống lành mạnh</h3>
        <p>Chế độ ăn uống và sinh hoạt ảnh hưởng trực tiếp đến sức khỏe sinh sản:</p>
        <ul>
          <li>Bổ sung đủ vitamin và khoáng chất</li>
          <li>Tập thể dục đều đặn</li>
          <li>Tránh stress và căng thẳng</li>
          <li>Ngủ đủ giấc và đúng giờ</li>
        </ul>

        <h3>4. Khám sức khỏe định kỳ</h3>
        <p>Việc khám sức khỏe định kỳ giúp phát hiện và điều trị sớm các vấn đề:</p>
        <ul>
          <li>Khám phụ khoa 6 tháng/lần</li>
          <li>Xét nghiệm tầm soát ung thư cổ tử cung</li>
          <li>Siêu âm vùng chậu khi cần thiết</li>
          <li>Tư vấn với chuyên gia khi có thắc mắc</li>
        </ul>

        <p><strong>Kết luận:</strong> Chăm sóc sức khỏe sinh sản là trách nhiệm của mỗi phụ nữ với chính mình. Hãy luôn chú ý đến cơ thể và không ngần ngại tìm kiếm sự hỗ trợ y tế khi cần thiết.</p>
      `,
      category: "women-health",
      author: "BS. Nguyễn Thị Hương",
      publishDate: "2024-01-15",
      readTime: "8 phút đọc",
      views: 1250,
      averageRating: 4.5,
      totalRatings: 89,
      comments: 23,
      image: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1",
      tags: ["sức khỏe phụ nữ", "chăm sóc cá nhân", "vệ sinh", "chu kỳ kinh nguyệt"]
    },
    {
      id: 2,
      title: "Phòng ngừa các bệnh lây truyền qua đường tình dục",
      excerpt: "Tìm hiểu về các biện pháp phòng ngừa hiệu quả để bảo vệ bản thân khỏi các bệnh lây truyền qua đường tình dục...",
      content: `
        <h2>Hiểu về các bệnh lây truyền qua đường tình dục (STDs)</h2>
        <p>Các bệnh lây truyền qua đường tình dục là những nhiễm trùng có thể lây lan thông qua hoạt động tình dục. Việc hiểu rõ và phòng ngừa là vô cùng quan trọng.</p>
        
        <h3>1. Các loại STDs phổ biến</h3>
        <ul>
          <li><strong>HIV/AIDS:</strong> Virus gây suy giảm miễn dịch</li>
          <li><strong>Giang mai:</strong> Nhiễm trùng do vi khuẩn Treponema pallidum</li>
          <li><strong>Lậu:</strong> Nhiễm trùng do vi khuẩn Neisseria gonorrhoeae</li>
          <li><strong>Chlamydia:</strong> Nhiễm trùng do vi khuẩn Chlamydia trachomatis</li>
          <li><strong>Herpes:</strong> Virus herpes simplex (HSV-1, HSV-2)</li>
        </ul>

        <h3>2. Biện pháp phòng ngừa hiệu quả</h3>
        <p><strong>Sử dụng bao cao su:</strong></p>
        <ul>
          <li>Sử dụng bao cao su latex hoặc polyurethane</li>
          <li>Kiểm tra hạn sử dụng trước khi dùng</li>
          <li>Sử dụng đúng cách từ đầu đến cuối</li>
          <li>Không tái sử dụng</li>
        </ul>

        <p><strong>Quan hệ tình dục an toàn:</strong></p>
        <ul>
          <li>Hạn chế số lượng bạn tình</li>
          <li>Tìm hiểu tình trạng sức khỏe của bạn tình</li>
          <li>Tránh quan hệ khi có vết thương hở</li>
          <li>Không chia sẻ đồ dùng cá nhân</li>
        </ul>

        <h3>3. Xét nghiệm định kỳ</h3>
        <p>Xét nghiệm định kỳ giúp phát hiện sớm và điều trị kịp thời:</p>
        <ul>
          <li>Xét nghiệm HIV 3-6 tháng/lần</li>
          <li>Xét nghiệm giang mai, lậu hàng năm</li>
          <li>Xét nghiệm Chlamydia cho phụ nữ dưới 25 tuổi</li>
          <li>Tầm soát HPV cho phụ nữ từ 21 tuổi</li>
        </ul>

        <h3>4. Nhận biết các triệu chứng</h3>
        <p>Cần đến gặp bác sĩ ngay khi có các triệu chứng:</p>
        <ul>
          <li>Đau rát khi tiểu tiện</li>
          <li>Dịch tiết bất thường</li>
          <li>Đau vùng chậu</li>
          <li>Phát ban, loét vùng sinh dục</li>
          <li>Sốt không rõ nguyên nhân</li>
        </ul>

        <p><strong>Lưu ý quan trọng:</strong> Nhiều STDs có thể không có triệu chứng rõ ràng, vì vậy xét nghiệm định kỳ là rất cần thiết.</p>
      `,
      category: "prevention",
      author: "BS. Trần Văn Minh",
      publishDate: "2024-01-12",
      readTime: "10 phút đọc",
      views: 2100,
      averageRating: 4.8,
      totalRatings: 156,
      comments: 45,
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1",
      tags: ["phòng ngừa", "STDs", "an toàn", "xét nghiệm"]
    },
    {
      id: 3,
      title: "Tầm quan trọng của việc tư vấn sức khỏe tâm lý",
      excerpt: "Sức khỏe tâm lý ảnh hưởng trực tiếp đến sức khỏe thể chất và chất lượng cuộc sống. Tìm hiểu về tầm quan trọng của việc chăm sóc sức khỏe tinh thần...",
      content: `
        <h2>Sức khỏe tâm lý và tác động đến cuộc sống</h2>
        <p>Sức khỏe tâm lý không chỉ ảnh hưởng đến cảm xúc mà còn tác động trực tiếp đến sức khỏe thể chất, mối quan hệ xã hội và hiệu suất công việc.</p>
        
        <h3>1. Tại sao sức khỏe tâm lý quan trọng?</h3>
        <ul>
          <li><strong>Ảnh hưởng đến sức khỏe thể chất:</strong> Stress và lo âu có thể gây ra các vấn đề như đau đầu, mất ngủ, rối loạn tiêu hóa</li>
          <li><strong>Tác động đến mối quan hệ:</strong> Tình trạng tâm lý không ổn định có thể làm xấu đi các mối quan hệ gia đình, bạn bè</li>
          <li><strong>Hiệu suất công việc:</strong> Sức khỏe tâm lý tốt giúp tăng khả năng tập trung và sáng tạo</li>
          <li><strong>Chất lượng cuộc sống:</strong> Cảm thấy hạnh phúc và hài lòng với cuộc sống</li>
        </ul>

        <h3>2. Các dấu hiệu cần chú ý</h3>
        <p>Cần tìm kiếm sự hỗ trợ chuyên nghiệp khi có các dấu hiệu:</p>
        <ul>
          <li>Cảm giác buồn bã, tuyệt vọng kéo dài</li>
          <li>Lo âu quá mức, hoảng loạn</li>
          <li>Thay đổi thói quen ăn uống, ngủ nghỉ</li>
          <li>Khó tập trung, ra quyết định</li>
          <li>Cô lập bản thân khỏi người khác</li>
          <li>Sử dụng chất kích thích để đối phó</li>
        </ul>

        <h3>3. Lợi ích của việc tư vấn tâm lý</h3>
        <p><strong>Không gian an toàn:</strong></p>
        <ul>
          <li>Chia sẻ mà không bị phán xét</li>
          <li>Bảo mật thông tin tuyệt đối</li>
          <li>Được lắng nghe và thấu hiểu</li>
        </ul>

        <p><strong>Kỹ năng đối phó:</strong></p>
        <ul>
          <li>Học cách quản lý stress</li>
          <li>Phát triển kỹ năng giao tiếp</li>
          <li>Xây dựng lòng tự tin</li>
          <li>Giải quyết xung đột hiệu quả</li>
        </ul>

        <h3>4. Các phương pháp tư vấn phổ biến</h3>
        <ul>
          <li><strong>Liệu pháp nhận thức hành vi (CBT):</strong> Thay đổi suy nghĩ và hành vi tiêu cực</li>
          <li><strong>Liệu pháp tâm lý động lực:</strong> Khám phá các xung đột tiềm thức</li>
          <li><strong>Liệu pháp nhân văn:</strong> Tập trung vào tiềm năng và sự phát triển cá nhân</li>
          <li><strong>Liệu pháp gia đình:</strong> Cải thiện mối quan hệ trong gia đình</li>
        </ul>

        <h3>5. Khi nào nên tìm kiếm sự hỗ trợ?</h3>
        <p>Đừng chờ đến khi vấn đề trở nên nghiêm trọng. Hãy tìm kiếm sự hỗ trợ khi:</p>
        <ul>
          <li>Cảm thấy quá tải với cuộc sống</li>
          <li>Gặp khó khăn trong mối quan hệ</li>
          <li>Trải qua những thay đổi lớn trong cuộc sống</li>
          <li>Muốn phát triển bản thân</li>
          <li>Cần ai đó lắng nghe và hỗ trợ</li>
        </ul>

        <p><strong>Nhớ rằng:</strong> Tìm kiếm sự hỗ trợ tâm lý không phải là dấu hiệu của sự yếu đuối, mà là một hành động dũng cảm để chăm sóc bản thân.</p>
      `,
      category: "mental-health",
      author: "ThS. Lê Thị Mai",
      publishDate: "2024-01-10",
      readTime: "7 phút đọc",
      views: 890,
      averageRating: 4.2,
      totalRatings: 67,
      comments: 18,
      image: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1",
      tags: ["sức khỏe tâm lý", "tư vấn", "stress", "lo âu"]
    },
    {
      id: 4,
      title: "Dinh dưỡng và sức khỏe sinh sản",
      excerpt: "Chế độ ăn uống có ảnh hưởng lớn đến sức khỏe sinh sản. Tìm hiểu về những thực phẩm nên và không nên ăn để duy trì sức khỏe tối ưu...",
      content: `
        <h2>Mối liên hệ giữa dinh dưỡng và sức khỏe sinh sản</h2>
        <p>Chế độ ăn uống cân bằng không chỉ giúp duy trì sức khỏe tổng thể mà còn đóng vai trò quan trọng trong việc duy trì chức năng sinh sản khỏe mạnh.</p>
        
        <h3>1. Các chất dinh dưỡng quan trọng</h3>
        <p><strong>Axit folic:</strong></p>
        <ul>
          <li>Quan trọng cho phụ nữ chuẩn bị mang thai</li>
          <li>Giúp phòng ngừa dị tật ống thần kinh</li>
          <li>Nguồn: rau lá xanh, đậu, cam, ngũ cốc tăng cường</li>
          <li>Liều khuyến nghị: 400-800 mcg/ngày</li>
        </ul>

        <p><strong>Sắt:</strong></p>
        <ul>
          <li>Phòng ngừa thiếu máu</li>
          <li>Hỗ trợ chu kỳ kinh nguyệt đều đặn</li>
          <li>Nguồn: thịt đỏ, gan, rau bina, đậu lăng</li>
          <li>Kết hợp với vitamin C để tăng hấp thu</li>
        </ul>

        <p><strong>Omega-3:</strong></p>
        <ul>
          <li>Giảm viêm, cân bằng hormone</li>
          <li>Hỗ trợ phát triển não bộ thai nhi</li>
          <li>Nguồn: cá hồi, cá thu, hạt chia, quả óc chó</li>
          <li>Liều khuyến nghị: 250-500mg EPA+DHA/ngày</li>
        </ul>

        <h3>2. Thực phẩm nên ăn</h3>
        <p><strong>Rau củ quả:</strong></p>
        <ul>
          <li>Cung cấp vitamin, khoáng chất và chất chống oxi hóa</li>
          <li>Ưu tiên rau lá xanh đậm màu</li>
          <li>Trái cây giàu vitamin C</li>
          <li>Mục tiêu: 5-7 khẩu phần/ngày</li>
        </ul>

        <p><strong>Protein chất lượng cao:</strong></p>
        <ul>
          <li>Cá, thịt nạc, trứng, đậu</li>
          <li>Hỗ trợ sản xuất hormone</li>
          <li>Duy trì khối lượng cơ</li>
          <li>Khoảng 0.8-1g/kg thể trọng/ngày</li>
        </ul>

        <p><strong>Ngũ cốc nguyên hạt:</strong></p>
        <ul>
          <li>Cung cấp năng lượng ổn định</li>
          <li>Giàu vitamin B và chất xơ</li>
          <li>Giúp cân bằng đường huyết</li>
          <li>Chọn gạo lứt, yến mạch, quinoa</li>
        </ul>

        <h3>3. Thực phẩm nên hạn chế</h3>
        <p><strong>Đường và thực phẩm chế biến:</strong></p>
        <ul>
          <li>Gây tăng đường huyết đột ngột</li>
          <li>Ảnh hưởng đến cân bằng hormone</li>
          <li>Tăng nguy cơ viêm nhiễm</li>
          <li>Hạn chế kẹo, bánh ngọt, nước ngọt</li>
        </ul>

        <p><strong>Chất béo trans:</strong></p>
        <ul>
          <li>Tăng nguy cơ vô sinh</li>
          <li>Gây viêm và rối loạn hormone</li>
          <li>Tránh thực phẩm chiên rán, bánh quy công nghiệp</li>
          <li>Đọc nhãn thành phần cẩn thận</li>
        </ul>

        <p><strong>Caffeine và rượu:</strong></p>
        <ul>
          <li>Hạn chế caffeine dưới 200mg/ngày</li>
          <li>Tránh hoàn toàn rượu khi mang thai</li>
          <li>Có thể ảnh hưởng đến khả năng thụ thai</li>
          <li>Thay thế bằng trà thảo mộc, nước lọc</li>
        </ul>

        <h3>4. Lời khuyên thực tế</h3>
        <ul>
          <li><strong>Ăn đa dạng:</strong> Kết hợp nhiều loại thực phẩm khác nhau</li>
          <li><strong>Uống đủ nước:</strong> 8-10 ly nước/ngày</li>
          <li><strong>Ăn đều đặn:</strong> 3 bữa chính + 2 bữa phụ</li>
          <li><strong>Nấu ăn tại nhà:</strong> Kiểm soát được chất lượng và lượng gia vị</li>
          <li><strong>Bổ sung vitamin:</strong> Tham khảo ý kiến bác sĩ về việc uống vitamin tổng hợp</li>
        </ul>

        <p><strong>Kết luận:</strong> Một chế độ ăn uống cân bằng và lành mạnh là nền tảng cho sức khỏe sinh sản tốt. Hãy bắt đầu từ những thay đổi nhỏ và duy trì lâu dài.</p>
      `,
      category: "nutrition",
      author: "BS. Phạm Thị Lan",
      publishDate: "2024-01-08",
      readTime: "9 phút đọc",
      views: 1560,
      averageRating: 4.6,
      totalRatings: 112,
      comments: 31,
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1",
      tags: ["dinh dưỡng", "sức khỏe sinh sản", "vitamin", "thực phẩm"]
    },
    {
      id: 5,
      title: "Cách nhận biết và xử lý các triệu chứng bất thường",
      excerpt: "Học cách nhận biết các dấu hiệu cảnh báo về sức khỏe sinh sản và biết khi nào cần tìm kiếm sự hỗ trợ y tế...",
      content: `
        <h2>Nhận biết các triệu chứng bất thường</h2>
        <p>Việc nhận biết sớm các triệu chứng bất thường giúp phát hiện và điều trị kịp thời các vấn đề sức khỏe sinh sản.</p>
        
        <h3>1. Triệu chứng cần chú ý ở phụ nữ</h3>
        <p><strong>Rối loạn kinh nguyệt:</strong></p>
        <ul>
          <li>Kinh nguyệt không đều, quá nhiều hoặc quá ít</li>
          <li>Đau bụng dưới nghiêm trọng trong kỳ kinh</li>
          <li>Chảy máu bất thường giữa các chu kỳ</li>
          <li>Ngừng kinh đột ngột ở tuổi sinh sản</li>
        </ul>

        <p><strong>Dịch tiết âm đạo bất thường:</strong></p>
        <ul>
          <li>Thay đổi màu sắc: vàng, xanh, xám</li>
          <li>Mùi hôi khó chịu</li>
          <li>Ngứa, rát, đau khi tiểu tiện</li>
          <li>Lượng dịch tiết tăng đột ngột</li>
        </ul>

        <p><strong>Đau vùng chậu:</strong></p>
        <ul>
          <li>Đau liên tục hoặc tái phát</li>
          <li>Đau khi quan hệ tình dục</li>
          <li>Đau lan xuống chân</li>
          <li>Kèm theo sốt, buồn nôn</li>
        </ul>

        <h3>2. Triệu chứng cần chú ý ở nam giới</h3>
        <p><strong>Vấn đề tiết niệu:</strong></p>
        <ul>
          <li>Đau, rát khi tiểu tiện</li>
          <li>Tiểu buốt, tiểu gấp</li>
          <li>Nước tiểu có máu hoặc mủ</li>
          <li>Khó tiểu hoặc tiểu không hết</li>
        </ul>

        <p><strong>Dịch tiết bất thường:</strong></p>
        <ul>
          <li>Dịch tiết từ dương vật</li>
          <li>Màu sắc bất thường: vàng, xanh</li>
          <li>Mùi hôi</li>
          <li>Kèm theo đau rát</li>
        </ul>

        <p><strong>Vấn đề vùng sinh dục:</strong></p>
        <ul>
          <li>Sưng, đau tinh hoàn</li>
          <li>Khối u bất thường</li>
          <li>Phát ban, loét</li>
          <li>Ngứa, rát vùng bìu</li>
        </ul>

        <h3>3. Khi nào cần gặp bác sĩ ngay lập tức?</h3>
        <p><strong>Tình huống khẩn cấp:</strong></p>
        <ul>
          <li>Đau bụng dưới dữ dội đột ngột</li>
          <li>Chảy máu âm đạo nhiều bất thường</li>
          <li>Sốt cao kèm đau vùng chậu</li>
          <li>Đau tinh hoàn dữ dội đột ngột</li>
          <li>Không thể tiểu tiện</li>
        </ul>

        <p><strong>Cần khám trong vòng 24-48 giờ:</strong></p>
        <ul>
          <li>Triệu chứng nhiễm trùng đường tiết niệu</li>
          <li>Dịch tiết bất thường kèm mùi hôi</li>
          <li>Đau khi quan hệ tình dục</li>
          <li>Phát ban, loét vùng sinh dục</li>
        </ul>

        <h3>4. Cách xử lý ban đầu tại nhà</h3>
        <p><strong>Biện pháp chăm sóc chung:</strong></p>
        <ul>
          <li>Giữ vệ sinh vùng sinh dục sạch sẽ</li>
          <li>Mặc đồ lót cotton thoáng khí</li>
          <li>Tránh sử dụng xà phòng có hương liệu</li>
          <li>Uống nhiều nước</li>
          <li>Nghỉ ngơi đầy đủ</li>
        </ul>

        <p><strong>Khi có triệu chứng nhẹ:</strong></p>
        <ul>
          <li>Theo dõi triệu chứng trong 1-2 ngày</li>
          <li>Ghi chép các thay đổi</li>
          <li>Tránh tự ý dùng thuốc</li>
          <li>Không quan hệ tình dục cho đến khi khỏi</li>
        </ul>

        <h3>5. Phòng ngừa các vấn đề sức khỏe</h3>
        <ul>
          <li><strong>Khám sức khỏe định kỳ:</strong> 6-12 tháng/lần</li>
          <li><strong>Vệ sinh cá nhân:</strong> Đúng cách và đều đặn</li>
          <li><strong>Quan hệ tình dục an toàn:</strong> Sử dụng biện pháp bảo vệ</li>
          <li><strong>Lối sống lành mạnh:</strong> Ăn uống cân bằng, tập thể dục</li>
          <li><strong>Quản lý stress:</strong> Thư giãn, nghỉ ngơi đầy đủ</li>
        </ul>

        <p><strong>Nhớ rằng:</strong> Đừng ngại ngùng khi có triệu chứng bất thường. Việc tìm kiếm sự hỗ trợ y tế sớm sẽ giúp điều trị hiệu quả và tránh biến chứng.</p>
      `,
      category: "symptoms",
      author: "BS. Hoàng Văn Đức",
      publishDate: "2024-01-05",
      readTime: "11 phút đọc",
      views: 1890,
      averageRating: 4.3,
      totalRatings: 134,
      comments: 52,
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1",
      tags: ["triệu chứng", "chẩn đoán", "khám bệnh", "sức khỏe"]
    },
    {
      id: 6,
      title: "Tầm quan trọng của việc tiêm chủng phòng bệnh",
      excerpt: "Tìm hiểu về các loại vaccine quan trọng cho sức khỏe sinh sản và lịch tiêm chủng khuyến nghị cho từng độ tuổi...",
      content: `
        <h2>Vaccine và sức khỏe sinh sản</h2>
        <p>Tiêm chủng là một trong những biện pháp phòng ngừa hiệu quả nhất để bảo vệ sức khỏe sinh sản và phòng ngừa các bệnh lây truyền qua đường tình dục.</p>
        
        <h3>1. Vaccine HPV (Human Papillomavirus)</h3>
        <p><strong>Tầm quan trọng:</strong></p>
        <ul>
          <li>Phòng ngừa ung thư cổ tử cung, âm hộ, âm đạo</li>
          <li>Phòng ngừa ung thư hậu môn, họng</li>
          <li>Phòng ngừa mụn cóc sinh dục</li>
          <li>Hiệu quả cao khi tiêm trước khi có quan hệ tình dục</li>
        </ul>

        <p><strong>Lịch tiêm khuyến nghị:</strong></p>
        <ul>
          <li>Tuổi lý tưởng: 11-12 tuổi (có thể từ 9 tuổi)</li>
          <li>Bổ sung cho người 13-26 tuổi chưa tiêm</li>
          <li>Cân nhắc cho người 27-45 tuổi</li>
          <li>Tiêm 2-3 mũi tùy theo tuổi bắt đầu</li>
        </ul>

        <h3>2. Vaccine Hepatitis B</h3>
        <p><strong>Tầm quan trọng:</strong></p>
        <ul>
          <li>Phòng ngừa viêm gan B</li>
          <li>Giảm nguy cơ xơ gan, ung thư gan</li>
          <li>Bảo vệ thai nhi khỏi lây nhiễm từ mẹ</li>
          <li>Quan trọng cho người có nhiều bạn tình</li>
        </ul>

        <p><strong>Lịch tiêm:</strong></p>
        <ul>
          <li>3 mũi: tháng 0, 1, 6</li>
          <li>Kiểm tra kháng thể sau tiêm</li>
          <li>Tiêm bổ sung nếu cần thiết</li>
          <li>Ưu tiên cho nhóm nguy cơ cao</li>
        </ul>

        <h3>3. Vaccine phòng ngừa khác</h3>
        <p><strong>Vaccine MMR (Sởi-Quai bị-Rubella):</strong></p>
        <ul>
          <li>Quan trọng cho phụ nữ chuẩn bị mang thai</li>
          <li>Rubella có thể gây dị tật thai nhi</li>
          <li>Kiểm tra miễn dịch trước khi mang thai</li>
          <li>Không tiêm khi đang mang thai</li>
        </ul>

        <p><strong>Vaccine Tdap (Bạch hầu-Ho gà-Uốn ván):</strong></p>
        <ul>
          <li>Tiêm trong thai kỳ (27-36 tuần)</li>
          <li>Bảo vệ trẻ sơ sinh khỏi ho gà</li>
          <li>Tiêm nhắc lại mỗi 10 năm</li>
          <li>Quan trọng cho người chăm sóc trẻ em</li>
        </ul>

        <h3>4. Lịch tiêm chủng theo độ tuổi</h3>
        <p><strong>Tuổi vị thành niên (11-18 tuổi):</strong></p>
        <ul>
          <li>HPV: 2-3 mũi</li>
          <li>Tdap: 1 mũi</li>
          <li>MMR: 2 mũi (nếu chưa tiêm đủ)</li>
          <li>Hepatitis B: 3 mũi (nếu chưa tiêm)</li>
        </ul>

        <p><strong>Tuổi trưởng thành (19-26 tuổi):</strong></p>
        <ul>
          <li>HPV: Bổ sung nếu chưa tiêm đủ</li>
          <li>MMR: Kiểm tra miễn dịch</li>
          <li>Hepatitis B: Cho nhóm nguy cơ cao</li>
          <li>Cúm: Hàng năm</li>
        </ul>

        <p><strong>Phụ nữ mang thai:</strong></p>
        <ul>
          <li>Tdap: Mỗi lần mang thai</li>
          <li>Cúm: Nếu trong mùa cúm</li>
          <li>Tránh vaccine sống độc lực giảm</li>
          <li>Tham khảo bác sĩ trước khi tiêm</li>
        </ul>

        <h3>5. Lưu ý quan trọng</h3>
        <p><strong>Trước khi tiêm:</strong></p>
        <ul>
          <li>Thông báo tình trạng sức khỏe hiện tại</li>
          <li>Báo cáo dị ứng vaccine trước đó</li>
          <li>Thông báo nếu đang mang thai hoặc cho con bú</li>
          <li>Hỏi về tác dụng phụ có thể xảy ra</li>
        </ul>

        <p><strong>Sau khi tiêm:</strong></p>
        <ul>
          <li>Theo dõi tác dụng phụ trong 15-20 phút</li>
          <li>Đau, sưng tại chỗ tiêm là bình thường</li>
          <li>Sốt nhẹ có thể xảy ra</li>
          <li>Liên hệ bác sĩ nếu có phản ứng nghiêm trọng</li>
        </ul>

        <p><strong>Ghi nhớ:</strong></p>
        <ul>
          <li>Lưu giữ sổ tiêm chủng</li>
          <li>Nhắc nhở tiêm nhắc lại đúng hạn</li>
          <li>Tham khảo bác sĩ về lịch tiêm phù hợp</li>
          <li>Cập nhật thông tin vaccine mới</li>
        </ul>

        <p><strong>Kết luận:</strong> Tiêm chủng là khoản đầu tư quan trọng cho sức khỏe dài hạn. Hãy tham khảo ý kiến bác sĩ để có lịch tiêm phù hợp với tình trạng sức khỏe cá nhân.</p>
      `,
      category: "prevention",
      author: "BS. Nguyễn Thị Hoa",
      publishDate: "2024-01-03",
      readTime: "8 phút đọc",
      views: 1120,
      averageRating: 4.7,
      totalRatings: 78,
      comments: 25,
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1",
      tags: ["vaccine", "tiêm chủng", "phòng ngừa", "HPV"]
    }
  ];

  // Mock comments data
  const mockComments = new Map([
    [1, [
      {
        id: 1,
        author: "Nguyễn Thị Lan",
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
        content: "Bài viết rất hữu ích! Tôi đã áp dụng những lời khuyên này và thấy sức khỏe cải thiện rõ rệt.",
        rating: 5,
        date: "2024-01-16",
        likes: 12,
        replies: [
          {
            id: 11,
            author: "BS. Nguyễn Thị Hương",
            avatar: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
            content: "Cảm ơn bạn đã chia sẻ! Rất vui khi biết bài viết có ích cho bạn.",
            date: "2024-01-16",
            likes: 3
          }
        ]
      },
      {
        id: 2,
        author: "Trần Văn Nam",
        avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
        content: "Thông tin rất chi tiết và dễ hiểu. Cảm ơn bác sĩ đã chia sẻ!",
        rating: 4,
        date: "2024-01-15",
        likes: 8,
        replies: []
      },
      {
        id: 3,
        author: "Lê Thị Hoa",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
        content: "Tôi có thể hỏi thêm về việc chọn sản phẩm vệ sinh phù hợp không ạ?",
        rating: 5,
        date: "2024-01-14",
        likes: 5,
        replies: [
          {
            id: 31,
            author: "BS. Nguyễn Thị Hương",
            avatar: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
            content: "Bạn nên chọn sản phẩm có pH từ 3.5-4.5, không chứa hương liệu và chất tẩy mạnh. Tôi sẽ viết bài chi tiết về chủ đề này.",
            date: "2024-01-14",
            likes: 7
          }
        ]
      }
    ]],
    [2, [
      {
        id: 4,
        author: "Phạm Minh Tuấn",
        avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
        content: "Bài viết rất quan trọng! Mọi người nên đọc để bảo vệ bản thân.",
        rating: 5,
        date: "2024-01-13",
        likes: 15,
        replies: []
      },
      {
        id: 5,
        author: "Nguyễn Thị Mai",
        avatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
        content: "Cảm ơn bác sĩ đã cung cấp thông tin chi tiết về các biện pháp phòng ngừa.",
        rating: 5,
        date: "2024-01-12",
        likes: 9,
        replies: []
      }
    ]]
  ]);

  // Initialize comments state
  useEffect(() => {
    setComments(mockComments);
  }, []);

  const categories = [
    { id: 'all', name: 'Tất cả', count: blogPosts.length },
    { id: 'women-health', name: 'Sức khỏe phụ nữ', count: blogPosts.filter(post => post.category === 'women-health').length },
    { id: 'prevention', name: 'Phòng ngừa', count: blogPosts.filter(post => post.category === 'prevention').length },
    { id: 'mental-health', name: 'Sức khỏe tâm lý', count: blogPosts.filter(post => post.category === 'mental-health').length },
    { id: 'nutrition', name: 'Dinh dưỡng', count: blogPosts.filter(post => post.category === 'nutrition').length },
    { id: 'symptoms', name: 'Triệu chứng', count: blogPosts.filter(post => post.category === 'symptoms').length }
  ];

  // Filter and sort posts
  const filteredPosts = blogPosts
    .filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.publishDate) - new Date(a.publishDate);
        case 'popular':
          return b.views - a.views;
        case 'highest-rated':
          return b.averageRating - a.averageRating;
        default:
          return 0;
      }
    });

  const handleRating = (postId, rating) => {
    setUserRatings(prev => new Map(prev.set(postId, rating)));
  };

  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link bài viết!');
    }
  };

  const handleAddComment = (postId) => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: "Người dùng",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      content: newComment,
      rating: userRatings.get(postId) || 5,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      replies: []
    };

    setComments(prev => {
      const newComments = new Map(prev);
      const postComments = newComments.get(postId) || [];
      newComments.set(postId, [comment, ...postComments]);
      return newComments;
    });

    setNewComment('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-gray-600 ml-2">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (showFullPost && selectedPost) {
    const postComments = comments.get(selectedPost.id) || [];
    const userRating = userRatings.get(selectedPost.id) || 0;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Home Button */}
        <button
          className="fixed top-6 left-6 z-50 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-16 py-3 rounded-full font-bold text-[24px] shadow-xl transition-all duration-300"
          style={{
            minWidth: 0,
            boxShadow: "0 6px 32px 0 rgba(59, 130, 246, 0.18)",
          }}
          onClick={handleHomeExit}
        >
          <ChevronLeft className="w-8 h-8 mr-3 text-white" />
          Trang chủ
        </button>

        {/* Back Button */}
        <div className="bg-white border-b border-gray-200 pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => {
                setShowFullPost(false);
                setSelectedPost(null);
              }}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại danh sách bài viết
            </button>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Article Header */}
            <div className="relative h-64 md:h-80">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {categories.find(cat => cat.id === selectedPost.category)?.name}
                    </span>
                    <span className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(selectedPost.publishDate)}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {selectedPost.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Article Meta */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-700 font-medium">{selectedPost.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{selectedPost.readTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{selectedPost.views.toLocaleString()} lượt xem</span>
                  </div>
                </div>

                {/* Social Actions */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {renderStars(selectedPost.averageRating)}
                    <span className="text-sm text-gray-600">({selectedPost.totalRatings} đánh giá)</span>
                  </div>

                  <button
                    onClick={() => handleShare(selectedPost)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Chia sẻ</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Article Body */}
            <div className="p-6">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                style={{
                  lineHeight: '1.8',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Rating Section */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá bài viết</h3>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-gray-700">Đánh giá của bạn:</span>
                {renderStars(userRating, true, (rating) => handleRating(selectedPost.id, rating))}
              </div>

              {/* Add Comment */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Viết bình luận</h4>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Chia sẻ ý kiến của bạn về bài viết..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <button
                    onClick={() => handleAddComment(selectedPost.id)}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Gửi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-sm mt-8 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <MessageCircle className="h-6 w-6 mr-2" />
                Bình luận ({postComments.length})
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {postComments.map((comment) => (
                <div key={comment.id} className="p-6">
                  <div className="flex space-x-4">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                          {renderStars(comment.rating)}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{formatDate(comment.date)}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{comment.content}</p>

                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                          <Reply className="h-4 w-4" />
                          <span>Trả lời</span>
                        </button>
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                              <img
                                src={reply.avatar}
                                alt={reply.author}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h5 className="font-medium text-gray-900 text-sm">{reply.author}</h5>
                                  <span className="text-xs text-gray-500">{formatDate(reply.date)}</span>
                                </div>
                                <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
                                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors text-xs">
                                  <ThumbsUp className="h-3 w-3" />
                                  <span>{reply.likes}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {postComments.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến!</p>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Home Button */}
      <button
        className="fixed top-6 left-6 z-50 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-16 py-3 rounded-full font-bold text-[24px] shadow-xl transition-all duration-300"
        style={{
          minWidth: 0,
          boxShadow: "0 6px 32px 0 rgba(59, 130, 246, 0.18)",
        }}
        onClick={handleHomeExit}
      >
        <ChevronLeft className="w-8 h-8 mr-3 text-white" />
        Trang chủ
      </button>

      {/* Header */}
      <div className="bg-blue-600 text-white py-16 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog Sức Khỏe
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Khám phá những kiến thức hữu ích về sức khỏe sinh sản và chăm sóc bản thân
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className={`bg-white border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="latest">Mới nhất</option>
                  <option value="popular">Phổ biến</option>
                  <option value="highest-rated">Đánh giá cao</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Danh mục</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Popular Tags */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Thẻ phổ biến</h3>
                <div className="flex flex-wrap gap-2">
                  {['sức khỏe phụ nữ', 'phòng ngừa', 'dinh dưỡng', 'tư vấn', 'xét nghiệm'].map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(tag)}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Thống kê</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Tổng bài viết:</span>
                    <span className="font-medium text-blue-900">{blogPosts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Lượt xem:</span>
                    <span className="font-medium text-blue-900">
                      {blogPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Đánh giá TB:</span>
                    <span className="font-medium text-blue-900">
                      {(blogPosts.reduce((sum, post) => sum + post.averageRating, 0) / blogPosts.length).toFixed(1)}⭐
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            {filteredPosts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-md">
                <div className="relative h-64 md:h-80">
                  <img
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                    <div className="p-6 text-white">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Nổi bật
                        </span>
                        <span className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(filteredPosts[0].publishDate)}
                        </span>
                        <div className="flex items-center">
                          {renderStars(filteredPosts[0].averageRating)}
                        </div>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        {filteredPosts[0].title}
                      </h2>
                      <p className="text-gray-200 mb-4">
                        {filteredPosts[0].excerpt}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedPost(filteredPosts[0]);
                          setShowFullPost(true);
                        }}
                        className="inline-flex items-center bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Đọc tiếp
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.slice(1).map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {categories.find(cat => cat.id === post.category)?.name}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.publishDate)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setShowFullPost(true);
                        }}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Đọc tiếp
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {renderStars(post.averageRating)}
                          <span>({post.totalRatings})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* No Results */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy bài viết nào
                </h3>
                <p className="text-gray-600 mb-4">
                  Thử thay đổi từ khóa tìm kiếm hoặc danh mục để xem thêm bài viết
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xem tất cả bài viết
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;