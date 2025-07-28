import React, { useState, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Settings, 
  Users, 
  MessageSquare, 
  Share, 
  Monitor,
  Clock,
  User
} from 'lucide-react';

const OnlineConsultation = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [consultationTime, setConsultationTime] = useState(0);
  const [isInCall, setIsInCall] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const upcomingSessions = [
    {
      id: 1,
      client: 'Nguyễn Thị Hoa',
      time: '10:00 SA',
      topic: 'Đánh giá chiến lược Marketing',
      avatar: 'NH',
      status: 'đang chờ'
    },
    {
      id: 2,
      client: 'Trần Văn Nam',
      time: '2:30 CH',
      topic: 'Buổi lập kế hoạch kinh doanh',
      avatar: 'TN',
      status: 'đã lên lịch'
    },
    {
      id: 3,
      client: 'Lê Thị Mai',
      time: '4:00 CH',
      topic: 'Workshop chiến lược tăng trưởng',
      avatar: 'LM',
      status: 'đã lên lịch'
    }
  ];

  const chatMessages = [
    {
      id: 1,
      sender: 'client',
      name: 'Nguyễn Thị Hoa',
      message: 'Chào anh Nguyễn Văn A, tôi có thể thấy và nghe anh rõ ràng!',
      time: '10:32 SA'
    },
    {
      id: 2,
      sender: 'consultant',
      name: 'Bạn',
      message: 'Hoàn hảo! Hãy cùng tìm hiểu về chiến lược marketing của chị.',
      time: '10:33 SA'
    },
    {
      id: 3,
      sender: 'client',
      name: 'Nguyễn Thị Hoa',
      message: 'Tôi đã chuẩn bị sẵn tài liệu để chia sẻ.',
      time: '10:35 SA'
    }
  ];

  useEffect(() => {
    let interval;
    if (isInCall) {
      interval = setInterval(() => {
        setConsultationTime(prev => prev + 1);
      }, 1000);
    } else {
      setConsultationTime(0);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startConsultation = (sessionId) => {
    setIsInCall(true);
    console.log('Bắt đầu tư vấn cho phiên:', sessionId);
  };

  const endConsultation = () => {
    setIsInCall(false);
    setConsultationTime(0);
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      console.log('Gửi tin nhắn chat:', chatMessage);
      setChatMessage('');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tư vấn trực tuyến</h1>
        <p className="text-gray-600">Tiến hành tư vấn video với khách hàng của bạn</p>
      </div>

      {!isInCall ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Phiên sắp tới</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{session.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{session.client}</h3>
                        <p className="text-gray-600 text-sm">{session.topic}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {session.time}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        session.status === 'đang chờ' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {session.status}
                      </span>
                      
                      {session.status === 'đang chờ' ? (
                        <button
                          onClick={() => startConsultation(session.id)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Tham gia cuộc gọi
                        </button>
                      ) : (
                        <button
                          onClick={() => startConsultation(session.id)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Bắt đầu sớm
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Settings */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Video className="w-4 h-4 mr-2" />
                  Kiểm tra Video & Âm thanh
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê hôm nay</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phiên hôm nay</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng thời gian</span>
                  <span className="font-medium">2 giờ 45 phút</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời lượng trung bình</span>
                  <span className="font-medium">55 phút</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">Mẹo chuyên nghiệp</h3>
              <p className="text-sm text-blue-100">
                Luôn kiểm tra camera và microphone trước khi bắt đầu buổi tư vấn để đảm bảo trải nghiệm tốt nhất cho khách hàng.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Video Call Area */}
          <div className="lg:col-span-3 bg-gray-900 rounded-xl overflow-hidden relative">
            {/* Client Video (Main) */}
            <div className="h-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <User className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold">Nguyễn Thị Hoa</h3>
                <p className="text-blue-100">Khách hàng</p>
              </div>
            </div>

            {/* Your Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              {isVideoOn ? (
                <div className="h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 mx-auto">
                      <User className="w-6 h-6" />
                    </div>
                    <p className="text-sm">Bạn</p>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-gray-800 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Call Info */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTime(consultationTime)}</span>
              </div>
            </div>

            {/* Call Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-black bg-opacity-50 px-6 py-3 rounded-full">
                <button
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className={`p-3 rounded-full transition-colors ${
                    isAudioOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isAudioOn ? (
                    <Mic className="w-5 h-5 text-white" />
                  ) : (
                    <MicOff className="w-5 h-5 text-white" />
                  )}
                </button>
                
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isVideoOn ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <VideoOff className="w-5 h-5 text-white" />
                  )}
                </button>
                
                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-full transition-colors ${
                    isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  <Monitor className="w-5 h-5 text-white" />
                </button>
                
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                </button>
                
                <button
                  onClick={endConsultation}
                  className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                >
                  <Phone className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col ${showChat ? 'block' : 'hidden lg:flex'}`}>
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'consultant' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs ${
                    msg.sender === 'consultant' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  } rounded-lg p-3`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'consultant' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <button
                  onClick={sendChatMessage}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineConsultation;