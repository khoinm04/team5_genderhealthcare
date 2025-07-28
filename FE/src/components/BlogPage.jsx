import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

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
  Reply,
  ThumbsDown
} from 'lucide-react';
import { useBlogUpdatesSocket } from "../hooks/useBlogUpdatesSocket"; // hoặc đúng path bạn đặt
import { toast } from "react-toastify";


const BlogPage = () => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showFullPost, setShowFullPost] = useState(false);
  const [userRatings, setUserRatings] = useState(new Map());
  const [sortBy, setSortBy] = useState('latest');
  const [isScrolled, setIsScrolled] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(new Map());
  const [replyingTo, setReplyingTo] = useState(null); // commentId đang được trả lời
  const [replyText, setReplyText] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 5,
    totalPages: 0
  })



  //thống kê lượt xem và tổng bài viết
  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).token : null;

    if (!token) {
      console.warn("Chưa có token, không gọi API thống kê");
      return;
    }

    fetch("/api/blogposts/posts/statistics", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setTotalPosts(data.totalPosts);
        setTotalViews(data.totalViews);
        setAverageRating(data.averageRating);
      })
      .catch(err => {
        console.error("Lỗi khi gọi API thống kê:", err);
      });
  }, []);


  //api lay danh gia nguoi dung
  useEffect(() => {
    if (!selectedPost) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`/api/blogposts/${selectedPost.id}/my-rating`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi lấy đánh giá");
        return res.json();
      })
      .then((rating) => {
        setUserRatings((prev) => {
          const updated = new Map(prev);
          updated.set(selectedPost.id, rating);
          console.log("✅ Đánh giá đã lấy về:", rating);
          return updated;
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi lấy đánh giá của bạn:", err);
      });
  }, [selectedPost]);

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
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const groupComments = (data) => {
    const map = new Map();
    const roots = [];

    data.forEach((c) => {
      c.replies = [];
      map.set(c.commentId, c);
    });

    data.forEach((c) => {
      if (c.parentCommentId) {
        const parent = map.get(c.parentCommentId);
        if (parent) parent.replies.push(c);
      } else {
        roots.push(c);
      }
    });

    return roots;
  };


  useBlogUpdatesSocket((newBlogPost) => {
    console.log("🟢 Received blog post:", newBlogPost); // ← debug line

    setBlogPosts((prev) => {
      const exists = prev.some(post => post.id === newBlogPost.id);
      if (exists) return prev;
      return [newBlogPost, ...prev];
    });

    toast.success("🎉 Bài viết mới vừa được xuất bản!");
  });





  // api lay blog 
  const fetchPublishedBlogs = async (page = 0, size = 5) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8080/api/blogposts/public?page=${page}&size=${size}&sort=createdAt,desc`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setBlogPosts(data.content);             // ✅ bài viết
        setPageInfo({
          page: data.number,
          size: data.size,
          totalPages: data.totalPages,
          totalElements: data.totalElements
        });                                      // ✅ thông tin phân trang
      } else {
        console.error("Lỗi khi lấy bài viết:", data.message);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
    }
  };

  // Tải lần đầu
  useEffect(() => {
    fetchPublishedBlogs(pageInfo.page, pageInfo.size);
  }, [pageInfo.page, pageInfo.size]);




  const handlePrevious = () => {
    if (pageInfo.page > 0) {
      fetchPublishedBlogs(pageInfo.page - 1, pageInfo.size);
    }
  };

  const handleNext = () => {
    if (pageInfo.page + 1 < pageInfo.totalPages) {
      fetchPublishedBlogs(pageInfo.page + 1, pageInfo.size);
    }
  };


  // api lay cate
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token"); // hoặc từ sessionStorage
        const res = await fetch("http://localhost:8080/api/blogposts/category", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok) {
          const allCategory = {
            id: 'all',
            name: 'Tất cả',
            count: blogPosts.length
          };

          const categoriesWithCount = data.map((cat) => ({
            id: cat.id,
            name: cat.name,
            count: blogPosts.filter(post => post.categoryId === cat.id).length
          }));

          setCategories([allCategory, ...categoriesWithCount]);
        } else {
          console.error("Lỗi khi lấy danh mục:", data.message);
        }
      } catch (err) {
        console.error("Lỗi kết nối tới API danh mục:", err);
      }
    };

    fetchCategories();
  }, [blogPosts]);

  useEffect(() => {
    fetchPublishedBlogs(pageInfo.page, pageInfo.size);
  }, [pageInfo.page, pageInfo.size]);



  useEffect(() => {
    const interval = setInterval(() => {
      fetchPublishedBlogs(pageInfo.page, pageInfo.size); // ✅ dùng page hiện tại
    }, 60000);

    return () => clearInterval(interval);
  }, [pageInfo.page, pageInfo.size]); // ✅ thêm dependency


  //api rep comment
  const handleSendReply = async (parentCommentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để trả lời.");
      return;
    }

    try {
      const response = await fetch(`/api/blogposts/${selectedPost.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          commentText: replyText,
          parentCommentId: parentCommentId, // 👈 truyền ID bình luận cha
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể gửi phản hồi.");
      }

      // Reset UI sau khi gửi
      setReplyText("");
      setReplyingTo(null);

      // Gọi lại API để cập nhật danh sách bình luận
      const res = await fetch(`/api/blogposts/${selectedPost.id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const grouped = groupComments(data); // ✅ nhóm comment thành dạng cây

      setComments((prev) => new Map(prev.set(selectedPost.id, grouped)));
    } catch (err) {
      alert("Lỗi khi gửi phản hồi: " + err.message);
    }
  };


  //---dislike like
  const reloadComments = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/blogposts/${selectedPost.id}/comments`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    const grouped = groupComments(data);
    setPostComments(grouped);
  };

  const handleLike = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Nội dung thông báo");
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
      alert("Vui lòng đăng nhập để like bình luận");
    }
  };

  const handleDislike = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Nội dung thông báo");
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
      alert("Vui lòng đăng nhập để like bình luận");
    }
  };


  // Filter and sort posts
  const filteredPosts = blogPosts
    .filter(post => {
      const matchesCategory =
        selectedCategory === 'all' || post.categoryId === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'popular':
          return b.views - a.views;
        case 'highest-rated':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  //XU LY DANH GIA
  const handleRating = async (postId, rating) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để đánh giá.");
      return;
    }

    try {
      const response = await fetch("/api/blogposts/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          blogPostId: postId,
          rating: rating,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Đánh giá thất bại.");
      }

      // ✅ Cập nhật rating của người dùng
      setUserRatings((prev) => {
        const updated = new Map(prev);
        updated.set(postId, rating);
        return updated;
      });

      // ✅ GỌI LẠI API lấy thông tin bài viết mới nhất (để cập nhật rating trung bình và lượt đánh giá)

      const postRes = await fetch(`/api/blogposts/public/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!postRes.ok) throw new Error("Không thể lấy lại thông tin bài viết.");

      const updatedPost = await postRes.json();
      setSelectedPost(updatedPost); // ⬅️ cập nhật UI

      alert("🎉 Đánh giá thành công!");
    } catch (error) {
      alert("❌ Lỗi: " + error.message);
    }
  };


  useEffect(() => {
    console.log("📌 userRatings thay đổi:", userRatings);
  }, [userRatings]);


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


  //api lay binh luan
  useEffect(() => {
    if (!selectedPost) return;

    const token = localStorage.getItem("token");

    fetch(`/api/blogposts/${selectedPost.id}/comments`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        const grouped = groupComments(data); // 👈 phân nhóm cha – con
        setComments((prev) => new Map(prev.set(selectedPost.id, grouped)));
      });
  }, [selectedPost]);

  //api them binh luan
  const handleAddComment = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }

    try {
      // 🟢 Gửi bình luận
      const response = await fetch(`/api/blogposts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ commentText: newComment }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể thêm bình luận.");
      }

      setNewComment(""); // ✅ Xoá nội dung sau khi gửi

      // 🟢 Lấy lại bình luận mới nhất
      const updated = await fetch(`/api/blogposts/${postId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const comments = await updated.json();
      const grouped = groupComments(comments); // 👈 thêm bước nhóm replies

      // 🟢 Cập nhật lại Map
      setComments((prev) => new Map(prev.set(postId, grouped)));
    } catch (err) {
      alert("Lỗi khi gửi bình luận: " + err.message);
    }
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating, count = 0, interactive = false, onRate = null) => {
    const safeRating = typeof rating === 'number' ? rating : 0;
    const safeCount = typeof count === 'number' ? count : 0;

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = safeRating >= star;
          const isHalf = safeRating >= star - 0.5 && safeRating < star;

          return (
            <button
              key={star}
              onClick={() => interactive && onRate && onRate(star)}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
              disabled={!interactive}
              style={{ position: 'relative', width: 20, height: 20 }}
            >
              {isFull ? (
                <FaStar className="text-yellow-400 w-full h-full" />
              ) : isHalf ? (
                <>
                  <FaRegStar className="text-gray-300 absolute inset-0 w-full h-full" />
                  <FaStarHalfAlt className="text-yellow-400 absolute inset-0 w-full h-full" />
                </>
              ) : (
                <FaRegStar className="text-gray-300 w-full h-full" />
              )}
            </button>
          );
        })}
        <span className="text-sm text-gray-600 ml-2">
          {safeRating.toFixed(1)} ({safeCount} lượt đánh giá)
        </span>
      </div>
    );
  };
  //lấy đánh giá người dùng hiện tại
  const currentUserRating = userRatings.get(selectedPost?.id) || 0;


  if (showFullPost && selectedPost) {
    const postComments = comments.get(selectedPost.id) || [];
    const userRating = userRatings.get(selectedPost.id) || 0;

    return (
      <div className="min-h-screen bg-gray-50">
       

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
            <div className="relative h-[400px] md:h-[500px] bg-black rounded-t-lg overflow-hidden">
              <img
                src={`http://localhost:8080${selectedPost.imageUrl}`}
                alt={selectedPost.title}
                className="w-full h-full object-cover object-top"
              />


              {/* Gradient overlay chỉ nằm dưới */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                <div className="p-6 text-white">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {categories.find(cat => cat.id === selectedPost.category)?.name}
                    </span>
                    <span className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(selectedPost.createdAt)}
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
                    <span className="text-gray-700 font-medium">Tác giả: {selectedPost.consultantName}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{selectedPost.readTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {(selectedPost.views || 0).toLocaleString()} lượt xem
                    </span>
                  </div>
                </div>

                {/* Social Actions */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {renderStars(
                      selectedPost.rating,
                      selectedPost.ratingCount // 👈 thêm lượt đánh giá ở đây
                    )}
                    <span className="text-gray-600">
                      {(selectedPost.views || 0).toLocaleString()} lượt xem
                    </span>
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
            </div>

            {/* Article Body */}
            {selectedPost.content && (
              <div
                className="prose prose-lg max-w-none px-4
                  [&_img]:max-w-full
                  [&_img]:h-auto
                  [&_img]:opacity-100
                  [&_img]:filter-none
                  [&_img]:bg-transparent"
                dangerouslySetInnerHTML={{
                  __html: selectedPost.content
                    .replace(/\n/g, '<br />')
                    .replace(/src=["'](?:\/)?uploads/g, 'src="http://localhost:8080/uploads')

                }}
                style={{
                  lineHeight: '1.8',
                  fontSize: '16px'
                }}
              />
            )}

            {/* Rating Section */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá bài viết</h3>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-gray-700">Đánh giá của bạn:</span>
                {renderStars(
                  currentUserRating,                      // ✅ lấy từ Map
                  selectedPost.ratingCount || 0,          // 👥 số lượt đánh giá
                  true,                                   // ✅ có thể click
                  (rating) => handleRating(selectedPost.id, rating) // ⭐ callback khi click
                )}
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
                <div key={comment.commentId} className="p-6">
                  {/* Hiển thị comment cha */}
                  <div className="flex space-x-4">
                    <img
                      src={comment.imageUrl}
                      alt={comment.commenterName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-gray-900">{comment.commenterName}</h4>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{formatCommentDate(comment.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{comment.commentText}</p>

                      {/* Nút Trả lời */}
                      <button
                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                        onClick={() => setReplyingTo(comment.commentId)}
                      >
                        <Reply className="h-4 w-4" />
                        <span>Trả lời</span>
                      </button>

                      {/* Form trả lời nếu đang reply */}
                      {replyingTo === comment.commentId && (
                        <div className="mt-4 ml-12">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Nhập phản hồi..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                            >
                              Huỷ
                            </button>
                            <button
                              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              onClick={() => handleSendReply(comment.commentId)}
                              disabled={!replyText.trim()}
                            >
                              Gửi
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Hiển thị các reply con */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.commentId} className="flex space-x-3">
                              <img
                                src={reply.imageUrl}
                                alt={reply.commenterName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h5 className="font-medium text-gray-900 text-sm">
                                    {reply.commenterName}
                                    {reply.author && (
                                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                        Tác giả
                                      </span>
                                    )}
                                  </h5>
                                  <span className="text-xs text-gray-500">{formatCommentDate(reply.createdAt)}</span>
                                </div>
                                <p className="text-gray-700 text-sm mb-2">{reply.commentText}</p>
                                {/* ... nút like nếu có */}
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div
                                    onClick={() => handleLike(reply.commentId)}
                                    className="flex items-center space-x-1 cursor-pointer hover:text-green-600"
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>{reply.likes}</span>
                                  </div>
                                  <div
                                    onClick={() => handleDislike(reply.commentId)}
                                    className="flex items-center space-x-1 cursor-pointer hover:text-red-600"
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                    <span>{reply.dislikes}</span>
                                  </div>
                                </div>

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

  // dem so luot xem
  const handleOpenPost = (post) => {
    const token = localStorage.getItem("token");

    // Cập nhật ngay UI
    setSelectedPost({ ...post, views: (post.views || 0) + 1 });
    setShowFullPost(true);

    fetch(`/api/blogposts/${post.id}/view`, {
      method: "POST",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}, // nếu không có token thì để trống (nếu API không bắt buộc auth)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Header */}
      <div className="bg-blue-600 text-white py-16 pt-24 relative">
        {/* Nút Trang chủ nằm cố định trong header */}
        {!showFullPost && (
          <button
            className="absolute top-6 left-6 z-50 flex items-center text-white px-6 py-2 rounded font-semibold text-base shadow transition-all"
            style={{
              minWidth: 0,
              boxShadow: "0 6px 32px 0 rgba(65, 36, 36, 0.18)",
            }}
            onClick={handleHomeExit}
          >
            <ChevronLeft className="w-5 h-5 mr-2 text-white" />
            Trang chủ
          </button>
        )}
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
      <div className={`bg-white border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''
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
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                      }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>


              {/* Stats */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Thống kê</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Tổng bài viết:</span>
                    <span className="font-medium text-blue-900">{totalPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Lượt xem:</span>
                    <span className="font-medium text-blue-900">
{totalViews?.toLocaleString?.() ?? '0'}                    </span>

                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Đánh giá TB:</span>
                    <span className="font-medium text-blue-900">
                      <span>{averageRating?.toFixed(1) ?? "0.0"}⭐</span>
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
                <div className="relative h-[400px] md:h-[500px] bg-black rounded-t-lg overflow-hidden">
                  <img
                    src={`http://localhost:8080${filteredPosts[0].imageUrl}`}
                    alt={filteredPosts[0].title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <div className="p-6 text-white">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Nổi bật
                        </span>
                        <span className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(filteredPosts[0].createdAt)}
                        </span>
                        <div className="flex items-center">
                          {renderStars(filteredPosts[0].rating, filteredPosts[0].ratingCount)}
                        </div>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        {filteredPosts[0].title}
                      </h2>
                      <p className="text-gray-200 mb-4">
                        {filteredPosts[0].excerpt}
                      </p>
                      <div className="mt-3">
                        <button
                          onClick={() => handleOpenPost(filteredPosts[0])}
                          className="w-24 inline-flex items-center bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                          <div className='pl-4'>Đọc tiếp</div>
                          <ChevronRight className="h-10 w-4 ml-0" />
                        </button>

                      </div>
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
                      src={`http://localhost:8080${post.imageUrl}`}
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
                        Tác giả: {post.consultantName}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.createdAt)}
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


                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleOpenPost(post)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Đọc tiếp
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>


                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{(post.views || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {renderStars(post.rating, post.ratingCount)}
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

            {/* Pagination */}
            {filteredPosts.length > 0 && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                  onClick={handlePrevious}
                  disabled={pageInfo.page === 0}
                >
                  ◀ Trang trước
                </button>
                <span className="text-gray-700">
                  Trang {pageInfo.page + 1} / {pageInfo.totalPages}
                </span>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                  onClick={handleNext}
                  disabled={pageInfo.page + 1 >= pageInfo.totalPages}
                >
                  Trang sau ▶
                </button>
              </div>
            )}


            {/* No Results */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Không tìm thấy bài viết nào
                </h2>
                <p className="text-gray-600 mb-8">
                  Rất tiếc, chúng tôi không thể tìm thấy bài viết nào phù hợp với tiêu chí tìm kiếm của bạn.
                </p>
                <button
                  onClick={() => window.location.href = '/'} // Quay về trang chủ
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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