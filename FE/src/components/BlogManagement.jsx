import React, { useState, useEffect, useRef, useCallback } from 'react';
import JoditEditor from 'jodit-react';

import {
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  Search,
  Filter,
  Calendar,
  User,
  Star,
  Copy,
  Archive,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Save,
  ExternalLink,
  Reply,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreHorizontal
} from 'lucide-react';

const BlogManagement = () => {
  // Ở đầu component
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState(''); //phần tạo
  const [editContent, setEditContent] = useState(''); //phần chỉnh sửa
  const [blogPosts, setBlogPosts] = useState([]);//lay bai viet
  const [categories, setCategories] = useState([]); // danh muc
  const [activeView, setActiveView] = useState('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [postComments, setPostComments] = useState([]);
  const [comments, setComments] = useState(new Map());
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Sức khỏe sinh sản',
    status: 'bản nháp',
    tags: '',
    seoTitle: '',
    seoDescription: ''
  });
  const [editPost, setEditPost] = useState(null);
  const [answerText, setAnswerText] = useState('');

  // const blogPosts = [
  //   {
  //     id: 1,
  //     title: 'Hiểu về chu kỳ kinh nguyệt: Hướng dẫn toàn diện',
  //     excerpt: 'Tìm hiểu về các giai đoạn của chu kỳ kinh nguyệt và cách theo dõi sức khỏe sinh sản...',
  //     content: 'Nội dung chi tiết về chu kỳ kinh nguyệt...',
  //     category: 'Sức khỏe sinh sản',
  //     author: 'BS. Nguyễn Thị Hoa',
  //     date: '2024-01-15',
  //     status: 'đã xuất bản',
  //     views: 1250,
  //     comments: 8,
  //     rating: 4.8,
  //     ratingCount: 156,
  //     tags: 'chu kỳ kinh nguyệt, sức khỏe phụ nữ, theo dõi',
  //     seoTitle: 'Chu kỳ kinh nguyệt - Hướng dẫn chi tiết cho phụ nữ',
  //     seoDescription: 'Hướng dẫn toàn diện về chu kỳ kinh nguyệt, cách theo dõi và duy trì sức khỏe sinh sản tốt nhất.'
  //   },
  //   {
  //     id: 2,
  //     title: 'Xét nghiệm STI: Khi nào cần làm và những điều cần biết',
  //     excerpt: 'Hướng dẫn về các loại xét nghiệm STI, thời điểm thích hợp và cách chuẩn bị...',
  //     content: 'Nội dung chi tiết về xét nghiệm STI...',
  //     category: 'Xét nghiệm STI',
  //     author: 'BS. Trần Văn Nam',
  //     date: '2024-01-12',
  //     status: 'đã xuất bản',
  //     views: 890,
  //     comments: 5,
  //     rating: 4.6,
  //     ratingCount: 89,
  //     tags: 'STI, xét nghiệm, sức khỏe tình dục',
  //     seoTitle: 'Xét nghiệm STI - Hướng dẫn đầy đủ và cần thiết',
  //     seoDescription: 'Tất cả thông tin về xét nghiệm STI: thời điểm, cách thức và ý nghĩa kết quả.'
  //   },
  //   {
  //     id: 3,
  //     title: 'Tư vấn sức khỏe tâm lý trong thai kỳ',
  //     excerpt: 'Những thay đổi tâm lý trong thai kỳ và cách quản lý stress hiệu quả...',
  //     content: 'Nội dung chi tiết về sức khỏe tâm lý thai kỳ...',
  //     category: 'Tư vấn sức khỏe',
  //     author: 'ThS. Lê Thị Mai',
  //     date: '2024-01-10',
  //     status: 'bản nháp',
  //     views: 0,
  //     comments: 0,
  //     rating: 0,
  //     ratingCount: 0,
  //     tags: 'thai kỳ, tâm lý, stress',
  //     seoTitle: 'Sức khỏe tâm lý thai kỳ - Hướng dẫn chuyên sâu',
  //     seoDescription: 'Cách quản lý sức khỏe tâm lý trong thai kỳ, giảm stress và duy trì tinh thần tích cực.'
  //   },
  //   {
  //     id: 4,
  //     title: 'Phòng ngừa nhiễm trùng đường sinh dục',
  //     excerpt: 'Các biện pháp phòng ngừa hiệu quả và dấu hiệu cần chú ý...',
  //     content: 'Nội dung chi tiết về phòng ngừa nhiễm trùng...',
  //     category: 'Sức khỏe sinh sản',
  //     author: 'BS. Phạm Văn Đức',
  //     date: '2024-01-08',
  //     status: 'đã lên lịch',
  //     views: 0,
  //     comments: 0,
  //     rating: 0,
  //     ratingCount: 0,
  //     tags: 'phòng ngừa, nhiễm trùng, vệ sinh',
  //     seoTitle: 'Phòng ngừa nhiễm trùng đường sinh dục hiệu quả',
  //     seoDescription: 'Hướng dẫn chi tiết các biện pháp phòng ngừa nhiễm trùng đường sinh dục.'
  //   }
  // ];

  // const comments = [
  //   {
  //     id: 1,
  //     postId: 1,
  //     postTitle: 'Hiểu về chu kỳ kinh nguyệt: Hướng dẫn toàn diện',
  //     author: 'Nguyễn Thị Lan',
  //     email: 'lan@example.com',
  //     content: 'Bài viết rất hữu ích! Tôi đã hiểu rõ hơn về chu kỳ của mình. Cảm ơn bác sĩ đã chia sẻ những thông tin chi tiết và dễ hiểu.',
  //     date: '2024-01-16T10:30:00',
  //     status: 'đã duyệt',
  //     likes: 12,
  //     dislikes: 0,
  //     isReported: false,
  //     replies: [
  //       {
  //         id: 101,
  //         author: 'BS. Nguyễn Thị Hoa',
  //         content: 'Cảm ơn bạn đã đọc bài viết! Nếu có thêm câu hỏi nào, đừng ngại liên hệ với chúng tôi.',
  //         date: '2024-01-16T14:20:00',
  //         isAuthor: true
  //       }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     postId: 1,
  //     postTitle: 'Hiểu về chu kỳ kinh nguyệt: Hướng dẫn toàn diện',
  //     author: 'Trần Thị Mai',
  //     email: 'mai@example.com',
  //     content: 'Tôi có chu kỳ không đều, thường từ 28-35 ngày. Điều này có bình thường không ạ? Tôi 25 tuổi và chưa có con.',
  //     date: '2024-01-15T16:45:00',
  //     status: 'chờ duyệt',
  //     likes: 3,
  //     dislikes: 0,
  //     isReported: false,
  //     replies: []
  //   },
  //   {
  //     id: 3,
  //     postId: 2,
  //     postTitle: 'Xét nghiệm STI: Khi nào cần làm và những điều cần biết',
  //     author: 'Lê Văn Nam',
  //     email: 'nam@example.com',
  //     content: 'Thông tin rất chi tiết và khoa học. Tôi muốn hỏi về chi phí xét nghiệm STI tại các bệnh viện công lập?',
  //     date: '2024-01-14T09:15:00',
  //     status: 'đã duyệt',
  //     likes: 8,
  //     dislikes: 1,
  //     isReported: false,
  //     replies: [
  //       {
  //         id: 102,
  //         author: 'BS. Trần Văn Nam',
  //         content: 'Chi phí xét nghiệm STI tại bệnh viện công lập thường dao động từ 200.000 - 500.000 VNĐ tùy theo gói xét nghiệm. Bạn có thể liên hệ trực tiếp với bệnh viện để biết thông tin cụ thể.',
  //         date: '2024-01-14T15:30:00',
  //         isAuthor: true
  //       }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     postId: 2,
  //     postTitle: 'Xét nghiệm STI: Khi nào cần làm và những điều cần biết',
  //     author: 'Phạm Thị Hương',
  //     email: 'huong@example.com',
  //     content: 'Bài viết hay nhưng tôi thấy thiếu thông tin về xét nghiệm HIV. Có thể bổ sung thêm không ạ?',
  //     date: '2024-01-13T20:10:00',
  //     status: 'đã duyệt',
  //     likes: 5,
  //     dislikes: 0,
  //     isReported: false,
  //     replies: []
  //   },
  //   {
  //     id: 5,
  //     postId: 1,
  //     postTitle: 'Hiểu về chu kỳ kinh nguyệt: Hướng dẫn toàn diện',
  //     author: 'Hoàng Thị Linh',
  //     email: 'linh@example.com',
  //     content: 'Spam content here - not relevant to the topic',
  //     date: '2024-01-12T11:20:00',
  //     status: 'bị báo cáo',
  //     likes: 0,
  //     dislikes: 8,
  //     isReported: true,
  //     replies: []
  //   }
  // ];

  const customerQuestions = [
    {
      id: 1,
      question: 'Chu kỳ kinh nguyệt không đều có nguy hiểm không?',
      customer: 'Nguyễn Thị Hoa',
      email: 'hoa@example.com',
      date: '2024-01-16',
      status: 'chờ xử lý',
      priority: 'cao',
      relatedPost: 'Hiểu về chu kỳ kinh nguyệt: Hướng dẫn toàn diện',
      relatedPostId: 1,
      category: 'Sức khỏe sinh sản',
      answer: ''
    },
    {
      id: 2,
      question: 'Khi nào nên làm xét nghiệm STI định kỳ?',
      customer: 'Trần Văn Nam',
      email: 'nam@example.com',
      date: '2024-01-15',
      status: 'đã trả lời',
      priority: 'trung bình',
      relatedPost: 'Xét nghiệm STI: Khi nào cần làm và những điều cần biết',
      relatedPostId: 2,
      category: 'Xét nghiệm STI',
      answer: 'Bạn nên làm xét nghiệm STI định kỳ 6 tháng một lần nếu có nhiều bạn tình, hoặc khi có triệu chứng bất thường...'
    },
    {
      id: 3,
      question: 'Làm thế nào để giảm lo âu trong thai kỳ?',
      customer: 'Lê Thị Mai',
      email: 'mai@example.com',
      date: '2024-01-14',
      status: 'chờ xử lý',
      priority: 'cao',
      relatedPost: null,
      relatedPostId: null,
      category: 'Tư vấn sức khỏe',
      answer: ''
    }
  ];


  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleViewRelatedArticle = (question) => {
    if (question.relatedPostId) {
      const relatedPost = blogPosts.find(post => post.id === question.relatedPostId);
      if (relatedPost) {
        setSelectedPost(relatedPost);
        setShowViewModal(true);
        showNotification(`Đang xem bài viết: ${relatedPost.title}`, 'success');
      } else {
        showNotification('Không tìm thấy bài viết liên quan', 'error');
      }
    }
  };

  const handleViewComments = (post) => {
    setSelectedPost(post);
    setShowCommentsModal(true);
  };

  const handleReplyToComment = (comment) => {
    setSelectedComment(comment);
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      showNotification("Vui lòng nhập nội dung phản hồi", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Bạn cần đăng nhập để phản hồi.", "error");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Gửi phản hồi lên server
      const response = await fetch(`/api/blogposts/${selectedPost.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          commentText: replyText,
          parentCommentId: selectedComment?.id, // 👈 ID của bình luận được phản hồi
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể gửi phản hồi.");
      }

      // 2. Gọi lại API để lấy danh sách bình luận mới
      const res = await fetch(`/api/blogposts/${selectedPost.id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Không thể tải lại bình luận.");

      const raw = await res.json();
      const mapped = raw.map((c) => ({
        id: c.commentId,
        content: c.commentText,
        author: c.commenterName,
        avatar: c.imageUrl,
        date: c.createdAt,
        parentCommentId: c.parentCommentId,
        isAuthor: c.author,
        replies: [],
        status: c.status || "đã duyệt",
        isReported: c.isReported || false,
        likes: c.likes || 0,
        dislikes: c.dislikes || 0,
      }));

      const grouped = groupComments(mapped);
      setPostComments(grouped); // 👈 nếu đang dùng postComments

      // 3. Reset UI sau khi gửi
      showNotification("Phản hồi đã được gửi thành công!");
      setShowReplyModal(false);
      setSelectedComment(null);
      setReplyText("");
    } catch (error) {
      showNotification("Có lỗi xảy ra khi gửi phản hồi: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };


  const handleApproveComment = async (commentId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Duyệt bình luận:', commentId);
      showNotification('Bình luận đã được duyệt!');
    } catch (error) {
      showNotification('Có lỗi xảy ra khi duyệt bình luận', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectComment = async (commentId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Từ chối bình luận:', commentId);
      showNotification('Bình luận đã bị từ chối!');
    } catch (error) {
      showNotification('Có lỗi xảy ra khi từ chối bình luận', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa bình luận này?");
    if (!confirm) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/blogposts/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể xóa bình luận");

      showNotification("Xóa bình luận thành công", "success");

      // ✅ GỌI LẠI API để cập nhật giao diện
      await reloadComments();
    } catch (err) {
      showNotification("Lỗi khi xóa: " + err.message, "error");
    }
  };


  //-----------------------------------------------Comment----------------------------
  const groupComments = (data) => {
    const map = new Map();
    const roots = [];

    data.forEach((c) => {
      c.replies = [];
      map.set(c.id, c);
    });

    data.forEach((c) => {
      if (c.parentCommentId) {
        const parent = map.get(c.parentCommentId);
        if (parent) {
          parent.replies.push(c);
        }
      } else {
        roots.push(c);
      }
    });

    return roots;
  };



  const getCommentsForPost = useCallback(async (postId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/blogposts/${postId}/comments`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error("Không thể tải bình luận");

    const raw = await res.json();

    const mapped = raw.map((c) => ({
      id: c.commentId,
      content: c.commentText,
      author: c.commenterName,
      avatar: c.imageUrl,
      date: c.createdAt,
      parentCommentId: c.parentCommentId,
      isAuthor: c.author,
      replies: [],
      status: c.status || "đã duyệt",
      isReported: c.isReported || false,
      likes: c.likes || 0,
      dislikes: c.dislikes || 0,
    }));

    return groupComments(mapped);
  }, []);

  useEffect(() => {
    if (!showCommentsModal || !selectedPost) return;

    getCommentsForPost(selectedPost.id)
      .then(setPostComments)
      .catch(() => setPostComments([]));
  }, [showCommentsModal, selectedPost, getCommentsForPost]);

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    // Kiểm tra nếu là hôm qua
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) return 'Hôm qua';

    return date.toLocaleDateString('vi-VN');
  };

  //api dùng để gọi lại blogcomment
  const reloadComments = async () => {
    const token = localStorage.getItem("token");
    if (!selectedPost || !token) return;

    try {
      const res = await fetch(`/api/blogposts/${selectedPost.id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Không thể tải lại bình luận");

      const raw = await res.json();
      console.log("🔄 comments Map:", comments);
      console.log("✅ postComments state:", postComments);
      console.log("📌 selectedPost.id:", selectedPost?.id);


      const mapped = raw.map((c) => ({
        id: c.commentId,
        content: c.commentText,
        author: c.commenterName,
        avatar: c.imageUrl,
        date: c.createdAt,
        parentCommentId: c.parentCommentId,
        isAuthor: c.author,
        replies: [],
        status: c.status || "đã duyệt",
        isReported: c.isReported || false,
        likes: c.likes || 0,
        dislikes: c.dislikes || 0,
      }));

      const grouped = groupComments(mapped);
      setPostComments(grouped);


    } catch (err) {
      showNotification("Lỗi khi tải lại bình luận", "error");
    }
  };


  //api tạo
  const handleCreatePost = async () => {
    if (!newPost.title || !editorContent) {
      showNotification('Vui lòng điền đầy đủ tiêu đề và nội dung', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/blogposts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title: newPost.title,
          content: editorContent, // ✅ lấy từ state riêng
          excerpt: newPost.excerpt,
          imageUrl: newPost.imageUrl,
          status: newPost.status,
          categoryId: newPost.categoryId,
          publishTime: newPost.status === 'đã lên lịch' ? newPost.publishTime : null
        })
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Tạo bài viết thành công!');
        console.log('Bài viết mới:', data);

        await fetchBlogPosts();

        setShowCreateModal(false);
        setNewPost({
          title: '',
          content: '', // không cần nữa nếu không dùng
          excerpt: '',
          imageUrl: '',
          categoryId: '',
          status: 'bản nháp',
          publishTime: null
        });
        setEditorContent(''); // ✅ reset editor sau khi tạo
      } else {
        showNotification(data.message || 'Lỗi tạo bài viết', 'error');
      }
    } catch (error) {
      showNotification('Đã xảy ra lỗi kết nối', 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    console.log("🔄 Đang gọi API bài viết...");

    try {
      const response = await fetch('http://localhost:8080/api/blogposts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setBlogPosts(data); // Cập nhật danh sách blog
      } else {
        console.error("Lỗi lấy bài viết:", data.message || data);
      }
    } catch (error) {
      console.error("Lỗi khi kết nối API bài viết:", error);
    }
  };

  useEffect(() => {
    fetchBlogPosts(); // ✅ Gọi ngay khi component render lần đầu

    const interval = setInterval(() => {
      fetchBlogPosts(); // 🔁 Gọi mỗi phút
    }, 30000);

    return () => clearInterval(interval); //  Dọn dẹp khi component bị unmount
  }, []);

  useEffect(() => {
    if (showEditModal && editPost?.content) {
      setEditContent(editPost.content);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.setEditorValue(editPost.content);
        }
      }, 300);
    }
  }, [showEditModal, editPost]);





  //API CẬP NHẬT BLOG
  const handleEditPost = async () => {
    if (!editPost.title || !editPost.content) {
      showNotification('Vui lòng điền đầy đủ tiêu đề và nội dung', 'error');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/blogposts/${editPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title: editPost.title,
          content: editContent,
          excerpt: editPost.excerpt,
          imageUrl: editPost.imageUrl,
          status: editPost.status, // 🟢 KHÔNG cần map nữa nếu đã là "PUBLISHED"
          categoryId: editPost.categoryId,
          publishTime: editPost.status === 'Đã lên lịch' ? editPost.publishTime : null
        })
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Bài viết đã được cập nhật thành công!');
        console.log('Cập nhật thành công:', data);

        await fetchBlogPosts(); // Gọi lại danh sách bài viết
        setShowEditModal(false);
        setEditPost(null);
      } else {
        showNotification(data.message || 'Lỗi cập nhật bài viết', 'error');
      }
    } catch (error) {
      showNotification('Có lỗi xảy ra khi cập nhật bài viết', 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeletePost = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Xóa bài viết:', selectedPost.id);
      showNotification('Bài viết đã được xóa thành công!');
      setShowDeleteModal(false);
      setSelectedPost(null);
    } catch (error) {
      showNotification('Có lỗi xảy ra khi xóa bài viết', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicatePost = (post) => {
    const duplicatedPost = {
      ...post,
      title: `${post.title} (Bản sao)`,
      status: 'bản nháp',
      id: Date.now()
    };
    console.log('Nhân bản bài viết:', duplicatedPost);
    showNotification('Bài viết đã được nhân bản thành công!');
  };

  const handleArchivePost = (post) => {
    console.log('Lưu trữ bài viết:', post.id);
    showNotification('Bài viết đã được lưu trữ!');
  };

  const handlePublishPost = (post) => {
    console.log('Xuất bản bài viết:', post.id);
    showNotification('Bài viết đã được xuất bản!');
  };

  const handleAnswerQuestion = async () => {
    if (!answerText.trim()) {
      showNotification('Vui lòng nhập câu trả lời', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Trả lời câu hỏi:', selectedQuestion.id, answerText);
      showNotification('Câu trả lời đã được gửi thành công!');
      setShowAnswerModal(false);
      setSelectedQuestion(null);
      setAnswerText('');
    } catch (error) {
      showNotification('Có lỗi xảy ra khi gửi câu trả lời', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  //lọc
  const getCategoryNameById = (id) => {
    const category = categories.find(c => c.id === Number(id));
    return category?.name;
  };


  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;

    const matchesCategory =
      filterCategory === 'all' || post.categoryName === getCategoryNameById(filterCategory);

    return matchesSearch && matchesStatus && matchesCategory;
  });




  const filteredQuestions = customerQuestions.filter(question =>
    question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStarRating = (rating, ratingCount, size = 'sm') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className={`${starSize} fill-yellow-400 text-yellow-400`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className={`${starSize} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className={`${starSize} text-gray-300`} />
        );
      }
    }

    return (
      <div className="flex items-center space-x-1">
        <div className="flex items-center">
          {stars}
        </div>
        <span className="text-sm text-gray-600">
          {rating > 0 ? `${rating} (${ratingCount} đánh giá)` : 'Chưa có đánh giá'}
        </span>
      </div>
    );
  };

  //hàm xử lý đâng ảnh của tư vấn viên
  const handleImageUpload = async (e, setState) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8080/api/uploads/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setState((prev) => ({ ...prev, imageUrl: data.url }));
        showNotification("Ảnh đã được tải lên thành công!");
      } else {
        showNotification("Lỗi upload ảnh: " + (data.error || "Không xác định"), "error");
      }
    } catch (err) {
      showNotification("Lỗi khi upload ảnh", "error");
      console.error(err);
    }
  };


  //like va dislike
  const handleLike = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Vui lòng đăng nhập để like bình luận", "error");
      return;
    }

    try {
      const res = await fetch(`/api/blogposts/${commentId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể like");

      await reloadComments(); // gọi lại danh sách bình luận
    } catch (err) {
      showNotification("Lỗi khi like: " + err.message, "error");
    }
  };

  const handleDislike = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Vui lòng đăng nhập để dislike", "error");
      return;
    }

    try {
      const res = await fetch(`/api/blogposts/${commentId}/dislike`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể dislike");

      await reloadComments();
    } catch (err) {
      showNotification("Lỗi khi dislike: " + err.message, "error");
    }
  };


  //api lay danh sach danh muc category
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8080/api/blogposts/category", {
          headers: {
            "Authorization": `Bearer ${token}`, // nếu có JWT
          }
        });
        const data = await res.json();
        setCategories(data);

        // Gán mặc định categoryId nếu chưa có
        if (data.length > 0) {
          setNewPost(prev => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (error) {
        showNotification("Không thể tải danh mục", "error");
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const countAllComments = (comments) => {
    let count = 0;
    const stack = [...comments];
    while (stack.length) {
      const c = stack.pop();
      count++;
      if (c.replies) stack.push(...c.replies);
    }
    return count;
  };


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Blog Y tế</h1>
          <p className="text-gray-600">Tạo nội dung sức khỏe và tương tác với bệnh nhân</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tạo bài viết mới
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveView('posts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeView === 'posts'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Bài viết Blog
          </button>
          <button
            onClick={() => setActiveView('questions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeView === 'questions'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Câu hỏi bệnh nhân ({customerQuestions.filter(q => q.status === 'chờ xử lý').length})
          </button>
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={activeView === 'posts' ? 'Tìm kiếm bài viết...' : 'Tìm kiếm câu hỏi...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {activeView === 'posts' && (
          <>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Bản nháp">Bản nháp</option>
              <option value="Đã xuất bản">Đã xuất bản</option>
              <option value="Đã lên lịch">Đã lên lịch</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

          </>
        )}
      </div>

      {/* Content */}
      {activeView === 'posts' ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${post.status === 'đã xuất bản' ? 'bg-green-100 text-green-800' :
                      post.status === 'đã lên lịch' ? 'bg-blue-100 text-blue-800' :
                        post.status === 'đã lưu trữ' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {post.status}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {post.categoryName}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>

                  <div className="flex items-center text-sm text-gray-500 space-x-6 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Tác giả: {post.consultantName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {post.status === 'Đã lên lịch' && post.publishTime && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Xuất bản lúc: {new Date(post.publishTime).toLocaleString('vi-VN')}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views} lượt xem</span>
                    </div>
                    <button
                      onClick={() => handleViewComments(post)}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{countAllComments(postComments)} bình luận</span>
                    </button>
                  </div>

                  {/* Star Rating */}
                  <div className="mb-3">
                    {renderStarRating(post.rating, post.ratingCount)}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      setShowViewModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditPost({ ...post });
                      setShowEditModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDuplicatePost(post)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Nhân bản"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  {post.status === 'bản nháp' && (
                    <button
                      onClick={() => handlePublishPost(post)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xuất bản"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  )}
                  {post.status === 'đã xuất bản' && (
                    <button
                      onClick={() => handleArchivePost(post)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Lưu trữ"
                    >
                      <Archive className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${question.status === 'đã trả lời' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                      {question.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${question.priority === 'cao' ? 'bg-red-100 text-red-800' :
                      question.priority === 'trung bình' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {question.priority}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {question.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.question}</h3>

                  <div className="flex items-center text-sm text-gray-500 space-x-6 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{question.customer}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(question.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  {question.relatedPost && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Liên quan đến:</p>
                      <button
                        onClick={() => handleViewRelatedArticle(question)}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors group"
                      >
                        <span>{question.relatedPost}</span>
                        <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  )}

                  {question.answer && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-700"><strong>Câu trả lời:</strong> {question.answer}</p>
                    </div>
                  )}
                </div>

                {question.status === 'chờ xử lý' && (
                  <button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setShowAnswerModal(true);
                    }}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Trả lời
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments Modal */}
      {showCommentsModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Bình luận bài viết</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedPost.title}</p>
                </div>
                <button
                  onClick={() => setShowCommentsModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {postComments.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {comment.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{comment.author}</h4>
                          <p className="text-sm text-gray-500">{formatCommentDate(comment.date)}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${comment.status === 'đã duyệt' ? 'bg-green-100 text-green-800' :
                          comment.status === 'chờ duyệt' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {comment.status}
                        </span>
                        {comment.isReported && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            <Flag className="w-3 h-3 inline mr-1" />
                            Bị báo cáo
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {comment.status === 'chờ duyệt' && (
                          <>
                            <button
                              onClick={() => handleApproveComment(comment.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Duyệt bình luận"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectComment(comment.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Từ chối bình luận"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleReplyToComment(comment)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Phản hồi"
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa bình luận"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{comment.content}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <div className='mr-5'>
                        <button
                          onClick={() => handleLike(comment.id)}
                          className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                          title="Thích bình luận"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                      <button
                        onClick={() => handleDislike(comment.id)}
                        className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                        title="Không thích"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{comment.dislikes}</span>
                      </button>
                    </div>


                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-6 border-l-2 border-gray-200">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="mb-3 last:mb-0">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-xs">
                                  {reply.author.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h5 className="font-medium text-gray-900 text-sm">{reply.author}</h5>
                                  {reply.isAuthor && (
                                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                                      Tác giả
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {formatCommentDate(reply.date)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{reply.content}</p>

                                <div className="flex items-center space-x-8 text-sm text-gray-500 mt-1">
                                  <div className='mr-5'>
                                    <button
                                      onClick={() => handleLike(reply.id)}
                                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                                      title="Thích phản hồi"
                                    >
                                      <ThumbsUp className="w-4 h-4" />
                                      <span>{reply.likes}</span>
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleDislike(reply.id)}
                                    className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                                    title="Không thích"
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                    <span>{reply.dislikes}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {postComments.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Chưa có bình luận nào cho bài viết này</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
      }

      {/* Reply to Comment Modal */}
      {
        showReplyModal && selectedComment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Phản hồi bình luận</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {selectedComment.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{selectedComment.author}</h4>
                      <p className="text-xs text-gray-500">{formatCommentDate(selectedComment.date)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{selectedComment.content}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phản hồi của bạn *</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập phản hồi chuyên nghiệp và hữu ích..."
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Lưu ý quan trọng</p>
                      <p className="text-sm text-blue-700">
                        Phản hồi của bạn sẽ được hiển thị công khai. Vui lòng đảm bảo thông tin chính xác và phù hợp với đạo đức y khoa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang gửi...</span>
                    </div>
                  ) : (
                    'Gửi phản hồi'
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Create Post Modal */}
      {
        showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Tạo bài viết Blog mới</h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tiêu đề bài viết..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                    <select
                      value={newPost.categoryId}
                      onChange={(e) => setNewPost({ ...newPost, categoryId: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt</label>
                  <textarea
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tóm tắt ngắn gọn về bài viết..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung *</label>
                  <JoditEditor
                    ref={editorRef}
                    defaultValue=""
                    config={{
                      readonly: false,
                      height: 400,
                      placeholder: 'Nhập nội dung bài viết...',
                    }}
                    onBlur={(newContent) => setEditorContent(newContent)} // chỉ lưu khi rời khỏi editor
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                  <div className="flex items-center space-x-4">
                    {newPost.imageUrl ? (
                      <div className="mt-2 p-2 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                        <img
                          src={`http://localhost:8080${newPost.imageUrl}`}
                          alt="Ảnh minh họa"
                          className="h-48 w-full object-cover rounded-md shadow-md"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400 text-sm">
                        Chưa có ảnh
                      </div>
                    )}

                    <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-medium rounded-lg shadow hover:from-blue-600 hover:to-teal-600 transition-all duration-200">
                      Chọn ảnh
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setNewPost)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <select
                    value={newPost.status}
                    onChange={(e) => setNewPost({
                      ...newPost,
                      status: e.target.value,
                      publishTime: e.target.value === 'đã lên lịch' ? newPost.publishTime : null // reset nếu không phải lên lịch
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bản nháp">Bản nháp</option>
                    <option value="đã xuất bản">Xuất bản ngay</option>
                    <option value="đã lên lịch">Lên lịch xuất bản</option>
                  </select>
                </div>

                {newPost.status === 'đã lên lịch' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian xuất bản</label>
                    <input
                      type="datetime-local"
                      value={newPost.publishTime || ''}
                      onChange={(e) =>
                        setNewPost({ ...newPost, publishTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
                {/* </div> */}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang tạo...</span>
                    </div>
                  ) : (
                    'Tạo bài viết'
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Edit Post Modal */}
      {
        showEditModal && editPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Chỉnh sửa bài viết</h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                    <input
                      type="text"
                      value={editPost.title}
                      onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                    <select
                      value={editPost.categoryId ?? ""}
                      onChange={(e) =>
                        setEditPost({ ...editPost, categoryId: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                    >
                      <option value="" disabled>-- Chọn danh mục --</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>

                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt</label>
                  <textarea
                    value={editPost.excerpt}
                    onChange={(e) => setEditPost({ ...editPost, excerpt: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <JoditEditor
                  ref={editorRef}
                  value={editContent} // ✅ Rất quan trọng!
                  config={{
                    readonly: false,
                    height: 400,
                    placeholder: 'Chỉnh sửa nội dung bài viết...',
                  }}
                  onBlur={(newContent) => setEditContent(newContent)}
                />



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                  <div className="flex items-center space-x-4">
                    {editPost.imageUrl ? (
                      <div className="mt-2 p-2 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                        <img
                          src={`http://localhost:8080${editPost.imageUrl}`}
                          alt="Ảnh minh họa"
                          className="h-48 w-full object-cover rounded-md shadow-md"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400 text-sm">
                        Chưa có ảnh
                      </div>
                    )}

                    <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-medium rounded-lg shadow hover:from-blue-600 hover:to-teal-600 transition-all duration-200">
                      Chọn ảnh
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setEditPost)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <select
                    value={editPost.status}
                    onChange={(e) => setEditPost({ ...editPost, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Bản nháp">Bản nháp</option>
                    <option value="Đã xuất bản">Xuất bản ngay</option>
                    <option value="Đã lên lịch">Lên lịch xuất bản</option>
                  </select>
                </div>

                {editPost.status === 'Đã lên lịch' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian xuất bản</label>
                    <input
                      type="datetime-local"
                      value={editPost.publishTime || ''}
                      onChange={(e) =>
                        setEditPost({ ...editPost, publishTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleEditPost}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang cập nhật...</span>
                    </div>
                  ) : (
                    'Cập nhật'
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* View Post Modal */}

      {
        showViewModal && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Chi tiết bài viết</h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>

                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${selectedPost.status === 'đã xuất bản' ? 'bg-green-100 text-green-800' :
                      selectedPost.status === 'đã lên lịch' ? 'bg-blue-100 text-blue-800' :
                        selectedPost.status === 'đã lưu trữ' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {selectedPost.status}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                      {selectedPost.categoryName}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 space-x-6 mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Tác giả: {selectedPost.consultantName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedPost.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {selectedPost.status === 'Đã lên lịch' && selectedPost.publishTime && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Xuất bản lúc: {new Date(selectedPost.publishTime).toLocaleString('vi-VN')}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{selectedPost.views} lượt xem</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{countAllComments(postComments)} bình luận</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    {renderStarRating(selectedPost.rating, selectedPost.ratingCount, 'md')}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tóm tắt</h3>
                  <p className="text-gray-600 mb-4">{selectedPost.excerpt}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nội dung</h3>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: selectedPost.content
                    }}
                  />
                </div>


                {selectedPost.tags && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.split(',').map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedPost.seoTitle || selectedPost.seoDescription) && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO Information</h3>
                    {selectedPost.seoTitle && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">SEO Title:</p>
                        <p className="text-sm text-gray-600">{selectedPost.seoTitle}</p>
                      </div>
                    )}
                    {selectedPost.seoDescription && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">SEO Description:</p>
                        <p className="text-sm text-gray-600">{selectedPost.seoDescription}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* Delete Confirmation Modal */}
      {
        showDeleteModal && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
                    <p className="text-sm text-gray-600">Hành động này không thể hoàn tác</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  Bạn có chắc chắn muốn xóa bài viết "<strong>{selectedPost.title}</strong>"?
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isLoading}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleDeletePost}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xóa...</span>
                      </div>
                    ) : (
                      'Xóa bài viết'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Answer Question Modal */}
      {
        showAnswerModal && selectedQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Trả lời câu hỏi</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Câu hỏi từ {selectedQuestion.customer}:</h3>
                  <p className="text-gray-700">{selectedQuestion.question}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Câu trả lời của bạn *</label>
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows="8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập câu trả lời chuyên nghiệp và chi tiết..."
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Lưu ý quan trọng</p>
                      <p className="text-sm text-blue-700">
                        Đây là tư vấn y tế. Vui lòng đảm bảo thông tin chính xác và khuyến nghị bệnh nhân đến gặp bác sĩ trực tiếp khi cần thiết.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAnswerModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleAnswerQuestion}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang gửi...</span>
                    </div>
                  ) : (
                    'Gửi câu trả lời'
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default BlogManagement;